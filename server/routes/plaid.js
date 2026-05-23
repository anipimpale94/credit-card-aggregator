const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { db } = require('../database');

const router = express.Router();

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

router.post('/create-link-token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user_id' },
      client_name: 'Credit Card Aggregator',
      language: 'en',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
    });

    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error('Plaid error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.post('/exchange-token', async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account details
    const authResponse = await plaidClient.authGet({
      access_token: accessToken,
    });

    const accountsData = authResponse.data.accounts;

    // Store accounts in database
    accountsData.forEach(account => {
      const id = uuidv4();
      const sql = `
        INSERT INTO accounts (id, plaid_account_id, access_token, name, mask, type, subtype)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(sql, [
        id,
        account.account_id,
        accessToken,
        account.name,
        account.mask,
        account.type,
        account.subtype,
      ]);
    });

    // Fetch transactions for the new account
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    });

    const transactions = transactionsResponse.data.transactions;

    transactions.forEach(transaction => {
      const id = uuidv4();
      const accountId = accountsData.find(a => a.account_id === transaction.account_id)?.account_id;
      const sql = `
        INSERT INTO transactions (id, account_id, plaid_transaction_id, name, amount, date, category, type, pending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(plaid_transaction_id) DO NOTHING
      `;
      db.run(sql, [
        id,
        accountId,
        transaction.transaction_id,
        transaction.name,
        transaction.amount,
        transaction.date,
        transaction.personal_finance_category?.primary || 'Other',
        transaction.transaction_type,
        transaction.pending ? 1 : 0,
      ]);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error exchanging token:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
