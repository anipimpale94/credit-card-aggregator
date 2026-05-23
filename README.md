# Credit Card Aggregator

A cross-platform desktop and web application to track credit card usage and manage budgets using Plaid API integration.

## Features

- **Multi-Card Support**: Connect and track multiple bank accounts
- **Transaction Dashboard**: View and filter transactions by date, amount, and category
- **Spending Analytics**: Visualize spending patterns by category
- **Budget Tracking**: Set budgets per category and track remaining allowance
- **Cross-Platform**: Works on Windows, macOS, and web browsers

## Tech Stack

- **Frontend**: React 18 + Electron (desktop) + web build
- **Backend**: Express.js + Node.js
- **Database**: SQLite (local storage)
- **APIs**: Plaid for bank account connectivity
- **Charting**: Chart.js for visualizations

## Prerequisites

- Node.js 16+ and npm
- Plaid account (free sandbox available at https://plaid.com)

## Setup

### 1. Clone and Install Dependencies

```bash
npm install
cd src && npm install
cd ../server && npm install
cd ..
```

### 2. Configure Plaid

1. Sign up for a Plaid account at https://plaid.com
2. Get your `PLAID_CLIENT_ID` and `PLAID_SECRET` from the dashboard
3. Create `.env` file in the server directory:

```bash
cp server/.env.example server/.env
```

4. Update `server/.env` with your Plaid credentials:

```
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PORT=5000
```

## Development

### Run Web Version
```bash
npm run dev
```

This starts:
- React app on http://localhost:3000
- Express server on http://localhost:5000

### Run Electron Desktop App
```bash
npm run electron-dev
```

### Build for Production
```bash
npm run build       # Build React
npm run dist        # Package Electron app
```

## Project Structure

```
credit-card-aggregator/
├── public/              # Electron main process
├── src/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── styles/      # CSS files
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── database.js      # SQLite setup
│   ├── index.js         # Main server file
│   └── package.json
└── package.json         # Root package.json
```

## API Endpoints

### Accounts
- `GET /api/accounts` - Get all connected accounts
- `GET /api/accounts/:id` - Get specific account

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions?account_id=:id` - Get transactions for specific account
- `GET /api/transactions/by-category` - Get spending by category

### Plaid
- `POST /api/plaid/create-link-token` - Create Plaid link token
- `POST /api/plaid/exchange-token` - Exchange public token for access token

## Database Schema

### Accounts Table
- id (UUID)
- plaid_account_id
- access_token
- name
- mask
- type
- subtype
- created_at

### Transactions Table
- id (UUID)
- account_id (FK)
- plaid_transaction_id
- name
- amount
- date
- category
- type
- pending
- created_at

### Budgets Table
- id (Integer)
- category
- limit
- created_at
- updated_at

## Future Enhancements

- [ ] Cloud sync across devices
- [ ] Advanced filtering and search
- [ ] Monthly/yearly reports
- [ ] Budget alerts and notifications
- [ ] Data export (CSV, PDF)
- [ ] Multiple user support
- [ ] Mobile app

## License

MIT
