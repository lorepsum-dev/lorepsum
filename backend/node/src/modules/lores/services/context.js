const loresRepository = require('../repositories/lores');

async function getLoreOrNull(loreId) {
    return loresRepository.findById(loreId);
}

module.exports = { getLoreOrNull };
