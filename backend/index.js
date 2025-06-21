import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { execFile } from 'child_process';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
app.use(cors());

// Simple in-memory rate limit (per IP)
const rateLimit = {};
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 1000; // 1 minute

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(ts => now - ts < WINDOW_MS);
  if (rateLimit[ip].length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests, please wait.' });
  }
  rateLimit[ip].push(now);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.send('AI Dubbing Backend Running');
});

// Upload endpoint
app.post('/api/dub', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  // Only allow short files (e.g., < 60s)
  // (Optional: check duration with ffprobe or similar)

  const { src_lang, tgt_lang, voice } = req.body;
  const inputPath = req.file.path;

  // Call Python script
  const py = 'python';
  const script = './python/dub.py';
  const input = JSON.stringify({ audio_path: inputPath, src_lang, tgt_lang, voice });

  const child = execFile(py, [script], { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    fs.unlink(inputPath, () => {}); // Clean up upload
    if (err) {
      return res.status(500).json({ error: 'Processing failed', details: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      const outPath = result.output_wav;
      res.download(outPath, 'dubbed.wav', () => {
        fs.unlink(outPath, () => {}); // Clean up output
      });
    } catch (e) {
      res.status(500).json({ error: 'Invalid output from AI pipeline.' });
    }
  });
  child.stdin.write(input);
  child.stdin.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
