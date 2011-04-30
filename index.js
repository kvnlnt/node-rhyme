var exports = module.exports = function (word, cb) {
    var xs = pronounce(word).reduce(function (acc, x) {
        acc[active(x)] = true;
        return acc;
    }, {});
    
    return Object.keys(dict).filter(function (w) {
        var ys = dict[w].map(active);
        
        return ys.some(function (y) { return xs[y] });
    });
};
exports.rhyme = exports;

var fs = require('fs');
var dict = exports.dict = JSON.parse(
    fs.readFileSync(__dirname + '/data/dict.json', 'utf8')
);

exports.pronounce = function (word) {
    return dict[word];
};

function active (ps) {
    // active rhyming region: slice off the leading consonants
    var ws = ps.split(' ');
    for (
        var i = 0;
        i < ws.length && ws[i].match(/^[^AEIOU]/i);
        i++
    );
    return ws.slice(i).join(' ');
}
