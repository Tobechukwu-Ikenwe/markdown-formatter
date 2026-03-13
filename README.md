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

### Render

The project is configured for deployment to **Render** as a Static Site.

#### Automatic Deployment (Blueprint)
This repository includes a `render.yaml` file. When you connect your repository to Render, it should automatically detect this file and configure the service.

#### Manual Configuration
If you prefer manual setup on the Render dashboard:
1. Create a new **Static Site**.
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist` (Note: since root is `frontend`, this is relative to that directory)

## License

ISC
