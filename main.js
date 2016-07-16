var roles = {};
var structs = {};

module.exports.loop = function () {
    //return;
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }    
    
    var scriptedStructs = [ STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LINK ];
    
    for (var name in Game.structures) {
        var struct = Game.structures[name];
        var type = struct.structureType;
        if (scriptedStructs.includes(type)) {
            if (!(type in structs)) {
                structs[type] = require('struct.' + type);
            }
            structs[type].run(struct);
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == undefined) {
            console.log(creep.memory.name + ' has no role!');
        } else {
            if (!(creep.memory.role in roles)) {
                //console.log('loading role ' + creep.memory.role);
                roles[creep.memory.role] = require('role.' + creep.memory.role);
            }
            roles[creep.memory.role].run(creep);
        }
    }
}
