var util = require('util');

module.exports = {
    run: function(creep) {
        // first, try to attack hostile creeps in the current room
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
        if (hostiles.length > 0) {
            var closestHostile = creep.pos.findClosestByPath(hostiles);
            creep.attack(closestHostile);
            creep.rangedAttack(closestHostile);
            creep.moveTo(closestHostile);
            return;
        } 
        
        // no enemies. heal if less than full health
        if (creep.hits < creep.hitsMax) {
            var spawn = util.findClosestSpawn(creep);
            if (spawn) {
                util.myMoveTo(creep, spawn);
                return;
            }
        }
        
        // full health, no enemies. go to the rally point
        var rallyPos = new RoomPosition(creep.memory.rallyPos.x, creep.memory.rallyPos.y, creep.memory.rallyPos.roomName);
        util.myMoveTo(creep, rallyPos);
    }
};
