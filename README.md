# babel-proxy-server
A proxy server that babelifies js files

# How to use it ?

You just need to specify where the original files are either on a http server or a local file system.
If it is on the local system don't forget to add 3 x '/'

```
node src/server.js --proxyTarget=file:///Users/xyz/
``` 

This instruction would then create a webserver using as base the folder `/Users/xyz` and babelifies all the javascript files while keeping intact the other files. By default the webserver is available on port `9898`.


In coordination of `ngrok` it will also allow to have a public URL allowing to test local developement (please visit https://ngrok.com/).
For instance if you execute `ngrok http 9898` you will get a public http link allowing to access your local files currently in development.
