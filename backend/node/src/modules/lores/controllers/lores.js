const lores = require('../repositories/lores');

const loresController = {
    async listAll(req, res) {
        try {
            const data = await lores.findAll();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: 'success',
                results: data.length,
                lores: data
            }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Erro de conexão'
            }));
        }
    }
};

module.exports = loresController;
