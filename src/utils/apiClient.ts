/**
 * Safe API client utility to protect against non-JSON and HTML error responses
 * (such as Vercel / Cloud Run 404 / 502 / 504 error pages like "The page cannot be found").
 */

export async function safeResponseJson<T = any>(
  res: Response,
  fallback: any = null
): Promise<T> {
  if (!res) return fallback as T;

  if (!res.ok) {
    console.warn(`[SafeAPI] HTTP ${res.status} error for ${res.url || 'request'}`);
    return fallback as T;
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    try {
      const text = await res.text();
      console.warn(
        `[SafeAPI] Expected application/json but received ${contentType || 'text/html'} for ${res.url}:`,
        text.slice(0, 120)
      );
    } catch {
      // ignore
    }
    return fallback as T;
  }

  try {
    const text = await res.text();
    if (!text || text.trim() === '') {
      return fallback as T;
    }
    // Safeguard check if text starts with HTML tag or "The page..."
    const trimmed = text.trim();
    if (trimmed.startsWith('<') || trimmed.startsWith('The page') || trimmed.startsWith('Error:')) {
      console.warn(`[SafeAPI] HTML/Text error page intercepted instead of JSON:`, trimmed.slice(0, 100));
      return fallback as T;
    }
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn(`[SafeAPI] JSON parse error for ${res.url}:`, err);
    return fallback as T;
  }
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  fallback: any = null
): Promise<{ ok: boolean; data: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const isHtml = text.trim().startsWith('<') || text.includes('The page') || text.includes('<!doctype');
      console.warn(
        `[SafeFetch] ${url} returned status ${res.status}:`,
        isHtml ? '(HTML error page received)' : text.slice(0, 120)
      );
      return {
        ok: false,
        data: fallback as T,
        error: isHtml
          ? `서버가 HTML 에러 페이지(${res.status})를 반환했습니다. 백엔드 API 상태를 확인하세요.`
          : text || `HTTP ${res.status}`,
      };
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text().catch(() => '');
      return {
        ok: false,
        data: fallback as T,
        error: `JSON 대신 ${contentType || 'HTML'} 응답을 수신했습니다.`,
      };
    }

    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<') || trimmed.startsWith('The page') || trimmed.startsWith('Error:')) {
      return {
        ok: false,
        data: fallback as T,
        error: `비정상적인 응답 본문: ${trimmed.slice(0, 80)}`,
      };
    }

    const data = JSON.parse(text) as T;
    return { ok: true, data };
  } catch (err: any) {
    console.warn(`[SafeFetch] Request failed for ${url}:`, err?.message || err);
    return {
      ok: false,
      data: fallback as T,
      error: err?.message || '네트워크 통신 중 오류가 발생했습니다.',
    };
  }
}
