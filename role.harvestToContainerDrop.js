var util = require('util');

module.exports = {
    run: function(creep) {
        var srcPos = new RoomPosition(creep.memory.srcPos.x, creep.memory.srcPos.y, creep.memory.srcPos.roomName);
        var containerPos = new RoomPosition(creep.memory.containerPos.x, creep.memory.containerPos.y, creep.memory.containerPos.roomName);
        
        if (creep.pos.isEqualTo(containerPos)) {
            var siteOrContainerPresent = false;
            
            // check to see if there is a construction site here
            var constructionSites = containerPos.lookFor(LOOK_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                siteOrContainerPresent = true;
                var site = constructionSites[0];
                if (creep.carry.energy >= BUILD_POWER * creep.getActiveBodyparts(WORK)) {
                    creep.build(site);
                    return;
                }
            }
            
            var src = util.sourceAtPos(srcPos);
            //console.log('harvester ' + creep.name + ' src = ' + src);
            creep.harvest(src);
            
            // check to see if the container is here
            var container = util.storerAtPos(containerPos);
            if (container) {
                siteOrContainerPresent = true;
                // the container is here
                if (util.tryRepair(creep, container)) {
                    return;
                } else {
                    creep.drop(RESOURCE_ENERGY);
                }
            }
            
            if (!siteOrContainerPresent) {
                creep.room.createConstructionSite(containerPos, STRUCTURE_CONTAINER);
            }
        } else {
            util.myMoveTo(creep, containerPos);
        }
	}
};
