module.exports = {
    //myMoveTo: function(creep, destX, destY) {
    myMoveTo: function(creep, a, b) {
        var dest;
        if (arguments.length == 3) {
            dest = new RoomPosition(a, b, creep.room.name);
        } else if (arguments.length == 2) {
            dest = a; // hopefully a is a roomposition or similar
        } else {
            console.log('got ' + arguments.length + ' arguments in util.myMoveTo!');
            return;
        }
        
        if (creep.fatigue > 0) {
            creep.memory.lastMoveTime = Game.time;
            return;
        }
        if (creep.pos.getRangeTo(dest) <= 6) {
            creep.moveTo(dest, {reusePath:2});
        } else {
            var shouldIgnoreCreeps = true;
            if (creep.memory.lastMoveTime != undefined && creep.memory.lastMoveTime == Game.time - 1 && creep.pos.x == creep.memory.lastMoveX && creep.pos.y == creep.memory.lastMoveY) {
                if (creep.memory.moveBlockedTimer == undefined) {
                    creep.memory.moveBlockedTimer = 1;
                } else {
                    creep.memory.moveBlockedTimer += 1;
                    if (creep.memory.moveBlockedTimer >= 3) {
                        shouldIgnoreCreeps = false;
                    }
                }
                //console.log("creep at " + creep.pos.x + "," + creep.pos.y + ": moveBlockedTimer=" + creep.memory.moveBlockedTimer);
                //creep.say("mBT=" + creep.memory.moveBlockedTimer);
            } else {
                creep.memory.moveBlockedTimer = 0;
            }
            creep.moveTo(dest, {reusePath:2, ignoreCreeps:shouldIgnoreCreeps});
            creep.memory.lastMoveTime = Game.time;
            creep.memory.lastMoveX = creep.pos.x;
            creep.memory.lastMoveY = creep.pos.y;
        }
    },
    
    tryPickupEnergy: function(creep) {
        let energies = creep.room.lookForAtArea(LOOK_ENERGY, creep.pos.y-1, creep.pos.x-1, creep.pos.y+1, creep.pos.x+1, true);
        for (let i in energies) {
            let resource = energies[i].energy;
            if (resource.resourceType == RESOURCE_ENERGY) {
                console.log(creep.name + ' picking up ' + JSON.stringify(energies[i].energy));
                let result = creep.pickup(energies[i].energy);
            }
        }
    },
    
    tryRepair: function(creep, target) {
        if (target.hits <= target.hitsMax - creep.getActiveBodyparts(WORK)*REPAIR_POWER) {
            // container can be repaired
            if (creep.carry.energy >= creep.getActiveBodyparts(WORK)*REPAIR_POWER*REPAIR_COST) {
                // we have the energy to do the repair
                creep.repair(target);
                console.log(creep.name + ' repaired ' + target.structureType + ' at ' + target.pos.x + ',' + target.pos.y);
                return true;
            }
        }
        return false;
    },
    
    tryRepairUnderneath: function(creep) {
        if (creep.getActiveBodyparts(WORK) >= 1) {
            var repairAmt = creep.getActiveBodyparts(WORK) * REPAIR_POWER;
            var repairCost = repairAmt * REPAIR_COST;
            if (creep.carry.energy >= repairCost) {
                var structuresHere = creep.pos.lookFor(LOOK_STRUCTURES);
                if (structuresHere.length > 0) {
                    var struct = structuresHere[0];
                    if (struct.hits <= struct.hitsMax - repairAmt) {
                        console.log('transporter repairing at ' + creep.pos.x + ',' + creep.pos.y);
                        creep.repair(struct);
                        //return;
                    }
                }
            }
        }
    },

    
    storerAtPos: function(pos) {
        var storers = pos.lookFor(LOOK_STRUCTURES);
        for (var i in storers) {
            var type = storers[i].structureType;
            if (type == STRUCTURE_CONTAINER || type == STRUCTURE_STORAGE || type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION
                    || type == STRUCTURE_LINK || type == STRUCTURE_TOWER) {
                return storers[i];
            }
        }
        return null;
    },
    
    sourceAtPos: function(pos) {
        var srcs = pos.lookFor(LOOK_SOURCES);
        if (srcs.length > 0) {
            return srcs[0];
        } else {
            return null;
        }
    },
    
    structureAtPos: function(pos, type) {
        var structs = pos.lookFor(LOOK_STRUCTURES);
        for (var i in structs) {
            if (structs[i].structureType == type) {
                return structs[i];
            }
        }
        return null;
    },
    
    wallAtPos: function(pos) {
        let structs = pos.lookFor(LOOK_STRUCTURES);
        for (let i in structs) {
            if (structs[i].structureType == STRUCTURE_WALL || structs[i].structureType == STRUCTURE_RAMPART) {
                return structs[i];
            }
        }
        return structs[i];
    },
    
    findClosestSpawn: function(creep) {
        var minDist = 999999.9;
        var closestSpawn = null;
        for (let name in Game.spawns) {
            let spawn = Game.spawns[name];
            let dist = creep.pos.getRangeTo(spawn);
            if (dist < minDist) {
                closestSpawn = spawn;
                minDist = dist;
            }
        }
        return closestSpawn
    },
    
    posFromMemory: function(memPos) {
        return new RoomPosition(memPos.x, memPos.y, memPos.roomName);
    }
};
