const loresRepository = require('../repositories/lores');

async function getLoreOrNull(slug) {
    return loresRepository.findBySlug(slug);
}

module.exports = { getLoreOrNull };
