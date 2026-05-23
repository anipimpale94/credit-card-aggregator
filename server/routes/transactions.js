const express = require('express');
const { db } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  let sql = 'SELECT * FROM transactions ORDER BY date DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    res.json(rows || []);
  });
});

router.get('/by-category', (req, res) => {
  const sql = `
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE pending = 0
    GROUP BY category
    ORDER BY total DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching category totals:', err);
      return res.status(500).json({ error: 'Failed to fetch category data' });
    }

    const result = {};
    (rows || []).forEach(row => {
      result[row.category || 'Other'] = row.total;
    });

    res.json(result);
  });
});

module.exports = router;
