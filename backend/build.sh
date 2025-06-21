#!/bin/bash
# Render build script for Node.js + Python AI backend

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install --upgrade pip
pip install openai-whisper TTS torch

# (Optional) Install ffmpeg if needed for audio processing
# apt-get update && apt-get install -y ffmpeg
