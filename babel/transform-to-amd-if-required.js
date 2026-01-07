import {smart as template} from "@babel/template";
import modulesPlugin from '@babel/plugin-transform-modules-commonjs';


let buildDefine = template(`
  define(%%MODULE_NAME%%, %%SOURCES%%, function (%%PARAMS%%) {
    %%BODY%%;
  });
`);

export default function ({ types: t }) {
    function isValidRequireCall(path) {
        if (!path.isCallExpression()) return false;
        if (!path.get("callee").isIdentifier({ name: "require" })) return false;
        if (path.scope.getBinding("require")) return false;

        let args = path.get("arguments");
        if (args.length !== 1) return false;

        let arg = args[0];
        return arg.isStringLiteral();
    }

    function isValidDefaultRequire(path) {
        if(!path.isCallExpression()) return false;
        if(!path.get('callee').isIdentifier({name: '_interopRequireDefault'})) return false;

        let args = path.get('arguments');
        if(args.length !== 1) return false;

        return isValidRequireCall(args[0]);
    }

    function isValidDefine(path) {
        if (!path.isExpressionStatement()) return;

        let expr = path.get("expression");
        if (!expr.isCallExpression()) return false;
        if (!expr.get("callee").isIdentifier({ name: "define" }) &&
            !expr.get("callee").isIdentifier({ name: "require" })) return false;

        let args = expr.get("arguments");
        if (args.length === 3 && !args.shift().isStringLiteral()) return false;

        let firstArg = args.shift();
        if (firstArg.isArrayExpression()) {
            let secondArg = args.shift();
            if (secondArg.isFunctionExpression()) {
                return true;
            }
        } else if (firstArg.isFunctionExpression()) {
            return true;
        }

        return false;
    }

    function isValidRequireConfig(path) {
        if (!path.isExpressionStatement()) return;

        let expr = path.get("expression");
        if (!expr.isCallExpression()) return false;

        if (!expr.get("callee").get('object').isIdentifier({ name: "require" }) ||
            !expr.get("callee").get('property').isIdentifier({ name: "config" })) return false;

        return true;
    }

    let amdVisitor = {
        ReferencedIdentifier({ node, scope }) {
            if (node.name === "exports" && !scope.getBinding("exports")) {
                this.hasExports = true;
            }

            if (node.name === "module" && !scope.getBinding("module")) {
                this.hasModule = true;
            }
        },

        CallExpression(path) {
            if (!isValidRequireCall(path)) return;
            this.bareSources.push(path.node.arguments[0]);
            path.remove();
        },

        VariableDeclarator(path) {
            let id = path.get("id");
            if (!id.isIdentifier()) return;

            let init = path.get("init");

            if (isValidRequireCall(init)) {
                let dependency = init.node.arguments[0];
                this.sourceNames[dependency.value] = true;
                this.sources.push({moduleParam: id.node, dependency, identifier: null});
                path.remove();
            }

            if(isValidDefaultRequire(init)) {
                let dependency = init.node.arguments[0].arguments[0];
                this.sources.push({moduleParam: {type: 'Identifier', name: `${id.node.name}Module`}, dependency, identifier: id.node});
                path.remove();
            }

        }
    };

    return {
        inherits: modulesPlugin,

        pre() {
            // source strings
            this.sources = [];
            this.sourceNames = Object.create(null);


            // bare sources
            this.bareSources = [];

            this.hasExports = false;
            this.hasModule = false;
        },

        visitor: {
            Program: {
                exit(path, state) {
                    if (this.ran) return;
                    this.ran = true;

                    let body = path.get("body")
                    for (var i = 0; i < body.length; i++) {
                        if (isValidDefine(body[i]) || isValidRequireConfig(body[i])) return;
                    }

                    path.traverse(amdVisitor, this);

                    let params = this.sources.map(source => source.moduleParam);
                    let dependencies = this.sources.map(source => source.dependency);
                    let interopCalls = this.sources.filter(source => source.identifier !== null).map(({moduleParam, identifier}) => {
                        return template.ast`let ${identifier.name} = _interopRequireDefault(${moduleParam.name});`
                    });

                    dependencies = dependencies.concat(this.bareSources.filter((str) => {
                        return !this.sourceNames[str.value];
                    }));

                    let moduleName = this.getModuleName();
                    if (moduleName) moduleName = t.stringLiteral(moduleName);

                    if (this.hasExports) {
                        dependencies.unshift(t.stringLiteral("exports"));
                        params.unshift(t.identifier("exports"));
                    }

                    if (this.hasModule) {
                        dependencies.unshift(t.stringLiteral("module"));
                        params.unshift(t.identifier("module"));
                    }

                    path.node.body.unshift(...interopCalls);

                    path.node.body = [buildDefine({
                        MODULE_NAME: moduleName,
                        SOURCES: t.arrayExpression(dependencies),
                        PARAMS: params,
                        BODY: path.node.body
                    })];
                }
            }
        }
    };
}
