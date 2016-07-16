var util = require('util');

module.exports = {
    run: function(creep) {
        var rcPos = new RoomPosition(creep.memory.rcPos.x, creep.memory.rcPos.y, creep.memory.rcPos.roomName);
        if (creep.pos.isNearTo(rcPos)) {
            var rc = util.structureAtPos(rcPos, STRUCTURE_CONTROLLER);
            if (rc) {
                creep.reserveController(rc);
            }
        } else {
            util.myMoveTo(creep, rcPos);
        }
    }
};
