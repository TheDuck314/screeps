var util = require('util');

module.exports = {
    run: function(creep) {
        util.tryPickupEnergy(creep);

        var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
        var src = util.storerAtPos(srcPos);
        if (creep.pos.isNearTo(srcPos)) {
            if (src) {
                if (util.tryRepair(creep, src)) return;
            }
        }

        //console.log('hello from ' + creep.name);
        if (creep.memory.upgrading == undefined) creep.memory.upgrading = false;
        //if (creep.name == 'LU7') console.log('creep.memory.upgrading = ' + creep.memory.upgrading);
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            var target = creep.room.controller;
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                util.myMoveTo(creep, creep.memory.destX, creep.memory.destY);
            } else {
                if (creep.pos.isNearTo(srcPos) && creep.carry.energy <= 20) {
                    if (src) {
                        var result = src.transfer(creep, RESOURCE_ENERGY);
                    }
                }
            }
        } else {
            if (creep.pos.isNearTo(srcPos)) {
                if (src) {
                    src.transfer(creep, RESOURCE_ENERGY);
                }
            } else {
                //creep.moveTo(src, {reusePath:2});
                util.myMoveTo(creep, srcPos);
            }
        }
    }
};
