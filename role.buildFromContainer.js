var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);

        if (creep.memory.building == undefined) creep.memory.building = false;
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        if(creep.memory.building) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    //creep.moveTo(target, {reusePath:2});
                    util.myMoveTo(creep, target.pos.x, target.pos.y);
                }
            } else {
                creep.memory.role = 'recycle';
                return;
            }
        } else {
            var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
            if (creep.pos.isNearTo(srcPos)) {
                var src = util.storerAtPos(srcPos);
                if (!src) return; // source structure doesn't exist

                // only take if we are the most worthy nearby creep
                /*var space = creep.carryCapacity - creep.carry.energy;
                var allCreeps = creep.room.lookForAtArea(LOOK_CREEPS, src.pos.y-1, src.pos.x-1, src.pos.y+1, src.pos.x+1, true).map(x => x.creep);
                for (var i in allCreeps) {
                    if (allCreeps[i].memory.role == creep.memory.role) {
                        var creepSpace = allCreeps[i].carryCapacity - allCreeps[i].carry.energy;
                        if (creepSpace > 0 && creepSpace < space) {
                            console.log(creep.name + ' waiting because ' + allCreeps[i].name + ' is more worthy');
                            return; 
                        }
                    }
                }*/
                
                var reserve = 0;
                if (creep.memory.srcReserve != undefined) reserve = creep.memory.srcReserve;
                var amt = src.store.energy - reserve;
                if (amt > 0) {
                    if (amt > creep.carryCapacity - creep.carry.energy) amt = creep.carryCapacity - creep.carry.energy;
                    var result = src.transfer(creep, RESOURCE_ENERGY, amt);
                    if (result != OK) {
                        console.log('transfer result was ' + result + ' !!!');
                    }
                }
            } else {
                //creep.moveTo(src, {reusePath:2});
                util.myMoveTo(creep, srcPos);
            }

        }
    }
};
