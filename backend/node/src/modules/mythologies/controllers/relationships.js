const RelationshipRepository = require('../repositories/relationships')

const RelationshipController = {
    async listAll(req, res) {
        try {
            const data = await RelationshipRepository.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({ status: 'success', relationships: data }))
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({ status: 'error', msg: 'Erro ao buscar relações' }))
        }
    }
}

module.exports = RelationshipController
