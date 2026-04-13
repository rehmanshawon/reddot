const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, { body, headers, token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

export function fetchContent() {
  return request("/api/content");
}

export function loginAdmin(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function fetchCurrentAdmin(token) {
  return request("/api/auth/me", {
    method: "GET",
    token,
  });
}

export function updateContentSection(section, value, token) {
  return request(`/api/content/${section}`, {
    method: "PUT",
    token,
    body: { value },
  });
}

export function resetContent(token) {
  return request("/api/content/reset", {
    method: "POST",
    token,
  });
}
