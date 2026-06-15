import { Platform } from "react-native";

const API_PORT = "5275";

// Para Expo Go no celular, deixe aqui o IP do notebook/PC que está rodando a API.
// Exemplo: ipconfig -> Adaptador Wi-Fi -> Endereço IPv4.
const MOBILE_API_HOST = "192.168.86.12";
const REQUEST_TIMEOUT_MS = 10000;

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: RequestMethod;
  body?: unknown;
};

function getApiBaseUrl() {
  if (Platform.OS === "web") {
    const hostname =
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).location?.hostname === "string"
        ? (globalThis as any).location.hostname
        : "localhost";

    const apiHost =
      hostname === "localhost" || hostname === "127.0.0.1"
        ? "localhost"
        : hostname;

    return `http://${apiHost}:${API_PORT}`;
  }

  return `http://${MOBILE_API_HOST}:${API_PORT}`;
}

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

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
      (typeof data === "string" ? data : "Erro na comunicação com a API.");

    throw new Error(message);
  }

  return data as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;

  const timeoutId = controller
    ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller?.signal,
    });

    return handleResponse<T>(response);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error(
        `A API não respondeu em ${REQUEST_TIMEOUT_MS / 1000}s. Confira se ela está ligada em ${API_BASE_URL}.`,
      );
    }

    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
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
