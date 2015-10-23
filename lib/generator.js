// var spawn = require('child_process').spawn;
var exec = require('sync-exec');
var http = require('http');
var url = require('url');
var fs = require('fs');
var os = require('os');
var mapping = require('./mapping');
var pathUtil = require('path');

function generate(options, req, res, next) {
    var config, configFile;
    if (typeof options.configFile === 'string') {
        configFile = options.configFile;
        var data = fs.readFileSync(configFile);
        try {
            config = JSON.parse(data);
        } catch (ex) {
            console.error('JSON parse failed: ' + data);
            throw ex;
        }
    } else {
        console.error('configFile should be existed in options.ftl2html');
        return;
    }
    var host = req.headers.host;
    // the hostname
    var hostname = host.split(':')[0];
    var oUrl = url.parse(req.url);

    // /xxxx/test/xx
    var pathname = oUrl.pathname;
    // a=b&c=d
    var fullQuery = oUrl.query;
    var fullPath = 'http://' + hostname + pathname;

    // console.log('fullQuery:' + fullQuery);
    var map = mapping(config, fullPath, fullQuery);
    // console.log('map: ' + map);
    if (map) {
        var outputFile;
        if (map.Config.OutputFileName && map.Config.OutputFileName.length > 0) {
            outputFile = map.Config.OutputRoot + map.Config.OutputFileName;
        } else {
            var path = fullPath.substring(map.Config.HttpUrlRoot.length);
            outputFile = map.Config.OutputRoot + path;
        }
        
        // 转换
        convert(configFile, fullPath, fullQuery);
        
        return res.end(fs.readFileSync(outputFile));
    } else {
        return next();
    }
}

function exe(options) {
    var start = new Date().getTime();
    var cmd = options.join(' ');
    exec(cmd, 5000);
    console.log('Ftl generated cost: ' + (new Date().getTime() - start) + 'ms');
};

function convert(configFile, fullPath, fullQuery) {
    // console.log('exec ftl');
    var jarPath = pathUtil.join(__dirname, "../jar/local-node-1.0.1.jar");

    if (os.platform() === 'win32') {
        // windows
        var opts = ["cmd", "/c", "java", "-jar", jarPath, configFile, fullPath, fullQuery];
    } else {
        // mac linux
        var opts = ["java", "-jar", jarPath, configFile, fullPath, fullQuery];
    }
    exe(opts);
}

module.exports = {
    generate: generate,
    convert: convert
};
