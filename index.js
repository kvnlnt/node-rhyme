var fs = require('fs');
var Lazy = require('lazy');
var Hash = require('hashish');

var dictFile = __dirname + '/data/cmudict.0.7a';

var exports = module.exports = function (cb) {
    var self = {};
    var dict = {};
    
    self.pronounce = function (word) {
        return dict[word];
    };
    
    self.rhyme = function (word) {
        var xs = dict[word].reduce(function (acc, w) {
            acc[active(w)] = true;
            return acc;
        }, {});
        
        return Hash(dict).reduce(function (acc, ps, w) {
            if (w === word) return;
            if (xs[active(ps)]) acc.push(w);
            return acc;
        }, []);
    };
    
    var s = fs.createReadStream(dictFile);
    
    s.on('end', function () {
        cb(self);
    });
    
    Lazy(s).lines.map(String).forEach(function (line) {
        if (line.match(/^[A-Z]/i)) {
            var words = line.split(/\s+/);
            var w = words[0].replace(/\(\d+\)$/);
            
            if (!dict[w]) dict[w] = [];
            dict[w].push(words.slice(1));
        }
    });
};
exports.rhyme = exports;

function active (ws) {
    // active rhyming region: slice off the leading consonants
    for (
        var i = 0;
        i < ws.length && ws[i].match(/^[^AEIOU]/i);
        i++
    );
    return ws.slice(i).join(' ');
}
