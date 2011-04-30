#!/usr/bin/env node
var http = require('http');
var Lazy = require('lazy');
var fs = require('fs');

var opts = {
    host : 'cmusphinx.svn.sourceforge.net',
    port : 80,
    path : '/svnroot/cmusphinx/trunk/cmudict/cmudict.0.7a',
};

http.get(opts, function (res) {
    if (res.statusCode !== 200) {
        console.error('Status: ' + res.statusCode)
        return;
    }
    
    var dict = {};
    
    res.on('end', function () {
        var str = JSON.stringify(dict);
        fs.writeFile(__dirname + '/dict.json', str, function (err) {
            if (err) console.error(err.stack || err)
            else console.log('ok')
        });
    });
    
    Lazy(res).lines.map(String).forEach(function (line) {
        if (line.match(/^[A-Z]/)) {
            var words = line.split(/\s+/);
            var word = words[0].replace(/\(\d\)$/, '');
            if (!dict[word]) dict[word] = [];
            dict[word].push(words.slice(1).join(' '));
        }
    });
});
