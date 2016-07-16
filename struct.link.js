/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('struct.link');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(link) {
        if (!link.room.storage) return; // no storage, nothing to do
        
        if (link.pos.isNearTo(link.room.storage)) return; // next to storage, nothing to do
        
        // try to find a link near the storage
        var linkNearStorage = link.room.find(FIND_MY_STRUCTURES,
            { filter: s => s.structureType == STRUCTURE_LINK && s.pos.isNearTo(link.room.storage) })[0];
        if (linkNearStorage) {
            link.transferEnergy(linkNearStorage);
        }
    }
};
