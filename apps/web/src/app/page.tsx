'use client';

import { useState } from 'react';
import { usePublicKey } from '@/hooks/usePublicKey';
import { sendEncrypted } from '@/lib/api';

interface ApiResponse {
  payload: unknown;
  protectedHeader: Record<string, unknown>;
}

export default function HomePage() {
  const { publicJwk, loading: keyLoading, error: keyError } = usePublicKey();

  const [message, setMessage] = useState('Hello from Next.js 👋');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleSend() {
    if (!publicJwk) return;
    setSending(true);
    setSendError(null);
    setResult(null);

    try {
      const payload = { message, userId: 42, ts: Date.now() };
      const data = await sendEncrypted<ApiResponse>(payload, publicJwk);
      setResult(data);
    } catch (e: unknown) {
      setSendError(String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        JOSE + ECDH Demo
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Encrypts a payload with the server&apos;s EC public key (ECDH-ES+A256KW / A256GCM)
        before sending — the plaintext never travels over the wire.
      </p>

      {/* Public key status */}
      <section style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
          Server public key
        </label>
        {keyLoading && <p style={{ color: '#999', margin: '0.5rem 0' }}>Fetching…</p>}
        {keyError && <p style={{ color: '#c00', margin: '0.5rem 0' }}>Error: {keyError}</p>}
        {publicJwk && (
          <pre style={preStyle}>
            {JSON.stringify(publicJwk, null, 2)}
          </pre>
        )}
      </section>

      {/* Send form */}
      <section style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="msg"
          style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', display: 'block', marginBottom: '0.5rem' }}
        >
          Payload message
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            id="msg"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleSend}
            disabled={!publicJwk || sending}
            style={btnStyle}
          >
            {sending ? 'Encrypting…' : '🔒 Send encrypted'}
          </button>
        </div>
      </section>

      {/* Result */}
      {sendError && (
        <p style={{ color: '#c00', marginBottom: '1rem' }}>Error: {sendError}</p>
      )}
      {result && (
        <section>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
            Decrypted by server
          </label>
          <pre style={preStyle}>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}

const preStyle: React.CSSProperties = {
  background: '#f6f6f6',
  borderRadius: 8,
  padding: '0.75rem 1rem',
  fontSize: '0.8rem',
  overflowX: 'auto',
  marginTop: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.5rem 0.75rem',
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: '0.95rem',
};

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: 8,
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
};
