const API_BASE_URL = "http://192.168.1.107:5275";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: RequestMethod;
  body?: unknown;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      data?.mensagem ||
      data?.message ||
      data?.erro ||
      data?.error ||
      "Erro na comunicação com a API.";

    throw new Error(message);
  }

  return data as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

export function apiGet<T>(endpoint: string) {
  return apiRequest<T>(endpoint, {
    method: "GET",
  });
}

export function apiPost<T>(endpoint: string, body?: unknown) {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body,
  });
}

export function apiPut<T>(endpoint: string, body?: unknown) {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body,
  });
}

export function apiPatch<T>(endpoint: string, body?: unknown) {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body,
  });
}

export function apiDelete<T>(endpoint: string) {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
  });
}