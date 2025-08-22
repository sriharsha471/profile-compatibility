# Profile Compatability Checker - AI-Powered Resume Screening Tool

A modern full-stack monorepo application that uses AI to analyze CVs against job descriptions.

## Quick Start

1. Extract the zip file
2. Run the setup script: `./scripts/setup.sh`
3. Add your Gemini API token when prompted
4. Start the application: `pnpm dev`
5. Open http://localhost:5173

## Features

- PDF upload and parsing
- AI-powered analysis using Gemini 1.5 Flash
- Alignment scoring and recommendations
- Modern React UI with Tailwind CSS
- Type-safe API with tRPC
- Rate limiting (20 req/min, 300 req/hour)

## Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build for production
- `pnpm lint` - Run linting
- `pnpm format` - Format code
- `./scripts/stop.sh` - Stop all services

## Requirements

- Node.js 21+
- pnpm (installed automatically by setup script)

## License

MIT
