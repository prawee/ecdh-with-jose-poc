'use client';

import { useEffect, useState } from 'react';
import type { JWK } from '@repo/jose-utils';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Fetches and caches the server's EC public key JWK.
 * The key is stable for the lifetime of the server process,
 * so one fetch per page load is fine.
 */
export function usePublicKey() {
  const [publicJwk, setPublicJwk] = useState<JWK | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/crypto/public-key`)
      .then((r) => r.json())
      .then((jwk: JWK) => setPublicJwk(jwk))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { publicJwk, loading, error };
}
