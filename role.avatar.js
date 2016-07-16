var util = require('util');

module.exports = {
    run: function(creep) {
        /*var flagName = 'Avatar';
        var flag = Game.flags[flagName];
        if (!flag) return false;
        creep.moveTo(flag);*/
        
        /*if (creep.pos.isNearTo(Game.spawns.Spawn2)) {
            Game.spawns.Spawn2.recycleCreep(creep);
        } else {
            util.myMoveTo(creep, Game.spawns.Spawn2);
        }*/
        
        util.myMoveTo(creep, 33, 21);
    }
};
