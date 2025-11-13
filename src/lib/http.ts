// Model: thin HTTP wrapper.
// Even in Milestone 1–3, we introduce this boundary so the rest of the app
// doesn't need to know about fetch/Response details.

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    // In a real app you'd attach more context here.
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }

  // We assume JSON responses for this project.
  return res.json() as Promise<T>;
}
