# Profile Compatability Checker - AI-Powered Resume Screening Tool

A modern full-stack monorepo application that uses AI to analyze CVs against job descriptions.

## Quick Start

1. Give necessary permissions to scripts using chmod +x for setup.sh, start.sh and stop.sh
2. Run the setup script: `./scripts/setup.sh`
3. Add your Gemini API token when prompted
4. Start the application: `pnpm dev or using start.sh`
5. Open http://localhost:5173

## Features

- PDF upload and parsing
- AI-powered analysis using Gemini 1.5 Flash
- Alignment scoring and recommendations
- Modern React UI with Tailwind CSS
- Type-safe API with tRPC
- Rate limiting (20 req/min, 300 req/hour)

## Scripts

- `./scripts/setup.sh` - Necessary installations to setup pnpm and node
- `./scripts/start.sh or pnpm dev` - Start development servers
- `pnpm build` - Build for production
- `pnpm lint` - Run linting
- `pnpm format` - Format code
- `./scripts/stop.sh` - Stop all services

## Requirements

- Node.js 20+ (installed automatically by setup script)
- pnpm (installed automatically by setup script)

## License

MIT
