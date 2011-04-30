var fs = require('fs');
var Lazy = require('lazy');

var offsets = {};

exports.pronounce = function (word, cb) {
    word = word.toUpperCase();
    var s = fs.createReadStream(__dirname + '/data/cmudict.0.7a');
    s.once('end', function () {
        cb(null, found);
    });
    
    var letter = null;
    var offset = 0;
    var found = [];
    
    Lazy(s).lines.forEach(function (line) {
        var x = String.fromCharCode(line[0]);
        if (x.match(/^[A-Z]/i)) {
            if (letter !== x) { // letter transition
                if (!offsets[x]) offsets[x] = offset;
            }
            
            var str = line.toString();
            var w = str.match(/^(\w+(?:'S)?)/);
            if (w && w[1] == word) {
                found.push(str.split(/\s+/).slice(1));
            }
            else if (found.length > 0) {
                s.emit('end');
            }
        }
        
        offset += line.length;
    });
};
