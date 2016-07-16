var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);
        util.tryRepairUnderneath(creep);
        
        if (creep.memory.building == undefined || (creep.memory.building && creep.carry.energy == 0)) {
            creep.memory.building = false;
            creep.memory.buildTarget = null;
        } 
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            // find the wall or rampart with the smallest hits
            let buildTarget = null;
            let structs = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART });
            //console.log('structs.length = ' + structs.length);
            let minHits = 999999999;
            for (let i in structs) {
                let struct = structs[i];
                if (struct.hits < minHits) {
                    buildTarget = struct;
                    minHits = struct.hits;
                }
            }
            creep.memory.buildTargetPos = buildTarget.pos;
            //console.log('creep.memory.buildTargetPos = ' + JSON.stringify(creep.memory.buildTargetPos));
        }
        
        if (creep.memory.building) {
            //console.log('building');
            //console.log('creep.memory.buildTargetPos = ' + JSON.stringify(creep.memory.buildTargetPos));
            let buildTargetPos = util.posFromMemory(creep.memory.buildTargetPos);
            let buildTarget = util.wallAtPos(buildTargetPos);
            if (buildTarget) {
                if (creep.pos.getRangeTo(buildTarget) <= 3) {
                    //console.log('repairing ' + JSON.stringify(buildTarget));
                    let result = creep.repair(buildTarget);
                    //console.log('result = ' + result);
                } else {
                    util.myMoveTo(creep, buildTarget);
                }
            } else {
                creep.memory.building = false;
            }
        } else {
            //console.log('not building');
            if (creep.pos.isNearTo(creep.room.storage)) {
                if (creep.room.storage.store[RESOURCE_ENERGY] > 10000) {
                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                }
            } else {
                util.myMoveTo(creep, creep.room.storage);
            }
        }
    }
};
