const owners = require('../repositories/owners')

const ownersController = {
    async get(req, res){
        try{
            const data = await owners.get();
            res.writeHead(200,{'Content-type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({
                status: 'success',
                owners: data
            }))
        }catch(error){
        
            console.log(error.message)
        }
    }
}

module.exports = ownersController