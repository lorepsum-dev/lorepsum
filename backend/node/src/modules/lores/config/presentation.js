const DEFAULT_PRESENTATION = {
    entity_modal: {
        badge_rules: [],
        tag_axis_keys: ['domain', 'role']
    }
};

const LORE_PRESENTATION = {
    mythologies: {
        entity_modal: {
            badge_rules: [
                {
                    axis_key: 'habitat',
                    value_key: 'olympus',
                    label: 'Olympian'
                },
                {
                    axis_key: 'lineage',
                    value_key: 'titan',
                    label: 'Titan'
                },
                {
                    axis_key: 'lineage',
                    value_key: 'primordial',
                    label: 'Primordial'
                }
            ],
            tag_axis_keys: ['domain', 'role']
        }
    }
};

function getLorePresentation(slug) {
    return LORE_PRESENTATION[slug] ?? DEFAULT_PRESENTATION;
}

module.exports = { getLorePresentation };
