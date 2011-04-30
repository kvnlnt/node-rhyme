var assert = require('assert');
var rhyme = require('rhyme');

exports.orange = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 30000);
    
    rhyme('orange', function (rs) {
        clearTimeout(to);
        assert.eql(rs, []);
    })
};

exports.bed = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 30000);
    
    rhyme('bed', function (rs) {
        clearTimeout(to);
        assert.ok(rs.length > 1);
        assert.ok(rs.indexOf('RED') >= 0);
        assert.ok(rs.indexOf('BREAD') >= 0);
        assert.ok(rs.indexOf('BED') < 0);
    })
};
