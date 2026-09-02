import { useState } from 'react';

const API_URL = 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Servern kunde inte behandla bilden.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Något gick fel. Kontrollera att servern körs och försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SkinScan</h1>
      <p style={{ color: '#555' }}>
        Ladda upp en bild på en hudförändring för en preliminär bedömning.
      </p>

      <div style={{ background: '#f0f4f8', padding: '1rem', borderRadius: 8, marginBottom: '1.5rem' }}>
        <strong>Så tar du bäst bild:</strong>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>Naturligt, diffust ljus, undvik direkt blixt</li>
          <li>Låt lesionen fylla större delen av bilden</li>
          <li>Håll kameran stilla och i fokus</li>
          <li>Neutral bakgrund, gärna ett mynt i bild som storleksreferens</li>
        </ul>
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img src={preview} alt="Förhandsgranskning" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSubmit} disabled={!file || loading}>
          {loading ? 'Analyserar...' : 'Analysera bild'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#c0392b', marginTop: '1rem' }}>{error}</p>
      )}

      {result && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 8, background: result.out_of_distribution ? '#fff3cd' : (result.flagged ? '#fdecea' : '#eafaf1') }}>
          {result.out_of_distribution ? (
            <p>{result.message}</p>
          ) : (
            <>
              <p><strong>Sannolikhet:</strong> {(result.probability * 100).toFixed(1)}%</p>
              <p><strong>Bedömning:</strong> {result.flagged ? 'Rekommenderar läkarbedömning' : 'Låg risk'}</p>
            </>
          )}
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.75rem' }}>{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export default App;