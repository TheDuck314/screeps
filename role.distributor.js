var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);

        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
        }
        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
        }
            
	    if(creep.memory.delivering) {
	        var dests = creep.room.find(FIND_MY_STRUCTURES).filter(s => 
	                       ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER)
	                        && (s.energy < s.energyCapacity)));
            if (dests.length > 0) {
                var target = creep.pos.findClosestByPath(dests);
                if (target) {
                    if (creep.pos.isNearTo(target)) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    } else {
                        //creep.moveTo(dest);
                        util.myMoveTo(creep, target.pos.x, target.pos.y);
                    }
                }
            } else {
                // idle
                util.myMoveTo(creep, creep.memory.idleX, creep.memory.idleY);
            }
        } else {
            if (creep.memory.srcPos == undefined) {
                creep.memory.srcPos = new RoomPosition(creep.memory.src.pos.x, creep.memory.src.pos.y, creep.memory.src.pos.roomName);
            } 
            var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
            if (creep.pos.isNearTo(srcPos)) {
                var src = util.storerAtPos(srcPos);
                if (src) {
                    creep.withdraw(src, RESOURCE_ENERGY); 
                }
            } else {
                //creep.moveTo(src);
                util.myMoveTo(creep, srcPos.x, srcPos.y);
            }
        }
	}
};
