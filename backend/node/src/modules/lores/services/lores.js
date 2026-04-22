const loresRepository = require('../repositories/lores');

async function getLoreOrNull(slug) {
    return loresRepository.findBySlug(slug);
}

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
            sidebar_groups: sidebarGroups
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
