import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://dubber-ai-tool-git-main-partofcosmos1-res-projects.vercel.app/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Error uploading file.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h2>AI Dubbing Tool (Free)</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload & Dub'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
