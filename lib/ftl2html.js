module.exports = ftl2html;

var fs = require('fs');
var path = require('path');
var support = ['POST', 'PUT', 'DELETE'];
var GE = require('./generator');

function ftl2html(options) {

    function middleware(req, res, next){ 
        return GE.generate(options, req, res, next);
    };
    return middleware;
}
