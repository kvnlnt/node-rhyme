var assert = require('assert');
var rhyme = require('rhyme');

exports.orange = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 30000);
    
    rhyme('orange', function (rs) {
        assert.eql(rs, []);
        
        rhyme.pronounce('orange', function (p) {
            clearTimeout(to);
            assert.eql(p.length, 2);
        });
    });
    
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
