const baseQuery = `
		SELECT 
            e.id,
            e.name,
            e.description,
			ax.name as axis,
			cat.name as category,
            g.name as gender,
            o.name as origin,
			gr.name as group,
			gr.description as group_description
        FROM entities e
		LEFT JOIN entity_categories ec on e.id = ec.entity_id
		LEFT JOIN categories cat on ec.category_id = cat.id
		LEFT JOIN category_axes ax on ax.id = cat.axis_id
        LEFT JOIN genders g ON e.gender_id = g.id
        LEFT JOIN origins o on e.origin_id = o.id
		LEFT JOIN entity_groups eg on e.id = eg.entity_id
		LEFT JOIN groups gr on eg.group_id = gr.id
    `

module.exports = { baseQuery }