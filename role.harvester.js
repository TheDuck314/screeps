var util = require('util');

module.exports = {
    run: function(creep) {
        creep.memory.role = 'upgrader'; return;
        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
        }
        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
        }
            
	    if(creep.memory.delivering) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN
                                || structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //creep.moveTo(target, {reusePath:2});
                    util.myMoveTo(creep, target.pos.x, target.pos.y);
                }
            }
        } else {
	        //if (creep.memory.srcid == undefined) creep.memory.srcid = 1;
	        var src = creep.room.find(FIND_SOURCES)[creep.memory.srcid];
            if (creep.pos.getRangeTo(src) <= 1) {
                creep.harvest(src);
            } else {
                //creep.moveTo(src, {reusePath:2});
                util.myMoveTo(creep, src.pos.x, src.pos.y);
            }
        }
	}
};
