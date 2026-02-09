const express = require('express');
const cors = require('cors');
const { searchCendoj, getFullSentence } = require('./cendoj-scraper');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'dev-key-12345';

app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'legal-scraper-cendoj' });
});

// Búsqueda en CENDOJ
app.post('/api/search/cendoj', authenticate, async (req, res) => {
  try {
    const { terminos, filtros } = req.body;
    
    if (!terminos) {
      return res.status(400).json({ error: 'Se requiere el parámetro "terminos"' });
    }

    const resultados = await searchCendoj(terminos, filtros);
    res.json(resultados);
  } catch (error) {
    console.error('Error en búsqueda CENDOJ:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener sentencia completa
app.post('/api/sentence/full', authenticate, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Se requiere el parámetro "url"' });
    }

    const sentencia = await getFullSentence(url);
    res.json(sentencia);
  } catch (error) {
    console.error('Error obteniendo sentencia:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🔑 API Key configurada: ${API_KEY.substring(0, 8)}...`);
});
