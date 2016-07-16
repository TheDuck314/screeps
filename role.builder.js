var util = require('util');

module.exports = {
    run: function(creep) {
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
            var sources = creep.room.find(FIND_SOURCES);
            var src = sources[creep.memory.srcid];
            if(creep.harvest(src) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(src, {reusePath:2});
                util.myMoveTo(creep, src.pos.x, src.pos.y);
            }
        }
    }
};
