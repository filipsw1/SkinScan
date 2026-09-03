import { useState, useEffect, useRef } from 'react';
import { Sun, Camera, Maximize, X, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function FramingExample() {
  return (
    <div className="example-frame">
      <svg className="example-frame-canvas" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="skinGrad" cx="50%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#F3E1D2" />
            <stop offset="100%" stopColor="#E6CBB4" />
          </radialGradient>
          <radialGradient id="moleGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#A85D45" />
            <stop offset="100%" stopColor="#653225" />
          </radialGradient>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#3A2418" floodOpacity="0.3" />
          </filter>
        </defs>

        <rect x="0" y="0" width="320" height="180" fill="url(#skinGrad)" />

        <path
          d="M132,58 C150,48 176,50 189,66 C202,82 204,106 191,122 C178,138 154,144 136,136 C118,128 108,108 113,88 C115,76 121,64 132,58 Z"
          fill="url(#moleGrad)"
          filter="url(#soft-shadow)"
        />

        <g stroke="var(--clinical)" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M20,42 L20,18 L44,18" />
          <path d="M300,18 L300,42" />
          <path d="M300,18 L276,18" />
          <path d="M20,138 L20,162 L44,162" />
          <path d="M300,162 L300,138" />
          <path d="M300,162 L276,162" />
        </g>
      </svg>

      <div className="example-frame-caption">
        <span className="example-frame-label">REFERENSBILD</span>
      </div>
    </div>
  );
}

function ToolPage() {
  const [guideConfirmed, setGuideConfirmed] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setLoadingDots(1);
      return;
    }
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Servern kunde inte behandla bilden.');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Något gick fel. Kontrollera att servern körs och försök igen.');
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  if (!guideConfirmed) {
    return (
      <div>
        <h1 style={{ fontSize: '1.7rem', marginBottom: '0.5rem' }}>Ta en bild som ger bäst resultat</h1>
        <p className="lead" style={{ marginBottom: '1.5rem' }}>Tre saker gör störst skillnad.</p>

        <div style={{ marginBottom: '1.75rem' }}>
          <div className="tip-row">
            <div className="tip-icon"><Sun size={19} strokeWidth={1.5} /></div>
            <p>Naturligt, jämnt ljus. Ingen blixt.</p>
          </div>
          <div className="tip-row">
            <div className="tip-icon"><Camera size={19} strokeWidth={1.5} /></div>
            <p>Rakt ovanifrån, inte i vinkel.</p>
          </div>
          <div className="tip-row">
            <div className="tip-icon"><Maximize size={19} strokeWidth={1.5} /></div>
            <p>Nära nog för att fylla bilden.</p>
          </div>
        </div>

        <FramingExample />

        <button className="btn" onClick={() => setGuideConfirmed(true)}>Jag är redo, ladda upp en bild</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: '1.7rem' }}>Analysera en hudförändring</h1>
        <button className="btn-ghost" onClick={() => setGuideConfirmed(false)}>Visa fotoguiden igen</button>
      </div>

      {!preview && (
        <label className="upload-zone">
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          Klicka för att välja en bild
        </label>
      )}

      {preview && (
        <div className="preview-wrap" onClick={handleRemoveImage}>
          <img src={preview} alt="Förhandsgranskning" className="preview-img" />
          <div className="preview-overlay">
            <X size={30} strokeWidth={2} />
          </div>
        </div>
      )}

      <div className="privacy-note">
        <Lock size={16} strokeWidth={1.5} />
        <span>
          Bilden sparas aldrig. Den analyseras i minnet och raderas omedelbart efter att
          resultatet visats, ingen bild eller personuppgift lagras, i linje med GDPR.
        </span>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={handleSubmit} disabled={!file || loading}>
          {loading ? `Analyserar${'.'.repeat(loadingDots)}` : 'Analysera bild'}
        </button>
      </div>

      {error && <p style={{ color: '#A84C34', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div className={`tier-card ${result.out_of_distribution ? 'ood' : result.tier}`}>
          {result.out_of_distribution ? (
            <p>{result.message}</p>
          ) : (
            <>
              <p><strong>Sannolikhet:</strong> {(result.probability * 100).toFixed(1)}%</p>
              <p><strong>Bedömning:</strong> {result.tier_label}</p>
            </>
          )}
          <p className="disclaimer">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export default ToolPage;