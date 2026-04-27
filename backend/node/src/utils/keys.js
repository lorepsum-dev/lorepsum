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

function toMetadataKey(label) {
    return normalizeKey(label);
}

module.exports = {
    normalizeKey,
    toMetadataKey
};
