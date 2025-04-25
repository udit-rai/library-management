import app from './app.js';
import sql from 'mssql';
import config from './config/dbConfig.js';

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Website running on http://localhost:${PORT}`);
});

sql.connect(config, (err) => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to MSSQL');
});
