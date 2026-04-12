const owners = require('../repositories/owners')

const ownersController = {
    async listAll(req, res){
        try {
            const data =  await owners.findAll();
            res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                results: data.length,
                owners: data
            }))
        } catch (error) {
            console.error(error)
            res.writeHead(400, {'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'error',
                message: 'Erro de conexão'
            }))
        }
    }
}

module.exports = ownersController