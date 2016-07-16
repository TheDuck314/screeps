var util = require('util');

function controllerNeedsReserver(rc) {
    return !(rc && rc.reservation && rc.reservation.ticksToEnd > 4500);
}


function planE1N29() {
    var room = Game.rooms['E1N29'];
    
    var leftContainerPos = new RoomPosition(4, 43, 'E1N29');
    var rightStoragePos = new RoomPosition(32, 23, 'E1N29');
    var rightStorage = util.storerAtPos(rightStoragePos);
    var leftSourcePos = new RoomPosition(3, 43, 'E1N29');
    var leftLinkPos = new RoomPosition(5, 43, 'E1N29');
    var rightSourcePos = new RoomPosition(31, 26, 'E1N29');
    var rightLinkPos = new RoomPosition(32, 24, 'E1N29');
    var rcContainerPos = new RoomPosition(33, 13, 'E1N29');
    var rcX = 34, rcY = 11;
    var distIdleX = 35, distIdleY = 23;
    var lowerLinkPos = new RoomPosition(26, 47, 'E1N29');
    

    var downSourcePos = new RoomPosition(38, 11, 'E1N28');
    var downContainerPos = new RoomPosition(38, 12, 'E1N28');
    var downRcPos = new RoomPosition(38, 10, 'E1N28');
    var downRc = Game.getObjectById('55db32efefa8e3fe66e054d8');
    var downRallyPos = new RoomPosition(31, 12, 'E1N28');
    
    var underSourcePos = new RoomPosition(16, 14, 'E1N27');
    var underContainerPos = new RoomPosition(17, 14, 'E1N27');
    var underRcPos = new RoomPosition(30, 24, 'E1N27');
    var underRc = Game.getObjectById('55db32f0efa8e3fe66e054dc');
    var underRallyPos = new RoomPosition(22, 19, 'E1N27');
    
    function downHarvester(i) {
        return { name: 'DH'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 95,
                 memory: { role: 'harvestToContainerDrop', srcPos: downSourcePos, containerPos: downContainerPos } };
    }
    
    function transporterFromDown(i) {
        return { name: 'DT'+i,
                 body: [ WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 120,
                 memory: { role: 'transporter', srcPos: downContainerPos, destPos: lowerLinkPos } };
    }
    
    function downReserver(i) {
        return { name: 'DR'+i,
                 body: [ CLAIM, CLAIM, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: function() { return controllerNeedsReserver(downRc); },
                 memory: { role: 'reserver', rcPos: downRcPos } };
    }
    
    function downDefender(i) {
        return { name: 'DD'+i,
                 body: [ TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
                 respawnEarlyTicks: 70,
                 memory: { role: 'defender', rallyPos: downRallyPos } };
    }
    
    function underHarvester(i) {
        return { name: 'UH'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 150,
                 memory: { role: 'harvestToContainerDrop', srcPos: underSourcePos, containerPos: underContainerPos } };
    }
    
    function transporterFromUnder(i) {
        return { name: 'UT'+i,
                 body: [ WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 160,
                 memory: { role: 'transporter', srcPos: underContainerPos, destPos: lowerLinkPos } };
    }
    
    function underReserver(i) {
        return { name: 'UR'+i,
                 body: [ CLAIM, CLAIM, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: function() { return controllerNeedsReserver(underRc); },
                 memory: { role: 'reserver', rcPos: underRcPos } };
    }

    function underDefender(i) {
        return { name: 'UD'+i,
                 body: [ TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
                 respawnEarlyTicks: 100,
                 memory: { role: 'defender', rallyPos: underRallyPos } };
    }
    

    function rightUpgrader(i) {
        return { name: 'RU'+i, 
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE ],
                 respawnEarlyTicks: 40,
                 condition: () => (i <= 2 || room.storage.store[RESOURCE_ENERGY] > 150000),
                 memory: { role: 'upgradeFromContainer', srcPos: rcContainerPos, destX: 33, destY: 11 } };
    }
    
    //var harvesterBody = [ WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE ];
    var dropHarvesterBody = [ WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE ];

    function leftHarvester(i) {
        return { name: 'LH'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 60,
                 memory: { role: 'harvestToContainer', srcPos: leftSourcePos, destPos: leftLinkPos } };
    }
    
    function rightHarvester(i) {
        return { name: 'RH'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE ],
                 respawnEarlyTicks: 40,
                 memory: { role: 'harvestToContainer', srcPos: rightSourcePos, destPos: rightLinkPos } };
    }
    
    var distributorBody = [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ];
    
    function rightDistributor(i) {
        return { name: 'RD'+i,
                 body: distributorBody,
                 respawnEarlyTicks: 750,
                 memory: { role: 'distributor', srcPos: rightStoragePos, idleX: distIdleX, idleY: distIdleY } };
    }
    
    function emergencyDistributor(i) {
        return { name: 'ED'+i,
                 body: [ CARRY, CARRY, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: function() { return !('RD1' in Game.creeps) && !('RD1b' in Game.creeps) && room.find(FIND_HOSTILE_CREEPS).length == 0; },
                 memory: { role: 'distributor', src: rightStorage, idleX: distIdleX, idleY: distIdleY } };
    }

    function transporterToRC(i) {
        return { name: 'RT'+i,
                 body: [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 72,
                 memory: { role: 'transporter', srcPos: rightStoragePos, srcReserve: 100000, destPos: rcContainerPos } };
    }
    
    function rightLinkToStorageTransporter(i) {
        return { name: 'RTL'+i,
                 body: [ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE ],
                 respawnEarlyTicks: 30,
                 memory: { role: 'transporter', srcPos: rightLinkPos, destPos: rightStoragePos } };
    }
    
    function rightBuilder(i) {
        return { name: 'RB'+i,
                 body: [ CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: () => (room.find(FIND_CONSTRUCTION_SITES).length > 0),
                 memory: { role: 'buildFromContainer', srcPos: rightStoragePos, srcReserve: 10000 } };
    }
    
    function soldier(i) {
        return { name: 'S'+i,
                 body: [ TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                         ATTACK, ATTACK, ATTACK, ATTACK, ATTACK ] ,
                condition: () => false,
                memory: { role: 'soldier' } };
    }
    
    function newReserver(i) {
        return { name: 'NR'+i,
                 body: [ CLAIM, CLAIM, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 memory: { role: 'reserver', rcPos: newRcPos } };
    }
    
    function avatar(i) {
        return { name: 'AV'+i,
                 body: [ WORK, CARRY, MOVE ],
                 respawnEarlyTicks: -1,
                 memory: { role: 'avatar' } };
    }
    
    function handyman(i) {
        return { name: 'X'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 memory: { role: 'avatar' } };
    }
    
    function mineralMiner(i) {
        return { name: 'MM'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: () => room.find(FIND_MINERALS)[0].mineralAmount > 0,
                 memory: { role: 'mineralMiner' } };
    }
    
    function wallBuilder(i) {
        return { name: 'OWB'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                respawnEarlyTicks: -1,
                memory: { role: 'wallBuilder' } };
    }

    var plan = [emergencyDistributor(1),
                //handyman(2),
                rightDistributor(1),
                rightHarvester(1), 
                rightLinkToStorageTransporter(1),
                leftHarvester(1),
                transporterToRC(1),
                rightUpgrader(1), rightUpgrader(2), rightUpgrader(3),
                downDefender(1), downHarvester(1), transporterFromDown(1), downReserver(1),
                underDefender(1), underHarvester(1), transporterFromUnder(1), underReserver(1), transporterFromUnder(2), 
                rightBuilder(1),
                mineralMiner(1),
                wallBuilder(1) /*, wallBuilder(2)*/
                //newReserver(1)
                //soldier(1)
                 ];
    
    return plan;
}

function planE4N28() {
    var room = Game.rooms['E4N28'];
    
    var leftSourcePos = new RoomPosition(27, 24, 'E4N28');
    var leftSourceContainerPos = new RoomPosition(28, 25, 'E4N28');
    var rightSourcePos = new RoomPosition(46, 13, 'E4N28');
    var rightSourceContainerPos = new RoomPosition(45, 14, 'E4N28');
    var rcContainerPos = new RoomPosition(37, 26, 'E4N28');
    let storagePos = new RoomPosition(30, 24, 'E4N28');

    let downSourcePos = new RoomPosition(23, 30, 'E4N27');
    let downContainerPos = new RoomPosition(22, 31, 'E4N27');
    let downRallyPos = new RoomPosition(20, 21, 'E4N27');
    let downRc = Game.getObjectById('55db3314efa8e3fe66e05596');
    let downRcPos = new RoomPosition(5, 23, 'E4N27');
    
    let upSourcePos = new RoomPosition(4, 22, 'E4N29');
    let upSourceContainerPos = new RoomPosition(5, 23, 'E4N29');
    let upRallyPos = new RoomPosition(13, 17, 'E4N29');
    let upRc = Game.getObjectById('55db3313efa8e3fe66e0558f');
    let upRcPos = new RoomPosition(19, 21, 'E4N29');

    function handyman(i) {
        return { name: 'h'+i,
                 body: [ WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 memory: { role: 'handyman' } };
    }

    function emergencyHandyman(i) {
        return { name: 'Eh'+i,
                 body: [ WORK, CARRY, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: () => room.find(FIND_MY_CREEPS).length == 0,
                 memory: { role: 'handyman' } };
    }
    
    function leftDropHarvester() {
        return { name: 'NLH',
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 30,
                 memory: { role: 'harvestToContainerDrop', srcPos: leftSourcePos, containerPos: leftSourceContainerPos } };
    }
    
    function leftToStorageTransporter() {
        return { name: 'NLST',
                 body: [ CARRY, CARRY, MOVE ],
                 respawnEarlyTicks: -1,
                 memory: { role: 'transporter', srcPos: leftSourceContainerPos, destPos: storagePos } };
    }
    
    function rightDropHarvester() {
        return { name: 'NRH',
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 60,
                 memory: { role: 'harvestToContainerDrop', srcPos: rightSourcePos, containerPos: rightSourceContainerPos } };
    }
    
    function rightToStorageTransporter(i) {
        return { name: 'NRLT' + i,
                 body: [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 30,
                 memory: { role: 'transporter', srcPos: rightSourceContainerPos, destPos: storagePos } };
    }
    
    function distributor() {
        return { name: 'ND',
                 body: [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 750,
                 memory: { role: 'distributor', srcPos: storagePos, idleX: 29, idleY: 28 } };
    }
    
    function upgrader(i) {
        return { name: 'NU'+i,
                 body: [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE ],
                 respawnEarlyTicks: 30,
                 memory: { role: 'upgradeFromContainer', srcPos: rcContainerPos, destX: 39, destY: 26 } };
    }
    
    function transporterToRc() {
        return { name: 'NTRC',
                 body: [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 30,
                 memory: { role: 'transporter', srcPos: storagePos, destPos: rcContainerPos, srcReserve: 20000 } };
    }
    
    function builder(i) {
        return { name: 'NB'+i,
                 body: [ WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                 respawnEarlyTicks: -1,
                 condition: () => room.find(FIND_CONSTRUCTION_SITES).length > 0,
                 memory: { role: 'buildFromContainer', srcPos: storagePos, srcReserve: 1000 } };
    }
    
    function downHarvester() {
        return { name: 'NDH',
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 95,
                 memory: { role: 'harvestToContainerDrop', srcPos: downSourcePos, containerPos: downContainerPos } };
    }
    
    function transporterFromDown(i) {
        return { name: 'NDT'+i,
                 body: [ WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 120,
                 memory: { role: 'transporter', srcPos: downContainerPos, destPos: storagePos } };
    }
    
    function downReserver() {
        return { name: 'NDR',
                 body: [ CLAIM, CLAIM, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: () => controllerNeedsReserver(downRc),
                 memory: { role: 'reserver', rcPos: downRcPos } };
    }
    
    function downDefender() {
        return { name: 'NDD',
                 body: [ TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
                 respawnEarlyTicks: 70,
                 memory: { role: 'defender', rallyPos: downRallyPos } };
    }

    function upHarvester() {
        return { name: 'NUH',
                 body: [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 107,
                 memory: { role: 'harvestToContainerDrop', srcPos: upSourcePos, containerPos: upSourceContainerPos } };
    }
    
    function transporterFromUp(i) {
        return { name: 'NUT'+i,
                 body: [ WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                 respawnEarlyTicks: 90,
                 memory: { role: 'transporter', srcPos: upSourceContainerPos, destPos: storagePos } };
    }
    
    function upReserver() {
        return { name: 'NUR',
                 body: [ CLAIM, CLAIM, MOVE, MOVE ],
                 respawnEarlyTicks: -1,
                 condition: () => controllerNeedsReserver(upRc),
                 memory: { role: 'reserver', rcPos: upRcPos } };
    }
    
    function upDefender() {
        return { name: 'NUD',
                 body: [ TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
                 respawnEarlyTicks: 70,
                 memory: { role: 'defender', rallyPos: upRallyPos } };
    }

    function wallBuilder(i) {
        return { name: 'NWB'+i,
                 body: [ WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, 
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
                respawnEarlyTicks: -1,
                memory: { role: 'wallBuilder' } };
    }

    
    var plan = [ emergencyHandyman(1), 
                 distributor(), leftDropHarvester(), leftToStorageTransporter(), rightDropHarvester(), rightToStorageTransporter(1), rightToStorageTransporter(2),
                 //handyman(1),
                 transporterToRc(), upgrader(1), upgrader(2), upgrader(3),
                 downDefender(), downHarvester(), transporterFromDown(1), downReserver(), transporterFromDown(2),
                 builder(1), builder(2),
                 upDefender(), upHarvester(), transporterFromUp(1), upReserver(), transporterFromUp(2),
                 wallBuilder(1), wallBuilder(2)
                 ];
    
    return plan;
}

    

module.exports = {
    run: function(spawn) {
        //return;
        
        // try to make a creep from the plan
        var plan;
        
        if (spawn.room.name == 'E1N29') {
            plan = planE1N29();
        } else if (spawn.room.name == 'E4N28') {
            plan = planE4N28();
        } else {
            console.log('unknown spawn');
            return;
        }
        for (var p in plan) {
            var planCreep = plan[p];

            var nameA = planCreep.name;
            var nameB = planCreep.name + 'b';
            var aExists = nameA in Game.creeps;
            var bExists = nameB in Game.creeps;
            
            var shouldCreate;
            var newName;
            if (aExists && bExists) {
                shouldCreate = false;
            } else if (aExists) { // b doesn't exist
                var TTL = Game.creeps[nameA].ticksToLive;
                shouldCreate = TTL <= planCreep.respawnEarlyTicks;
                newName = nameB;
                //if (shouldCreate) console.log('should create ' + newName + ' b/c ' + nameA + ' is dying soon');
            } else if (bExists) { // a doesn't exist
                shouldCreate = Game.creeps[nameB].ticksToLive <= planCreep.respawnEarlyTicks;
                newName = nameA;
                //if (shouldCreate) console.log('should create ' + newName + ' b/c ' + nameB + ' is dying soon.');
            } else { // neither exists
                shouldCreate = true;
                newName = nameA;
                //console.log('should create ' + newName + ' b/c neither ' + nameA + ' or ' + nameB + ' exists.');
            }
            
            if (shouldCreate) {
                if (planCreep.condition != undefined) {
                    shouldCreate = planCreep.condition();
                    if (!shouldCreate) {
                        //console.log('not creating ' + planCreep.name + ' because condition failed.');
                    }
                }
            }

            if (shouldCreate) {
                console.log('next plan creep is ' + newName);
                if (spawn.canCreateCreep(planCreep.body) == OK) {
                    console.log('creating planCreep with name ' + newName);
                    //spawn.say('making ' + planCreep.name);
                    spawn.createCreep(planCreep.body, newName, planCreep.memory);
                } else {
                    console.log('waiting till we can spawn that creep');
                }
                return;
            }
        }
        //console.log('all plan creeps are alive!');
    }
};
