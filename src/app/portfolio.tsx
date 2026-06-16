import type { ComponentType } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import StarIcon from "../../assets/icons/star_border.svg";
import PlusIcon from "../../assets/icons/Plus-icon.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import BadgeIcon from "../../assets/icons/badge.svg";

import { styles } from "@/app/styles/portfolio";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { getFreelancerData, getLoggedUser } from "@/services/storage";

const PORTFOLIO_STORAGE_KEY = "@taskflow:portfolio-items";
const PORTFOLIO_COMPAT_STORAGE_KEYS = [
  PORTFOLIO_STORAGE_KEY,
  "@taskflow:portfolio",
  "portfolioItems",
];

const USER_STORAGE_KEYS = [
  "@taskflow:user",
  "@taskflow:logged-user",
  "taskflow:user",
  "loggedUser",
  "user",
];

const PROFILE_STORAGE_KEYS = [
  "@taskflow:freelancer-profile",
  "@taskflow:profile",
  "@taskflow:profile-data",
  "taskflow:profile",
  "freelancerProfile",
  "profileData",
  "profile",
  "userProfile",
];

const SKILL_FILTERS = [
  "Todos",
  "Eventos",
  "Fotografia",
  "Manutenção",
  "Limpeza",
  "Tecnologia",
  "Serviços gerais",
];

type PortfolioProfile = {
  id: string;
  name: string;
  userRole: string;
  photoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  professionalSummary?: string;
  skills: string[];
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  clientName?: string;
  link?: string;
  freelancerId?: string;
  freelancerUserId?: string;
  freelancerName?: string;
};

type StoredPortfolioItem = {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  date?: string;
  clientName?: string;
  link?: string;
  freelancerId?: string;
  freelancerUserId?: string;
  usuarioId?: string;
  userId?: string;
  freelancerName?: string;
  createdAt?: string;
};

function normalizeText(value: unknown, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
}

function normalizeName(value: unknown) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLoggedUserId(loggedUserData: any) {
  const value =
    loggedUserData?.id ??
    loggedUserData?.usuarioId ??
    loggedUserData?.usuario_id ??
    loggedUserData?.userId ??
    loggedUserData?.user_id ??
    loggedUserData?.id_usuario;

  return value ? String(value) : "";
}

function resolveLoggedUserName(...sources: any[]) {
  for (const source of sources) {
    const name = normalizeText(
      source?.nome ??
        source?.name ??
        source?.nomeCompleto ??
        source?.fullName ??
        source?.usuarioNome ??
        source?.userName ??
        source?.freelancerName ??
        source?.usuario?.nome ??
        source?.usuario?.name
    );

    if (name) {
      return name;
    }
  }

  return "Freelancer";
}

function resolveUserPhoto(...sources: any[]) {
  for (const source of sources) {
    const value = normalizeText(
      source?.fotoUrl ??
        source?.foto_url ??
        source?.foto ??
        source?.urlFoto ??
        source?.imagemPerfil ??
        source?.profileImage ??
        source?.profileImageUri ??
        source?.profilePicture ??
        source?.imageUri ??
        source?.imageUrl ??
        source?.image ??
        source?.photoUrl ??
        source?.photoURL ??
        source?.photo ??
        source?.picture ??
        source?.avatarUrl ??
        source?.avatarUri ??
        source?.avatar ??
        source?.usuario?.fotoUrl ??
        source?.usuario?.foto_url ??
        source?.usuario?.photoUrl ??
        source?.freelancer?.fotoUrl ??
        source?.freelancer?.foto_url ??
        source?.freelancer?.photoUrl
    );

    if (!value || value === "null" || value === "undefined") {
      continue;
    }

    return value;
  }

  return "";
}

function resolveProfessionalSummary(...sources: any[]) {
  for (const source of sources) {
    const summary = normalizeText(
      source?.professionalSummary ??
        source?.about ??
        source?.sobre ??
        source?.bio ??
        source?.descricao ??
        source?.description ??
        source?.resumoProfissional
    );

    if (summary) {
      return summary;
    }
  }

  return "Adicione trabalhos ao portfólio para deixar seu perfil mais completo.";
}

function resolveSkills(...sources: any[]) {
  for (const source of sources) {
    const possibleSkills =
      source?.skills ??
      source?.tags ??
      source?.habilidades ??
      source?.categories ??
      source?.categorias;

    if (Array.isArray(possibleSkills) && possibleSkills.length > 0) {
      const cleanedSkills = possibleSkills
        .map((skill) => normalizeText(skill))
        .filter(Boolean);

      if (cleanedSkills.length > 0) {
        return ["Todos", ...new Set([...cleanedSkills, ...SKILL_FILTERS.filter((skill) => skill !== "Todos")])];
      }
    }
  }

  return SKILL_FILTERS;
}

async function getLoggedUserSafely() {
  try {
    const loggedUser = await getLoggedUser();

    if (loggedUser) {
      return loggedUser;
    }
  } catch (error) {
    console.log("Não foi possível carregar usuário pelo storage service:", error);
  }

  return getLoggedUserFromStorage();
}

async function getFreelancerDataSafely(userId?: string) {
  if (!userId) {
    return null;
  }

  try {
    return await getFreelancerData(userId);
  } catch (error) {
    console.log("Não foi possível carregar dados do freelancer pelo storage service:", error);
    return null;
  }
}

async function getLoggedUserFromStorage() {
  for (const key of USER_STORAGE_KEYS) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (!value) {
        continue;
      }

      return JSON.parse(value);
    } catch (error) {
      console.log(`Não foi possível ler usuário em ${key}:`, error);
    }
  }

  return null;
}

async function getProfileFromStorage() {
  for (const key of PROFILE_STORAGE_KEYS) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (!value) {
        continue;
      }

      return JSON.parse(value);
    } catch (error) {
      console.log(`Não foi possível ler perfil em ${key}:`, error);
    }
  }

  return null;
}

async function getStoredPortfolioItems() {
  for (const key of PORTFOLIO_COMPAT_STORAGE_KEYS) {
    try {
      const storedItems = await AsyncStorage.getItem(key);

      if (!storedItems) {
        continue;
      }

      const parsedItems = JSON.parse(storedItems);

      if (Array.isArray(parsedItems)) {
        return parsedItems as StoredPortfolioItem[];
      }
    } catch (error) {
      console.log(`Não foi possível ler portfólio em ${key}:`, error);
    }
  }

  return [];
}

async function saveStoredPortfolioItems(items: StoredPortfolioItem[]) {
  await AsyncStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
}

function portfolioItemBelongsToUser(
  item: StoredPortfolioItem | PortfolioItem,
  loggedUserId: string,
  loggedUserNameNormalized: string
) {
  if (!loggedUserId && !loggedUserNameNormalized) {
    return false;
  }

  const possibleIds = [
    item.freelancerId,
    item.freelancerUserId,
    "usuarioId" in item ? item.usuarioId : undefined,
    "userId" in item ? item.userId : undefined,
  ].filter(Boolean);

  const matchesById = loggedUserId
    ? possibleIds.some((id) => String(id) === loggedUserId)
    : false;

  const matchesByName = item.freelancerName
    ? normalizeName(item.freelancerName) === loggedUserNameNormalized
    : false;

  return matchesById || matchesByName;
}

function normalizePortfolioItem(item: StoredPortfolioItem, index: number): PortfolioItem {
  return {
    id: normalizeText(item.id, `portfolio-${index}`),
    title: normalizeText(item.title, "Item do portfólio"),
    category: normalizeText(item.category, "Serviços gerais"),
    description: normalizeText(item.description, "Descrição não informada."),
    date: normalizeText(item.date, "Data não informada"),
    clientName: normalizeText(item.clientName),
    link: normalizeText(item.link),
    freelancerId: normalizeText(item.freelancerId ?? item.usuarioId ?? item.userId),
    freelancerUserId: normalizeText(item.freelancerUserId ?? item.usuarioId ?? item.userId),
    freelancerName: normalizeText(item.freelancerName),
  };
}

export default function PortfolioScreen() {
  const { isDark, theme } = useTheme();

  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("Todos");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhotoFailed, setProfilePhotoFailed] = useState(false);
  const [portfolioOwner, setPortfolioOwner] = useState({
    userId: "",
    userNameNormalized: "",
  });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLink, setEditLink] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const loadPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUserSafely();
      const profileData = await getProfileFromStorage();
      const loggedUserId =
        resolveLoggedUserId(loggedUser as any) || resolveLoggedUserId(profileData as any);
      const savedFreelancerData = await getFreelancerDataSafely(loggedUserId);
      const loggedUserName = resolveLoggedUserName(
        savedFreelancerData,
        loggedUser,
        profileData
      );
      const loggedUserPhoto = resolveUserPhoto(
        savedFreelancerData,
        loggedUser,
        profileData
      );
      const loggedUserNameNormalized = normalizeName(loggedUserName);

      setPortfolioOwner({
        userId: loggedUserId,
        userNameNormalized: loggedUserNameNormalized,
      });
      setProfilePhotoFailed(false);

      const storedItems = await getStoredPortfolioItems();
      const normalizedItems = storedItems.map((item, index) =>
        normalizePortfolioItem(item, index)
      );

      const filteredItems = normalizedItems.filter((item) =>
        portfolioItemBelongsToUser(item, loggedUserId, loggedUserNameNormalized)
      );

      const itemsToDisplay = filteredItems;

      setProfile({
        id: loggedUserId || "local-user",
        name: loggedUserName,
        userRole: "Freelancer",
        photoUrl: loggedUserPhoto,
        rating: undefined,
        reviewsCount: 0,
        professionalSummary: resolveProfessionalSummary(
          savedFreelancerData,
          loggedUser,
          profileData
        ),
        skills: resolveSkills(savedFreelancerData, loggedUser, profileData),
      });

      setPortfolioItems(itemsToDisplay.slice().reverse());
    } catch (error) {
      console.log("Erro ao carregar portfólio:", error);

      setProfile({
        id: "local-user",
        name: "Freelancer",
        userRole: "Freelancer",
        skills: [],
      });
      setPortfolioItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPortfolio();
    }, [loadPortfolio])
  );

  const filteredPortfolioItems = useMemo(() => {
    if (selectedSkill === "Todos") {
      return portfolioItems;
    }

    const selectedCategory = normalizeName(selectedSkill);

    return portfolioItems.filter((item) =>
      normalizeName(item.category).includes(selectedCategory)
    );
  }, [portfolioItems, selectedSkill]);

  function getPortfolioIcon(category: string): ComponentType<any> {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes("evento")) {
      return AssignmentIcon;
    }

    if (
      normalizedCategory.includes("serviço") ||
      normalizedCategory.includes("manutenção")
    ) {
      return SettingsIcon;
    }

    if (
      normalizedCategory.includes("foto") ||
      normalizedCategory.includes("portfólio")
    ) {
      return BadgeIcon;
    }

    return AssignmentIcon;
  }

  function formatRating() {
    if (!profile?.rating) {
      return "Sem avaliações";
    }

    const rating = profile.rating.toFixed(1).replace(".", ",");
    const reviewsCount = profile.reviewsCount ?? 0;

    return `${rating} • ${reviewsCount} avaliações`;
  }

  function openEditModal(item: PortfolioItem) {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditClientName(item.clientName ?? "");
    setEditDate(item.date);
    setEditDescription(item.description);
    setEditLink(item.link ?? "");
  }

  function closeEditModal() {
    if (isSavingEdit) {
      return;
    }

    setEditingItem(null);
  }

  async function saveEditedPortfolioItem() {
    if (!editingItem) {
      return;
    }

    const title = editTitle.trim();
    const category = editCategory.trim();
    const description = editDescription.trim();

    if (!title || !category || !description) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha título, categoria e descrição para salvar a edição."
      );
      return;
    }

    try {
      setIsSavingEdit(true);

      const storedItems = await getStoredPortfolioItems();
      const hasItem = storedItems.some(
        (item) =>
          normalizeText(item.id) === editingItem.id &&
          portfolioItemBelongsToUser(
            item,
            portfolioOwner.userId,
            portfolioOwner.userNameNormalized
          )
      );

      const updatedItems = storedItems.map((item) => {
        const isSameItem = normalizeText(item.id) === editingItem.id;
        const belongsToLoggedUser = portfolioItemBelongsToUser(
          item,
          portfolioOwner.userId,
          portfolioOwner.userNameNormalized
        );

        if (!isSameItem || !belongsToLoggedUser) {
          return item;
        }

        return {
          ...item,
          title,
          category,
          clientName: editClientName.trim(),
          date: editDate.trim() || "Data não informada",
          description,
          link: editLink.trim(),
          freelancerId: normalizeText(item.freelancerId, editingItem.freelancerId),
          freelancerUserId: normalizeText(
            item.freelancerUserId,
            editingItem.freelancerUserId
          ),
          freelancerName: normalizeText(item.freelancerName, editingItem.freelancerName),
        };
      });

      if (!hasItem) {
        Alert.alert(
          "Não foi possível editar",
          "Esse item não pertence ao usuário logado ou não foi encontrado no portfólio salvo."
        );
        return;
      }

      await saveStoredPortfolioItems(updatedItems);
      setEditingItem(null);
      await loadPortfolio();

      Alert.alert("Portfólio atualizado", "O trabalho realizado foi editado com sucesso.");
    } catch (error) {
      console.log("Erro ao editar item do portfólio:", error);
      Alert.alert(
        "Erro ao salvar",
        "Não foi possível editar esse trabalho agora. Tente novamente."
      );
    } finally {
      setIsSavingEdit(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { backgroundColor: theme.background }]}> 
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack
            width={28}
            height={28}
            color={theme.text}
            fill={theme.text}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Portfólio</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View
            style={[
              styles.profileSummaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>Carregando portfólio...</Text>

              <Text style={[styles.userRole, { color: theme.textSecondary }]}>Buscando dados salvos.</Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.profileSummaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {profile?.photoUrl && !profilePhotoFailed ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={styles.avatar}
                resizeMode="cover"
                onError={() => setProfilePhotoFailed(true)}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.inputBackground,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>{profile?.name ?? "Freelancer"}</Text>

              <Text style={[styles.userRole, { color: theme.textSecondary }]}>{profile?.userRole ?? "Freelancer"}</Text>

              <View style={styles.ratingArea}>
                <StarIcon width={18} height={18} />

                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{formatRating()}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Resumo profissional</Text>

          <Text style={[styles.summaryText, { color: theme.textSecondary }]}> 
            {profile?.professionalSummary ??
              "Adicione trabalhos ao portfólio para deixar seu perfil mais completo."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Habilidades</Text>

          {profile?.skills && profile.skills.length > 0 ? (
            <View style={styles.skillsArea}>
              {profile.skills.map((skill) => {
                const isSelected = selectedSkill === skill;

                return (
                  <Pressable
                    key={skill}
                    style={({ pressed }) => [
                      styles.skillChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                    onPress={() => setSelectedSkill(skill)}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        { color: isSelected ? colors.white : theme.text },
                      ]}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.infoTitle, { color: theme.text }]}>Nenhuma habilidade cadastrada</Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>Quando o usuário cadastrar habilidades, elas aparecerão aqui.</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trabalhos realizados</Text>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push("/add-portfolio-item")}
          >
            <PlusIcon width={16} height={16} color={colors.plus} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </Pressable>
        </View>

        <View style={styles.portfolioList}>
          {filteredPortfolioItems.length === 0 ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.infoTitle, { color: theme.text }]}>Nenhum trabalho cadastrado</Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedSkill === "Todos"
                  ? "Depois de salvar um item, ele vai aparecer aqui automaticamente."
                  : `Nenhum item cadastrado em ${selectedSkill}.`}</Text>
            </View>
          ) : (
            filteredPortfolioItems.map((item) => {
              const Icon = getPortfolioIcon(item.category);

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.portfolioCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    pressed && styles.portfolioCardPressed,
                  ]}
                  onPress={() => openEditModal(item)}
                >
                  <View style={styles.itemIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>

                      <View style={{ alignItems: "flex-end", gap: 6 }}>
                        <Text style={[styles.itemDate, { color: theme.textSecondary }]}>{item.date}</Text>

                        <Pressable
                          style={({ pressed }) => [
                            {
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 999,
                              backgroundColor: theme.primary,
                              opacity: pressed ? 0.85 : 1,
                            },
                          ]}
                          onPress={() => openEditModal(item)}
                        >
                          <Text
                            style={{
                              color: colors.white,
                              fontSize: 12,
                              fontWeight: "900",
                            }}
                          >
                            Editar
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    <Text style={[styles.itemCategory, { color: colors.primary }]}>{item.category}</Text>

                    {item.clientName ? (
                      <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>
                        Cliente: {item.clientName}
                      </Text>
                    ) : null}

                    <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>{item.description}</Text>

                    {item.link ? (
                      <Text
                        style={[styles.itemDescription, { color: theme.textSecondary }]}
                        numberOfLines={1}
                      >
                        🔗 {item.link}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.infoTitle, { color: theme.text }]}>Dica para melhorar seu perfil</Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>Quanto mais completo estiver seu portfólio, maiores são as chances de uma empresa aceitar sua solicitação.</Text>
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(editingItem)}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 18,
              gap: 12,
            }}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Editar trabalho realizado</Text>

            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Título"
              placeholderTextColor={theme.textSecondary}
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <TextInput
              value={editCategory}
              onChangeText={setEditCategory}
              placeholder="Categoria"
              placeholderTextColor={theme.textSecondary}
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <TextInput
              value={editClientName}
              onChangeText={setEditClientName}
              placeholder="Cliente"
              placeholderTextColor={theme.textSecondary}
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <TextInput
              value={editDate}
              onChangeText={setEditDate}
              placeholder="Data"
              placeholderTextColor={theme.textSecondary}
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Descrição"
              placeholderTextColor={theme.textSecondary}
              multiline
              style={{
                minHeight: 96,
                textAlignVertical: "top",
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <TextInput
              value={editLink}
              onChangeText={setEditLink}
              placeholder="Link"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              style={{
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: theme.text,
                fontWeight: "700",
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={({ pressed }) => [
                  {
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={closeEditModal}
              >
                <Text style={{ color: theme.text, fontWeight: "900" }}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.primary,
                    opacity: pressed || isSavingEdit ? 0.75 : 1,
                  },
                ]}
                disabled={isSavingEdit}
                onPress={saveEditedPortfolioItem}
              >
                <Text style={{ color: colors.white, fontWeight: "900" }}>
                  {isSavingEdit ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
