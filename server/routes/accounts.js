const express = require('express');
const { db } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const sql = 'SELECT id, name, mask, type, subtype FROM accounts';
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching accounts:', err);
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }
    res.json(rows || []);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, name, mask, type, subtype FROM accounts WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching account:', err);
      return res.status(500).json({ error: 'Failed to fetch account' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(row);
  });
});

module.exports = router;
