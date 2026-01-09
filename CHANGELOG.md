# Changelog

## [2.1.0](https://github.com/cheminfo/babel-proxy-server/compare/v2.0.1...v2.1.0) (2026-01-09)


### Features

* add support of arrow functions in amd define statements ([#21](https://github.com/cheminfo/babel-proxy-server/issues/21)) ([a0257ab](https://github.com/cheminfo/babel-proxy-server/commit/a0257ab0a9797e0794805077b60fb239dd10e10b))

## [2.0.1](https://github.com/cheminfo/babel-proxy-server/compare/v2.0.0...v2.0.1) (2026-01-09)


### Bug Fixes

* update babel package ([1adc176](https://github.com/cheminfo/babel-proxy-server/commit/1adc176aabc45f788906527005b77d2dbfab8693))

## [2.0.0](https://github.com/cheminfo/babel-proxy-server/compare/v1.0.0...v2.0.0) (2026-01-09)


### ⚠ BREAKING CHANGES

* significant dependency updates, including Node.js runtime. Babel transpiler produces a different output.

### Bug Fixes

* allow destructuring when using require ([#18](https://github.com/cheminfo/babel-proxy-server/issues/18)) ([c839c94](https://github.com/cheminfo/babel-proxy-server/commit/c839c94ab40a4d31c6576a700c225da08f16a4f3))


### Miscellaneous Chores

* upgrade deps ([#14](https://github.com/cheminfo/babel-proxy-server/issues/14)) ([827a7a3](https://github.com/cheminfo/babel-proxy-server/commit/827a7a32511724d99530da57d6b817d4d67c4917))

## 1.0.0 (2022-09-23)


### Features

* add --noBabel option in order to use as a simple proxy ([065f17a](https://github.com/cheminfo/babel-proxy-server/commit/065f17a4eabab905c757c0169e4153a5c67b236d))
* add Dockerfile ([60a890e](https://github.com/cheminfo/babel-proxy-server/commit/60a890ef2b0a56148ec5deff364cab232cc974b0))
* Add possibility to proxy to file system ([3cba094](https://github.com/cheminfo/babel-proxy-server/commit/3cba094b02347c5654db74a3ad85dedd0c7bd42c))
* allow to add proxies ([493059a](https://github.com/cheminfo/babel-proxy-server/commit/493059a994c60132b2215a87e7e28107ac1ec677))
* automatic share of the parent git folder ([fa38042](https://github.com/cheminfo/babel-proxy-server/commit/fa380427295aa0decb02be92a7ce507fb0fdcb36))


### Bug Fixes

* add readme to start the server ([1985f9c](https://github.com/cheminfo/babel-proxy-server/commit/1985f9c08027f62cb7e8bc79258e4eafee70a97d))
* make express proxy middleware work again ([6cbf83b](https://github.com/cheminfo/babel-proxy-server/commit/6cbf83b97f6fcc6bd656e79da8b7d9df41aaa14a))
* plugin instead of preset ([7aedfc8](https://github.com/cheminfo/babel-proxy-server/commit/7aedfc8b11edcb3f6c9beabd0e8a363ffbaf7849))
* prepare for Docker deployment ([43c9bd8](https://github.com/cheminfo/babel-proxy-server/commit/43c9bd8f4652a1e1feb64750552b9b59f91b1dcc))
* replace all .. with . ([13aa6d4](https://github.com/cheminfo/babel-proxy-server/commit/13aa6d45cb22dd539a7288b5b7bff8a2f184893b))
* resolve proxy url correctly when target has a path ([25a4e69](https://github.com/cheminfo/babel-proxy-server/commit/25a4e690b0acab40a70e18fb65dfa6a0e1cb35c4))
