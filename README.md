# PayGrade — Salary Intelligence for Every Job Listing

## Chrome Extension | Salary Intelligence for Every Job Listing

PayGrade is a powerful Chrome extension that activates on every job listing across major job boards, showing real-time market compensation data the moment you see a job. It solves the pain points of hidden salaries, lowball offers, and fragmented data by bringing salary intelligence directly to the listing itself.

## Features

### 💰 Core Functionality
- **Automatic Detection**: Detects job listings on 15+ major job boards
- **Real-time Salary Data**: Shows market rate range, median, and percentiles
- **Posted Salary Assessment**: Compares listed salary with market data
- **Negotiation Intelligence**: Provides specific counter-offer recommendations
- **Company Data**: Shows salary ranges for similar positions at the company
- **Similar Roles**: Compares with similar roles in the same location
- **Anonymous Submissions**: Users can contribute salary data to earn Pro credits

### 🎯 Supported Job Boards
- **South Africa**: careers24.com, pnet.co.za, jobmail.co.za
- **Global**: LinkedIn, Indeed, Glassdoor, Seek (Australia), Reed.co.uk (UK), TotalJobs (UK), Monster, ZipRecruiter, Greenhouse, Lever, Workday

### 📊 Data Sources
1. **US H1B Salary Disclosure Data** (600K+ data points)
2. **Glassdoor Public Salary Pages**
3. **User-Submitted Data** (anonymous)
4. **Reddit Salary Threads** (community sentiment)
5. **Exchange Rates** (ECB + FXBridge API)

## Architecture

### Backend (Node.js + TypeScript)
- **API**: Express.js RESTful API
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for aggressive caching
- **AI**: Anthropic Claude for title normalization and salary analysis
- **Email**: Resend for magic link authentication
- **Payments**: ExtensionPay
- **Deployment**: Railway

### Frontend (React + TypeScript)
- **Content Scripts**: Job board detection and parser
- **Overlay UI**: React components injected via Shadow DOM
- **Popup**: User authentication and dashboard
- **Service Worker**: Background API calls and state management

## Installation

### Backend Setup
1. Install dependencies: `cd backend && npm install`
2. Set up PostgreSQL and Redis
3. Create a `.env` file from `.env.example`
4. Run migrations: `npm run prisma:migrate`
5. Start development server: `npm run dev`

### Extension Setup
1. Install dependencies: `cd extension && npm install`
2. Build: `npm run build`
3. Load unpacked extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/dist` folder

## Usage

1. **Install the Chrome extension**
2. **Visit any job board** supported by PayGrade
3. **View a job listing** - the PayGrade overlay will appear
4. **See salary intelligence** for that role and location
5. **Contribute your salary data** to help improve the database

## Development

### Project Structure

```
paygrade/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # API endpoints
│   │   ├── services/       # Business logic
│   │   │   └── sources/    # Data source integration
│   │   ├── middleware/     # Auth and tier management
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration
│   │   ├── prompts/        # AI prompt templates
│   │   └── jobs/           # Background jobs
│   └── prisma/             # Database schema
├── extension/              # Chrome extension
│   ├── src/
│   │   ├── content/        # Content scripts
│   │   │   ├── parsers/    # Job board specific parsers
│   │   │   └── overlay/    # React overlay components
│   │   ├── popup/          # Extension popup UI
│   │   ├── background/     # Service worker
│   │   ├── lib/            # Shared utilities
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
└── README.md
```

### Key Technologies

**Backend:**
- Node.js 20
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- Anthropic API
- Resend

**Frontend:**
- React 18
- TypeScript
- Chrome Extension Manifest V3
- Shadow DOM
- Webpack

## Business Model

### Pricing Tiers

**Free Tier:**
- 10 salary lookups per month
- Basic range and median
- Data sources summary
- Posted salary assessment

**Pro Tier ($12/month or $99/year):**
- Unlimited salary lookups
- Full range (p25, median, p75, p90)
- Negotiation intelligence
- Company-specific salary data
- Similar roles comparison
- Salary alerts
- PDF report export

**Earn Free Pro Credits:**
- Submit salary data anonymously = 2 credits
- 10 credits = 1 month of Pro

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

PayGrade is licensed under the [MIT License](LICENSE).

## Privacy Policy

Your privacy is important to us. Please see our [Privacy Policy](PRIVACY.md) for details on how we handle your data.

## Support

For support, please:
1. Check the [FAQ](FAQ.md)
2. Open an issue in this repository
3. Contact us at support@paygrade.so

## Roadmap

- [ ] Add support for more job boards
- [ ] Enhance salary prediction algorithms
- [ ] Add salary trend analysis
- [ ] Implement job alert notifications
- [ ] Add support for more countries and currencies