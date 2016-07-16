var util = require('util');

module.exports = {
    run: function(creep) {
        if (creep.memory.mining == undefined) creep.memory.mining = true;
        if (creep.memory.mining && _.sum(creep.carry) == creep.carryCapacity) creep.memory.mining = false;
        if (!creep.memory.mining && _.sum(creep.carry) == 0) creep.memory.mining = true;
        
        if (creep.memory.mining) {
            var minerals = creep.room.find(FIND_MINERALS);
            if (minerals.length > 0) {
                var mineral = minerals[0];
                if (creep.pos.isNearTo(mineral)) {
                    creep.harvest(mineral);
                } else {
                    util.myMoveTo(creep, mineral);
                }
            }
        } else {
            if (creep.room.storage) {
                if (creep.pos.isNearTo(creep.room.storage)) {
                    for (var resource in creep.carry) {
                        if (creep.carry[resource] > 0) {
                            creep.transfer(creep.room.storage, resource);
                        }
                    }
                } else {
                    util.myMoveTo(creep, creep.room.storage);
                }
            }
        }
    }
};
