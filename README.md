![Banner](./qulang-banner-rounded.png)

# QuLang

QuLang is a decentralized application that leverages the power of Next.js to provide a modern, responsive interface for interacting with blockchain-based services. It offers features like real-time data updates, seamless integration with decentralized networks, and an intuitive editing experience to help you quickly build and customize smart contract interactions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker Setup

You can also run the application using Docker:

```bash
# Build and start the containers
docker-compose up -d

# To stop the containers
docker-compose down
```

This will set up the entire environment, including any necessary databases and services defined in the docker-compose.yaml file.

## Continuous Integration & Deployment

The project is configured with automated CI/CD using GitHub Actions. Every push to the main branch triggers an automatic deployment to the testnet provided during the hackathon. The workflow handles:

- Code linting and testing
- Building the application
- Deploying to the testnet environment

You can view deployment status in the GitHub Actions tab of the repository.

## Project Structure

```
src/
├── app/          # Next.js app router pages and layouts
├── components/   # Reusable UI components
├── lib/          # Utility functions and shared logic
├── hooks/        # Custom React hooks
├── api/          # API routes and services
└── styles/       # Global styles and theme configuration
```

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL (initialized with init_pg.py)
- **Blockchain Integration**: Custom connectors for interacting with smart contracts
- **Deployment**: Docker containerization with CI/CD automation

## Features

- Real-time blockchain data visualization
- Smart contract interaction interface
- User-friendly editor for contract development
- Secure wallet connection and transaction signing
- Responsive design for all device sizes
