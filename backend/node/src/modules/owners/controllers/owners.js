const owners = require('../repositories/owners');
const { sendJson } = require('../../../utils/responses');

const ownersController = {
    async listAll(req, res) {
        try {
            const data = await owners.findAll();

            return sendJson(res, 200, {
                status: 'success',
                results: data.length,
                owners: data
            });
        } catch (error) {
            console.error(error);

            return sendJson(res, 500, {
                status: 'error',
                message: 'Failed to load owners'
            });
        }
    }
};

module.exports = ownersController;
