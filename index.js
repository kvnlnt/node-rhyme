var fs = require('fs');
var Lazy = require('lazy');

var dictFile = __dirname + '/data/cmudict.0.7a';
var offsets = {};

function eachLine (stream, cb) {
    var letter = null;
    var offset = 0;
    
    Lazy(stream).lines.map(String).forEach(function (line) {
        var x = line[0];
        if (x && x.match(/^[A-Z]/i)) {
            if (letter !== x) { // letter transition
                if (!offsets[x]) offsets[x] = offset;
            }
            var w = line.match(/^([A-Z][A-Z'-]*)/i);
            cb(line, w[0]);
        }
        
        offset += line.length + 1;
    });
}

var exports = module.exports = function (word, cb) {
    word = word.toUpperCase();
    
    var s = fs.createReadStream(dictFile);
    var rhymes = [];
    
    s.once('end', function () {
        cb(rhymes);
    });
    
    pronounce(word, function (ws) {
        var xs = ws.reduce(function (acc, w) {
            acc[active(w)] = true;
            return acc;
        }, {});
        
        eachLine(s, function (line, w) {
            if (w === word) return;
            var y = active(line.split(/\s+/).slice(1));
            if (xs[y]) rhymes.push(w);
        });
    });
};

exports.rhyme = exports;

var pronounce = exports.pronounce = function (word, cb) {
    word = word.toUpperCase();
    
    var start = offsets[word[0]];
    var end = offsets[String.fromCharCode(word[0].charCodeAt(0) + 1)];
    
    var s = fs.createReadStream(dictFile, {
        start : start,
        end : end,
    });
    
    s.once('end', function () {
        cb(found);
    });
    
    var found = [];
    
    eachLine(s, function (line, w) {
        if (w == word) {
            found.push(line.split(/\s+/).slice(1));
        }
        else if (found.length > 0) {
            s.emit('end');
        }
    });
};

function active (ws) {
    // active rhyming region: slice off the leading consonants
    for (
        var i = 0;
        i < ws.length && ws[i].match(/^[^AEIOU]/i);
        i++
    );
    return ws.slice(i).join(' ');
}
