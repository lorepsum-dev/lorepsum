const FEATURE_KEY_ALIASES = {
    cards: 'entity-cards',
    tree: 'relationship-tree',
    narratives: 'narratives'
};

function normalizeKey(value) {
    return (
        String(value ?? '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'item'
    );
}

function toFeatureKey(label) {
    const normalized = normalizeKey(label);

    return FEATURE_KEY_ALIASES[normalized] ?? normalized;
}

function toMetadataKey(label) {
    return normalizeKey(label);
}

module.exports = {
    normalizeKey,
    toFeatureKey,
    toMetadataKey
};
