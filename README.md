<div align="center">

<img alt="Voxtra" src="Voxtra.png" width="480" />

# Voxtra

**Self-hosted, secure & private offline audio transcription**

[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?style=flat&logo=go)](https://golang.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

Voxtra is a powerful, self-hosted audio transcription application that converts audio into text with high accuracy. Built with Go and React, it offers a complete offline solution for transcription, speaker diarization, note-taking, summarization, and AI-powered chat capabilities—all without sending your data to the cloud.

### Key Features

- 🎙️ **Accurate Transcription** - Multiple model support (WhisperX, Parakeet, Canary) with word-level timestamps
- 👥 **Speaker Diarization** - Identify and label speakers automatically
- 📝 **Interactive Transcripts** - Playback follow-along, seek-from-text, and note-taking
- 🤖 **AI Integration** - Chat with transcripts and generate summaries using OpenAI or local models (Ollama)
- 🎬 **YouTube Support** - Transcribe audio directly from YouTube videos
- 🎚️ **Multi-Track Audio** - Support for multi-track audio files with speaker separation
- ⚡ **Quick Transcription** - Ephemeral transcription mode for temporary use
- 🔐 **REST API** - Full API coverage with JWT and API key authentication
- 🎨 **Modern UI** - Clean, distraction-free interface built with React and Tailwind CSS
- 🐳 **Docker Ready** - Easy deployment with Docker and Docker Compose
- 🚀 **GPU Support** - Optional CUDA support for accelerated processing

---

## Quick Start

### Docker (Recommended)

```bash
# Pull and run
docker run -d \
  --name voxtra \
  -p 8080:8080 \
  -v voxtra_data:/app/data \
  --restart unless-stopped \
  voxtra:latest
```

Or using Docker Compose:

```yaml
services:
  voxtra:
    image: voxtra:latest
    ports:
      - "8080:8080"
    volumes:
      - voxtra_data:/app/data
    restart: unless-stopped

volumes:
  voxtra_data:
```

### From Source

**Prerequisites:**
- Go 1.24+
- Node.js 20+
- Python 3.11+ (for transcription models)
- FFmpeg

**Build Steps:**

```bash
# Clone the repository
git clone https://github.com/AbdennourGuerroudj/Voxtra.git
cd Voxtra

# Build frontend
cd web/frontend
npm install
npm run build

# Build backend
cd ../..
go mod download
go build -o voxtra cmd/server/main.go

# Run
./voxtra
```

Open http://localhost:8080 in your browser.

---

## Architecture

### Backend (Go)
- **Framework**: Gin web framework
- **Database**: SQLite (via GORM)
- **Authentication**: JWT tokens with refresh token support
- **Queue System**: Background task processing for transcription jobs
- **Model Registry**: Extensible plugin system for transcription models

### Frontend (React)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Audio Visualization**: WaveSurfer.js
- **Markdown Rendering**: React Markdown with syntax highlighting

### Transcription Models

Voxtra supports multiple transcription models through a plugin architecture:

- **WhisperX** - OpenAI Whisper with diarization (90+ languages)
- **Parakeet** - NVIDIA Parakeet (English, high quality)
- **Canary** - NVIDIA Canary (12 languages, multilingual)
- **PyAnnote** - Speaker diarization models
- **Sortformer** - NVIDIA Sortformer (4-speaker optimized)

---

## Configuration

### Environment Variables

Create a `.env` file (optional):

```env
# Server
HOST=0.0.0.0
PORT=8080

# Database
DATABASE_PATH=./data/voxtra.db

# Storage
UPLOAD_DIR=./data/uploads
WHISPERX_ENV=./data/whisperx-env

# Python
UV_PATH=/path/to/uv  # Optional, auto-detected if in PATH

# Logging
LOG_LEVEL=info  # debug, info, warn, error
```

### Speaker Diarization Setup

Voxtra uses pyannote models for speaker diarization:

1. Create an account on [Hugging Face](https://huggingface.co)
2. Accept terms for these repositories:
   - `pyannote/speaker-diarization-3.0`
   - `pyannote/speaker-diarization`
   - `pyannote/speaker-diarization-3.1`
   - `pyannote/segmentation-3.0`
3. Create an access token in Settings → Access Tokens
4. Paste the token in Voxtra's Diarization settings

---

## Features in Detail

### Transcription

- Upload audio files (MP3, WAV, FLAC, M4A, OGG, WMA)
- Record audio directly in the browser
- Transcribe YouTube videos by URL
- Batch upload multiple files
- Real-time progress tracking
- Word-level timestamps
- Export transcripts as JSON, SRT, TXT

### Speaker Diarization

- Automatic speaker identification
- Customizable speaker count (min/max)
- Speaker renaming and merging
- Visual speaker labels in transcripts

### Notes & Highlights

- Create notes linked to specific transcript segments
- Jump from note to audio position
- Markdown support in notes
- Export notes with transcripts

### AI Features

- **Chat Interface** - Ask questions about transcripts using OpenAI or Ollama
- **Summarization** - Generate summaries with custom templates
- **LLM Configuration** - Support for OpenAI and local Ollama models

### Profiles

- Save transcription configurations as reusable profiles
- Set default profiles for quick access
- Customize model, language, and quality settings per profile

### API Access

- RESTful API for all features
- JWT authentication for web UI
- API key authentication for programmatic access
- API key management interface

---

## API Documentation

Voxtra exposes a comprehensive REST API:

- **Authentication**: `/api/v1/auth/*`
- **Transcription**: `/api/v1/transcription/*`
- **Chat**: `/api/v1/chat/*`
- **Notes**: `/api/v1/notes/*`
- **Summaries**: `/api/v1/summaries/*`
- **Profiles**: `/api/v1/profiles/*`
- **API Keys**: `/api/v1/api-keys/*`

All endpoints support both JWT (Bearer token) and API key authentication.

---

## Development

### Project Structure

```
Voxtra/
├── cmd/server/          # Main application entry point
├── internal/
│   ├── api/            # HTTP handlers and routes
│   ├── auth/           # Authentication logic
│   ├── config/         # Configuration management
│   ├── database/       # Database layer
│   ├── models/         # Data models
│   ├── transcription/  # Transcription engine
│   └── web/            # Embedded frontend assets
├── pkg/                # Shared packages
│   ├── logger/         # Structured logging
│   └── middleware/     # HTTP middleware
└── web/frontend/       # React frontend source
```

### Running in Development

**Backend:**
```bash
go run cmd/server/main.go
```

**Frontend:**
```bash
cd web/frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API requests to the backend.

### Building

**Full Build (embeds frontend in Go binary):**
```bash
# Build frontend
cd web/frontend
npm run build

# Build Go binary
cd ../..
go build -o voxtra cmd/server/main.go
```

---

## Docker Build

### Standard Build

```bash
docker build -t voxtra:latest .
```

### CUDA Build (GPU Support)

```bash
docker build -f Dockerfile.cuda -t voxtra:cuda-latest .
```

### Docker Compose Build

```bash
# Standard
docker-compose -f docker-compose.build.yml up --build

# CUDA
docker-compose -f docker-compose.build.cuda.yml up --build
```

---

## Requirements

### Minimum
- **CPU**: Modern x86_64 or ARM64 processor
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Linux, macOS, or Windows

### Recommended
- **CPU**: Multi-core processor (4+ cores)
- **RAM**: 16GB+
- **GPU**: NVIDIA GPU with CUDA support (optional, for acceleration)
- **Storage**: SSD with 10GB+ free space

---

## License

MIT License - see LICENSE file for details

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

<div align="center">

**Built using Go and React**

</div>
