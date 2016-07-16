

function tryAttackHostiles(creep) {
    var hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    var maxScore = 0;
    var structToAttack = null;
    for (var i in hostileStructures) {
        var struct = hostileStructures[i];
        var score = 0;
        if (struct.structureType == STRUCTURE_TOWER) score += 10000.0;
        else if (struct.structureType == STRUCTURE_SPAWN) score += 1000.0;
        else if (struct.structureType == STRUCTURE_EXTENSION) score += 100.0;
        else if (struct.structureType == STRUCTURE_CONTROLLER) score -= 1.0;
        else if (struct.structureType == STRUCTURE_RAMPART) score -= 1.0;
        else score += 1.0;
        if (score > maxScore) {
            structToAttack = struct;
            maxScore = score;
        }
    }
    console.log('structToAttack = ' + JSON.stringify(structToAttack));
    if (structToAttack) {
        creep.attack(structToAttack);
        creep.moveTo(structToAttack);
        return true;
    }

    var hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (hostileCreep) {
        creep.attack(hostileCreep);
        creep.moveTo(hostileCreep);
        return true;
    }

    return false;
}

function goToFlag(creep) {
    var flagName = 'SoldierRally';
    var flag = Game.flags[flagName];
    if (!flag) return false;
    creep.moveTo(flag);
    return true;
}

module.exports = {
    run: function(creep) {
        if (tryAttackHostiles(creep)) return;
        goToFlag(creep);
    }
};
