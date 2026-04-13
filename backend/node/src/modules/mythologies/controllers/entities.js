const entities = require('../repositories/entities');

const  EntityController = {
    async listAll(req, res){
        try {
            const data = await entities.findAll();
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                results: data.length,
                entities: data
            }))
        }              
        catch(error){
            console.error('[listAll]', error.message)
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
            status: 'error',
            msg: 'Tremor no Submundo! (erro de conexão)'
            }))
        }

    },
    
    async findBy(req, res){
        try{

            const {field, value} =  req.params

            const data = await entities.findBy(field, value)
            res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                entities: data
            }))
        }
        catch(error){
            console.error(error.message)
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
            status: 'error',
            msg: 'Personagem no Hades! (erro de conexão)'
            }))
        }
    },

    async byId(req, res){
        try{
            const value = req.params.id
        
            const data = await entities.findById(value);
            console.log(id, data)
            res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                entities: data
            }))
        }
        catch(error){
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
            status: 'error',
            msg: 'Personagem no Hades! (erro de conexão)'
            }))
        }
    }

}




module.exports = EntityController