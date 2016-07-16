function rateEnemyCreep(enemy) {
    var score = 0.0;
    
    // most important criterion: number of HEAL parts
    for (var i in enemy.body) {
        var part = enemy.body[i].type;
        if (part == HEAL) score += 10000.0;
    }
    
    // creeps with less hits get higher score
    score -= enemy.hits;
    
    return score;
}

module.exports = {
    run: function(tower) {
        if (tower.energy < 10) return;
        
        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        //console.log('hostiles.length = ' + hostiles.length);
        var maxScore = -999999.0;
        var hostileToAttack = null;
        for (var i in hostiles) {
            var hostile = hostiles[i];
            var score = rateEnemyCreep(hostile);
            if (score > maxScore) {
                hostileToAttack = hostile;
                maxScore = score;
            }
        }
        //console.log('hostileToAttack = ' + hostileToAttack);
        if (hostileToAttack) {
            var result = tower.attack(hostileToAttack);
            //console.log('attacking ' + hostileToAttack + ', result = ' + result);
            return;

        }
        
        // repair damaged structures
        var structs = tower.room.find(FIND_MY_STRUCTURES);
        
        var myNeutrals = tower.room.find(FIND_STRUCTURES, {filter: (struct) => (struct.structureType == STRUCTURE_ROAD /*|| struct.structureType == STRUCTURE_CONTAINER*/)});
        structs = structs.concat(myNeutrals);
        
        var toRepair = undefined;
        var minHits = 999999999;
        for (var s in structs) {
            var struct = structs[s];
            if ((struct.structureType != STRUCTURE_RAMPART && (struct.hits <= struct.hitsMax - 2000 && struct.hits < minHits))
                || (struct.structureType == STRUCTURE_RAMPART && struct.hits <= 1000)) {
                toRepair = struct;
                minHits = struct.hits;
            }
        }
        if (toRepair != undefined) {
            console.log('minHits = ' + minHits);
            tower.repair(toRepair);
        } else {
            //console.log('nothing damaged enough to repair');
        }
        
        var damagedCreeps = tower.room.find(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
        for (var i in damagedCreeps) {
            tower.heal(damagedCreeps[i]);
            return;
        }
        

        if (Game.time % 20 == 0) {
            var walls = tower.room.find(FIND_STRUCTURES, {filter: (struct) => (struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART)});
            console.log('wall repair time! walls.length = ' + walls.length);
            var toRepair = undefined;
            var minHits = 999999999;
            for (var i in walls) {
                var wall = walls[i];
                if (wall.hits < minHits) {
                    toRepair = wall;
                    minHits = wall.hits;
                }
            }
            if (toRepair != undefined) {
                console.log('minHits = ' + minHits);
                tower.repair(toRepair);
            } else {
                console.log('nothing damaged enough to repair');
            }
        }
        
        // todo: repair creeps
        
        // todo: attack hostiles
    }
};
