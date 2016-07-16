var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);
        util.tryRepairUnderneath(creep);
        
        if (creep.memory.working == undefined) creep.memory.working = false;
        if (creep.memory.working && creep.carry.energy == 0) creep.memory.working = false;
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
        
        if (creep.memory.working) {
            // fill spawns and extensions
            var fillables = creep.room.find(FIND_MY_STRUCTURES, 
                  { filter: s => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity });
            var closestFillable = creep.pos.findClosestByPath(fillables);
            if (closestFillable) {
                if (creep.pos.isNearTo(closestFillable)) {
                    creep.transfer(closestFillable, RESOURCE_ENERGY);
                } else {
                    util.myMoveTo(creep, closestFillable);
                }
                return;
            }

            // build construction sites
            var constructionSite = creep.pos.findClosestByPath(creep.room.find(FIND_CONSTRUCTION_SITES));
            if (constructionSite) {
                if (creep.pos.getRangeTo(constructionSite) <= 3) {
                    creep.build(constructionSite);
                } else {
                    util.myMoveTo(creep, constructionSite);
                }
                return;
            }
            
            // upgrade the room controller
            if (creep.room.controller.my) {
                if (creep.pos.getRangeTo(creep.room.controller) <= 3) {
                    creep.upgradeController(creep.room.controller);
                } else {
                    util.myMoveTo(creep, creep.room.controller);
                }
                return;
            }
        } else {
            var source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
            if (source) {
                if (creep.pos.isNearTo(source)) {
                    creep.harvest(source);
                } else {
                    util.myMoveTo(creep, source);
                }
            }
        }
    }
};
