import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StoredUser, UserType } from "@/types/api";

const USER_KEY = "@taskflow:user";
const USER_ID_KEY = "@taskflow:user_id";
const USER_TYPE_KEY = "@taskflow:user_type";
const PROFILE_ID_KEY = "@taskflow:profile_id";
const COMPANY_DATA_KEY = "@taskflow:company_data";
const FREELANCER_DATA_KEY = "@taskflow:freelancer_data";

export type StoredCompanyData = {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  about: string;
  isVerified: boolean;
  tags: string[];
  logoUrl?: string;
};

export type StoredFreelancerData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  about: string;
  experience?: string;
  portfolioUrl?: string;
  isAvailable?: boolean;
  tags: string[];
  photoUrl?: string;
};

export async function saveLoggedUser(user: StoredUser) {
  await AsyncStorage.multiSet([
    [USER_KEY, JSON.stringify(user)],
    [USER_ID_KEY, user.id],
    [USER_TYPE_KEY, user.tipoUsuario],
    [PROFILE_ID_KEY, user.perfilId ?? ""],
  ]);
}

export async function getLoggedUser() {
  const userJson = await AsyncStorage.getItem(USER_KEY);

  if (!userJson) {
    return null;
  }

  return JSON.parse(userJson) as StoredUser;
}

export async function getUserId() {
  return AsyncStorage.getItem(USER_ID_KEY);
}

export async function getUserType() {
  return AsyncStorage.getItem(USER_TYPE_KEY) as Promise<UserType | null>;
}

export async function getProfileId() {
  const profileId = await AsyncStorage.getItem(PROFILE_ID_KEY);

  if (!profileId) {
    return null;
  }

  return profileId;
}

export async function saveCompanyData(userId: string, data: StoredCompanyData) {
  await AsyncStorage.setItem(
    `${COMPANY_DATA_KEY}:${userId}`,
    JSON.stringify(data)
  );
}

export async function getCompanyData(userId: string) {
  const companyDataJson = await AsyncStorage.getItem(
    `${COMPANY_DATA_KEY}:${userId}`
  );

  if (!companyDataJson) {
    return null;
  }

  return JSON.parse(companyDataJson) as StoredCompanyData;
}

export async function saveFreelancerData(
  userId: string,
  data: StoredFreelancerData
) {
  await AsyncStorage.setItem(
    `${FREELANCER_DATA_KEY}:${userId}`,
    JSON.stringify(data)
  );
}

export async function getFreelancerData(userId: string) {
  const freelancerDataJson = await AsyncStorage.getItem(
    `${FREELANCER_DATA_KEY}:${userId}`
  );

  if (!freelancerDataJson) {
    return null;
  }

  return JSON.parse(freelancerDataJson) as StoredFreelancerData;
}

export async function clearAuthStorage() {
  await AsyncStorage.multiRemove([
    USER_KEY,
    USER_ID_KEY,
    USER_TYPE_KEY,
    PROFILE_ID_KEY,
  ]);
}