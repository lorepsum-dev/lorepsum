const loresRepository = require('../repositories/lores');
const { getLorePresentation } = require('../config/presentation');
const { getLoreOrNull } = require('./context');

const loresService = {
    async listAll() {
        return loresRepository.findAll();
    },

    async findBySlug(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        const [features, sidebarGroups] = await Promise.all([
            loresRepository.findFeaturesByLoreId(lore.id),
            loresRepository.findSidebarGroupsByLoreId(lore.id)
        ]);

        return {
            ...lore,
            features,
            sidebar_groups: sidebarGroups,
            presentation: getLorePresentation(slug)
        };
    },

    async listFeatures(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            features: await loresRepository.findFeaturesByLoreId(lore.id)
        };
    },

    async listSidebarGroups(slug) {
        const lore = await getLoreOrNull(slug);

        if (!lore) {
            return null;
        }

        return {
            lore,
            sidebar_groups: await loresRepository.findSidebarGroupsByLoreId(lore.id)
        };
    }
};

module.exports = loresService;
