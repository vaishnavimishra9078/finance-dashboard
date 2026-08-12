const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stocksRouter = require('./routes/stocks');   // ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.use('/api/stocks', stocksRouter);   // ADD THIS

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));