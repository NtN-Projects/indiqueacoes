const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('stocks.db');

// Endpoint to get all stocks
app.get('/stocks', (req, res) => {
    db.all('SELECT * FROM stock_data', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to get stocks with long history
app.get('/stocksdiv', (req, res) => {
    db.all('SELECT * FROM long_history_stocks ORDER BY divdm DESC', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to get stock details by ticker from long_history_stocks
app.get('/stock/:ticker', (req, res) => {
    const ticker = req.params.ticker;
    db.get('SELECT * FROM long_history_stocks WHERE ticker = ?', [ticker], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(row);
        }
    });
});

// New endpoint to get historical prices by ticker
app.get('/prices/:ticker', (req, res) => {
    const ticker = req.params.ticker;
    db.all('SELECT * FROM historical_prices WHERE ticker = ? ORDER BY date ASC', [ticker], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:${PORT}');
});