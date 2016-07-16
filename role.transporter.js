var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);
        util.tryRepairUnderneath(creep);
        
        // build construction sites we pass
        if (creep.getActiveBodyparts(WORK) >= 1) {
            var buildCost = BUILD_POWER * creep.getActiveBodyparts(WORK);
            if (creep.carry.energy >= buildCost) {
                // try repairing
                var R=3;
                var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: s => s.pos.getRangeTo(creep.pos) <= 3 });
                if (constructionSites.length > 0) {
                    var site = constructionSites[0];
                    creep.build(site);
                    return;
                }
            }
        }
        
        if (creep.memory.delivering == undefined) creep.memory.delivering = false;
        if (creep.memory.delivering && creep.carry.energy < 5) {
            creep.memory.delivering = false;
        }
        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
        }
        
        
        
        var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
        //console.log('src = ' + src)
        var destPos =  new RoomPosition(creep.memory.destPos.x, creep.memory.destPos.y, creep.memory.destPos.roomName);
        
	    if(creep.memory.delivering) {
            if (creep.pos.isNearTo(destPos)) {
                var dest = util.storerAtPos(destPos);
                if (dest) {
                    creep.transfer(dest, RESOURCE_ENERGY);
                }
            } else {
                //creep.moveTo(dest);
                util.myMoveTo(creep, destPos);
            }
        } else {
            //console.log('transporter ' + creep.name);
            if (creep.pos.isNearTo(srcPos)) {
                var src = util.storerAtPos(srcPos);
                if (!src) return; // no source, nothing to do
                if (creep.memory.srcReserve == undefined) {
                    creep.withdraw(src, RESOURCE_ENERGY);
                } else {
                    var amt = src.store.energy - creep.memory.srcReserve;
                    if (amt > creep.carryCapacity - creep.carry.energy) {
                        amt = creep.carryCapacity - creep.carry.energy;
                    }
                    if (amt > 0) {
                        creep.withdraw(src, RESOURCE_ENERGY, amt);
                    }
                }
            } else {
                //creep.moveTo(src);
                util.myMoveTo(creep, srcPos);
            }
        }
	}
};
