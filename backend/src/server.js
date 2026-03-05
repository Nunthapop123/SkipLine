const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/api/health', (req, res) => {
    res.json({ message: 'The SkipLine backend is alive and running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});