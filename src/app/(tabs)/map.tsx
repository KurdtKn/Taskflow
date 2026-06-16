import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";

import { apiGet } from "@/services/api";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";

type ChamadoApi = {
  id?: number | string;
  titulo?: string;
  title?: string;
  descricao?: string;
  description?: string;
  categoria?: string;
  empresa?: string;
  localServico?: string | null;
  local_servico?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataServico?: string | null;
  data_servico?: string | null;
  horaServico?: string | null;
  hora_servico?: string | null;
  valorEstimado?: number | string | null;
  valor_estimado?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  status?: string;
  vagasDisponiveis?: number;
  vagas_disponiveis?: number;
  quantidadeProfissionais?: number;
  quantidade_profissionais?: number;
};

type ChamadosResponse =
  | ChamadoApi[]
  | {
      data?: ChamadoApi[];
      dados?: ChamadoApi[];
      chamados?: ChamadoApi[];
    };

type MapJob = {
  id: string;
  title: string;
  description: string;
  category: string;
  company: string;
  location: string;
  city: string;
  state: string;
  date: string;
  time: string;
  price: string;
  rawPrice: string;
  latitude: number;
  longitude: number;
  status: string;
  vacancies: number;
};

const DEFAULT_CENTER = {
  latitude: -23.5015,
  longitude: -47.4526,
};

function getChamadosFromResponse(response: ChamadosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.chamados ?? [];
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(",", "."));

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function formatCurrency(value: unknown) {
  const parsed = toNumber(value);

  if (parsed === null || parsed <= 0) {
    return "Valor a combinar";
  }

  return parsed.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Data a combinar";
  }

  const parts = value.split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

function normalizeStatus(value?: string) {
  return (value ?? "aberto").toLowerCase().trim();
}

function normalizeJob(chamado: ChamadoApi): MapJob | null {
  const latitude = toNumber(chamado.latitude);
  const longitude = toNumber(chamado.longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  const id = String(chamado.id ?? "");

  if (!id) {
    return null;
  }

  const title = chamado.titulo ?? chamado.title ?? "Chamado disponível";

  const location =
    chamado.localServico ??
    chamado.local_servico ??
    chamado.cidade ??
    "Local não informado";

  const city = chamado.cidade ?? "";
  const state = chamado.estado ?? "";

  const rawPrice = String(
    chamado.valorEstimado ?? chamado.valor_estimado ?? "",
  );

  return {
    id,
    title,
    description: chamado.descricao ?? chamado.description ?? "",
    category: chamado.categoria ?? "Serviço",
    company: chamado.empresa ?? "Empresa",
    location,
    city,
    state,
    date: formatDate(chamado.dataServico ?? chamado.data_servico),
    time: chamado.horaServico ?? chamado.hora_servico ?? "Horário a combinar",
    price: formatCurrency(chamado.valorEstimado ?? chamado.valor_estimado),
    rawPrice,
    latitude,
    longitude,
    status: chamado.status ?? "aberto",
    vacancies: Number(
      chamado.vagasDisponiveis ??
        chamado.vagas_disponiveis ??
        chamado.quantidadeProfissionais ??
        chamado.quantidade_profissionais ??
        1,
    ),
  };
}

function sanitizeForHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildMapHtml(jobs: MapJob[]) {
  const center =
    jobs.length > 0
      ? {
          latitude:
            jobs.reduce((sum, job) => sum + job.latitude, 0) / jobs.length,
          longitude:
            jobs.reduce((sum, job) => sum + job.longitude, 0) / jobs.length,
        }
      : DEFAULT_CENTER;

  const safeJobs = jobs.map((job) => ({
    id: sanitizeForHtml(job.id),
    title: sanitizeForHtml(job.title),
    location: sanitizeForHtml(job.location),
    city: sanitizeForHtml(job.city),
    state: sanitizeForHtml(job.state),
    price: sanitizeForHtml(job.price),
    latitude: job.latitude,
    longitude: job.longitude,
    status: sanitizeForHtml(job.status),
    vacancies: job.vacancies,
  }));

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta 
    name="viewport" 
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" 
  />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

  <style>
    html, body, #map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #e5e7eb;
  font-family: Arial, Helvetica, sans-serif;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.leaflet-container {
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  cursor: grab;
  touch-action: none;
}

    .leaflet-container:active {
      cursor: grabbing;
    }

    .leaflet-control-attribution {
      font-size: 10px;
    }

    .leaflet-popup-content {
      width: 260px !important;
      max-width: 260px !important;
      margin: 14px 16px;
    }

    .popup {
      width: 100%;
      max-width: 260px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .popup,
    .popup * {
      overflow-wrap: anywhere;
      word-break: break-word;
      white-space: normal;
      box-sizing: border-box;
    }

    .popup-title {
      max-width: 100%;
      font-size: 14px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 6px;
      line-height: 18px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .popup-line {
      max-width: 100%;
      font-size: 12px;
      color: #4b5563;
      margin-bottom: 4px;
      line-height: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .popup-price {
      max-width: 100%;
      font-size: 13px;
      font-weight: 800;
      color: #0b57d0;
      margin-top: 7px;
      margin-bottom: 9px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .popup-button {
      width: 100%;
      border: none;
      border-radius: 10px;
      background: #0b57d0;
      color: white;
      font-size: 12px;
      font-weight: 800;
      padding: 9px 10px;
      cursor: pointer;
    }

    .popup-button:hover {
      opacity: 0.9;
    }

    .pin-marker {
      width: 46px;
      height: 58px;
      position: relative;
    }

    .pin-body {
      width: 42px;
      height: 42px;
      background: #0b57d0;
      border: 4px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.36);
      position: absolute;
      left: 0;
      top: 0;
    }

    .pin-dot {
      width: 15px;
      height: 15px;
      background: white;
      border-radius: 999px;
      position: absolute;
      left: 13.5px;
      top: 13.5px;
      transform: rotate(45deg);
    }

    .pin-label {
      position: absolute;
      left: 0;
      top: 0;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0b57d0;
      font-size: 13px;
      font-weight: 900;
      transform: rotate(45deg);
      z-index: 2;
    }
  </style>
</head>

<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    const jobs = ${JSON.stringify(safeJobs)};
    const center = ${JSON.stringify(center)};

    function sendToParent(type, id) {
      const payload = { type, id };

      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        return;
      }

      window.parent.postMessage(payload, "*");
    }

    function startMap() {
      const map = L.map("map", {
  center: [center.latitude, center.longitude],
  zoom: jobs.length > 1 ? 12 : 15,
  zoomControl: true,
  scrollWheelZoom: true,
  dragging: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true,
  touchZoom: true,
  tap: true,
inertia: true,
inertiaDeceleration: 3000,
inertiaMaxSpeed: 1500,
  tap: true,
  inertia: true,
  inertiaDeceleration: 3000,
  inertiaMaxSpeed: 1500,
});

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const iconHtml = \`
        <div class="pin-marker">
          <div class="pin-body">
            <div class="pin-dot"></div>
          </div>
        </div>
      \`;

      const pinIcon = L.divIcon({
        className: "",
        html: iconHtml,
        iconSize: [46, 58],
        iconAnchor: [23, 58],
        popupAnchor: [0, -54],
      });

      const bounds = [];

      jobs.forEach((job) => {
        const marker = L.marker([job.latitude, job.longitude], { icon: pinIcon }).addTo(map);

        const popup = document.createElement("div");
        popup.className = "popup";

        const title = document.createElement("div");
        title.className = "popup-title";
        title.textContent = job.title;

        const location = document.createElement("div");
        location.className = "popup-line";
        location.textContent =
          job.location +
          (job.city ? " - " + job.city : "") +
          (job.state ? "/" + job.state : "");

        const status = document.createElement("div");
        status.className = "popup-line";
        status.textContent = "Status: " + job.status + " • " + job.vacancies + " vaga(s)";

        const price = document.createElement("div");
        price.className = "popup-price";
        price.textContent = job.price;

        const button = document.createElement("button");
        button.className = "popup-button";
        button.textContent = "Ver detalhes";
        button.onclick = () => sendToParent("TASKFLOW_OPEN_DETAILS", job.id);

        popup.appendChild(title);
        popup.appendChild(location);
        popup.appendChild(status);
        popup.appendChild(price);
        popup.appendChild(button);

        marker.bindPopup(popup);

        marker.on("click", () => {
          sendToParent("TASKFLOW_SELECT_JOB", job.id);
        });

        bounds.push([job.latitude, job.longitude]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, {
          padding: [38, 38],
          maxZoom: 15,
        });
      }

      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 600);
      setTimeout(() => map.invalidateSize(), 1200);
    }

    if (window.L) {
      startMap();
    } else {
      document.body.innerHTML = '<div style="padding:16px;font-family:Arial;color:#111827;">Não foi possível carregar o mapa. Verifique sua internet.</div>';
    }
  </script>
</body>
</html>`;
}

function getWebViewComponent() {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    return require("react-native-webview").WebView;
  } catch (error) {
    console.log("react-native-webview não instalado:", error);
    return null;
  }
}

export default function MapScreen() {
  const { isDark, theme } = useTheme();

  const [isPageScrollEnabled, setIsPageScrollEnabled] = useState(true);
  const [jobs, setJobs] = useState<MapJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredJobs = jobs;

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) ??
    filteredJobs[0] ??
    null;

  const mapHtml = useMemo(() => buildMapHtml(filteredJobs), [filteredJobs]);

  const goToJobDetails = useCallback((job: MapJob) => {
    router.push({
      pathname: "/job-details",
      params: {
        id: job.id,
        jobId: job.id,
        chamadoId: job.id,

        title: job.title,
        description: job.description,
        category: job.category,
        price: job.price,
        rawPrice: job.rawPrice,

        location: job.location,
        city: job.city,
        state: job.state,
        time: `${job.date}, ${job.time}`,
        distance: job.city,

        status: job.status,
        company: job.company,
        companyName: job.company,

        vacancies: String(job.vacancies),
        vagasDisponiveis: String(job.vacancies),
        availableVacancies: String(job.vacancies),

        latitude: String(job.latitude),
        longitude: String(job.longitude),
      },
    });
  }, []);

  const handleMapMessage = useCallback(
    (rawData: unknown) => {
      let data = rawData as any;

      if (typeof rawData === "string") {
        try {
          data = JSON.parse(rawData);
        } catch {
          return;
        }
      }

      if (!data || typeof data !== "object") {
        return;
      }

      if (data.type === "TASKFLOW_SELECT_JOB" && data.id) {
        setSelectedJobId(String(data.id));
      }

      if (data.type === "TASKFLOW_OPEN_DETAILS" && data.id) {
        const job = filteredJobs.find((item) => item.id === String(data.id));

        if (job) {
          goToJobDetails(job);
        }
      }
    },
    [filteredJobs, goToJobDetails],
  );

  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await apiGet<ChamadosResponse>("/api/Chamados");
      const chamadosApi = getChamadosFromResponse(response);

      const normalizedJobs = chamadosApi
        .map(normalizeJob)
        .filter((job): job is MapJob => job !== null)
        .filter((job) => {
          const status = normalizeStatus(job.status);
          const estaDisponivel =
            status === "aberto" || status === "em_andamento";
          const temVaga = job.vacancies > 0;

          return estaDisponivel && temVaga;
        });

      setJobs(normalizedJobs);

      if (normalizedJobs.length > 0) {
        setSelectedJobId((currentId) => {
          const stillExists = normalizedJobs.some(
            (job) => job.id === currentId,
          );

          if (currentId && stillExists) {
            return currentId;
          }

          return normalizedJobs[0].id;
        });
      } else {
        setSelectedJobId(null);
      }
    } catch (error) {
      console.log("Erro ao carregar chamados no mapa:", error);
      setJobs([]);
      setSelectedJobId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [loadJobs]),
  );

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      handleMapMessage(event.data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMapMessage]);

  function renderMap() {
    if (Platform.OS === "web") {
      return (
        <View
          style={[
            styles.mapBox,
            {
              backgroundColor: "#E5E7EB",
              borderColor: theme.border,
            },
          ]}
          onTouchStart={() => setIsPageScrollEnabled(false)}
          onTouchEnd={() => setIsPageScrollEnabled(true)}
          onTouchCancel={() => setIsPageScrollEnabled(true)}
        >
          {React.createElement(
            "iframe" as any,
            {
              key: mapHtml.length + filteredJobs.map((job) => job.id).join("-"),
              title: "TaskFlow Map",
              srcDoc: mapHtml,
              style: {
                width: "100%",
                height: "510px",
                minHeight: "510px",
                border: "0",
                borderRadius: "20px",
                display: "block",
                backgroundColor: "#E5E7EB",
              },
              sandbox:
                "allow-scripts allow-same-origin allow-popups allow-forms",
            } as any,
          )}
        </View>
      );
    }

    const WebView = getWebViewComponent();

    if (!WebView) {
      return (
        <View
          style={[
            styles.nativeFallback,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.nativeFallbackTitle, { color: theme.text }]}>
            WebView não instalado
          </Text>

          <Text
            style={[styles.nativeFallbackText, { color: theme.textSecondary }]}
          >
            Rode: npx expo install react-native-webview
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.mapBox,
          {
            backgroundColor: "#E5E7EB",
            borderColor: theme.border,
          },
        ]}
      >
        <WebView
          key={mapHtml.length + filteredJobs.map((job) => job.id).join("-")}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          style={styles.mobileWebView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          mixedContentMode="always"
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          nestedScrollEnabled
          androidLayerType="hardware"
          onMessage={(event: any) => {
            handleMapMessage(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        scrollEnabled={isPageScrollEnabled}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerTextArea}>
            <Text style={[styles.title, { color: theme.text }]}>
              Mapa de chamados
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Arraste, dê zoom e clique nos pins para ver os chamados
              disponíveis.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.reloadButton,
              {
                backgroundColor: isDark
                  ? "rgba(59,130,246,0.16)"
                  : "rgba(11,87,208,0.1)",
                borderColor: isDark
                  ? "rgba(96,165,250,0.25)"
                  : "rgba(11,87,208,0.18)",
              },
              pressed && { opacity: 0.75 },
            ]}
            onPress={loadJobs}
          >
            <Text style={[styles.reloadText, { color: colors.primary }]}>
              Atualizar
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View
            style={[
              styles.loadingBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <ActivityIndicator color={colors.primary} />

            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Carregando chamados...
            </Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nenhum chamado disponível no mapa
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Só aparecem chamados abertos ou em andamento, com vaga disponível
              e latitude/longitude.
            </Text>
          </View>
        ) : (
          <>
            {renderMap()}

            {selectedJob && (
              <View
                style={[
                  styles.selectedCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTextArea}>
                    <Text
                      style={[styles.jobTitle, { color: theme.text }]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {selectedJob.title}
                    </Text>

                    <Text
                      style={[
                        styles.jobCompany,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {selectedJob.category} • {selectedJob.status} •{" "}
                      {selectedJob.vacancies} vaga(s)
                    </Text>
                  </View>

                  <Text
                    style={styles.jobPrice}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedJob.price}
                  </Text>
                </View>

                <Text style={[styles.jobInfo, { color: theme.textSecondary }]}>
                  📍 {selectedJob.location}
                  {selectedJob.city ? ` - ${selectedJob.city}` : ""}
                  {selectedJob.state ? `/${selectedJob.state}` : ""}
                </Text>

                <Text style={[styles.jobInfo, { color: theme.textSecondary }]}>
                  🕒 {selectedJob.date}, {selectedJob.time}
                </Text>

                <Text
                  style={[styles.coordinates, { color: theme.textSecondary }]}
                >
                  Coordenadas: {selectedJob.latitude.toFixed(6)},{" "}
                  {selectedJob.longitude.toFixed(6)}
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() => goToJobDetails(selectedJob)}
                >
                  <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 46,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  headerTextArea: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 4,
  },

  reloadButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  reloadText: {
    fontSize: 12,
    fontWeight: "900",
  },

  mapBox: {
    height: 510,
    minHeight: 510,
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
  },

  mobileWebView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },

  loadingBox: {
    minHeight: 240,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    fontWeight: "700",
  },

  emptyBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  nativeFallback: {
    minHeight: 260,
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  nativeFallbackTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  nativeFallbackText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  selectedCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },

  cardTextArea: {
    flex: 1,
    minWidth: 0,
  },

  jobTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 3,
  },

  jobCompany: {
    fontSize: 13,
    fontWeight: "700",
  },

  jobInfo: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4,
  },

  coordinates: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 6,
  },

  jobPrice: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    maxWidth: 180,
    flexShrink: 1,
    textAlign: "right",
  },

  detailsButton: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  detailsButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
