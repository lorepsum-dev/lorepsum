const narratives = require('../repositories/narratives');

const NarrativeController = {
  async listAll(req, res) {
    try {
      const data = await narratives.findAll();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'success', narratives: data }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'error', msg: 'Erro ao buscar narrativas' }));
    }
  }
};

module.exports = NarrativeController;
