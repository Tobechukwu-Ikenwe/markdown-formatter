# Markdown Formatter

A powerful markdown formatting engine with a CLI tool and a modern React frontend.

## Project Structure

This project is organized as a monorepo-style repository:

- **Root**: Contains the core logic and CLI tool.
- **[frontend/](./frontend)**: A React + TypeScript application built with Vite for an interactive formatting experience.
- **[src/](./src)**: The core engine and CLI implementation.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Usage

#### CLI Tool

The CLI tool allows you to lint and format markdown files from the command line.

```bash
npm run lint -- path/to/your/file.md
```

#### Frontend Development

To run the interactive web interface locally:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Vercel

The project is configured for seamless deployment to Vercel via the root `vercel.json`.

- **Build Command**: `npm run build` (in the `frontend` directory)
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

To deploy using the Vercel CLI:

```bash
vercel
```

## License

ISC
