module.exports = ftl2html;

var fs = require('fs');
var path = require('path');
var support = ['POST', 'PUT', 'DELETE'];
var GE = require('./generator');

function ftl2html(options) {

    function middleware(req, res, next){ 
        return GE.generate(options, req, res, next);
        
        // // 单独处理POST等请求
        // if (support.indexOf(req.method.toUpperCase()) != -1) {
        //     console.log(req.method.toUpperCase());
        //     // rewrite规则需要重新写
        //     var filepath = path.join('./test/mock/discovery/xhr', req.url.substring('/api/discovery/xhr'.length));
        //     console.log(filepath);
        //     if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        //         return res.end(fs.readFileSync(filepath));
        //     }
        // }

        // return next();
    };
    return middleware;
}
