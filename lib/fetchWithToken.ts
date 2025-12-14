// lib/fetchWithToken.ts
const TOKEN_KEY = "token";

function isFormData(body: any): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function fetchWithToken<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  if (!token) {
    throw new Error("Not logged in or token missing");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  // 只有在 body 是普通对象/JSON 字符串时，才设置 application/json
  // 如果是 FormData / Blob / ArrayBuffer 等，让浏览器自己处理 Content-Type
  const body = (options as any).body;
  const shouldSetJson =
    body != null && !isFormData(body) && typeof body !== "string";

  if (shouldSetJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  // 401/403：token 无效 → 清掉，回到干净状态
  if (typeof window !== "undefined" && (res.status === 401 || res.status === 403)) {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  // 尝试解析 JSON（204 / 空 body 时不报错）
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

  if (!res.ok) {
    const msg = (data as any)?.error || (data as any)?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}
