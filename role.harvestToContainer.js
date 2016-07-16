var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);

        //console.log('harvestToContainer ' + creep.name + ' src = ' + creep.memory.src.id + ' dest = ' + creep.memory.dest.id);
        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
        }
        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
        }
            
	    var destPos = new RoomPosition(creep.memory.destPos.x, creep.memory.destPos.y, creep.memory.destPos.roomName);
	    var dest = util.storerAtPos(destPos);
        var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
	    
	    if(creep.memory.delivering) {
	        if (!dest) return; // destination container doesn't exist
	        
            if (creep.pos.isNearTo(dest)) {
                creep.transfer(dest, RESOURCE_ENERGY);
            } else {
                //creep.moveTo(dest);
                util.myMoveTo(creep, dest.pos.x, dest.pos.y);
            }
        } else {
            //console.log('src = ' + src);
            //console.log('src.pos = ' + src.pos);
            //console.log('src.pos.x = ' + src.pos.x);
            if (creep.pos.isNearTo(srcPos)) {
                var src = util.sourceAtPos(srcPos);
                creep.harvest(src);
                
                if (dest) {
                    if (creep.pos.isNearTo(dest)) {
                        creep.transfer(dest, RESOURCE_ENERGY);
                    }
                }
            } else {
                //creep.moveTo(src);
                util.myMoveTo(creep, srcPos);
            }
        }
	}
};
