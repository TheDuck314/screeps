var util = require('util');

module.exports = {
    run: function(creep) {
        var spawn = util.findClosestSpawn(creep);
        if (spawn) {
            if (creep.pos.isNearTo(spawn)) {
                spawn.recycleCreep(creep);
            } else {
                util.myMoveTo(creep, spawn);
            }
        }
    }
};
