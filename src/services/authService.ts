import { apiGet, apiPost } from "./api";
import { clearAuthStorage, saveLoggedUser } from "./storage";
import type {
  ApiUser,
  EmpresaApi,
  FreelancerApi,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  StoredUser,
  UserType,
} from "@/types/api";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function checkEmailAlreadyExists(email: string) {
  const usuarios = await apiGet<ApiUser[]>("/api/Usuarios");

  return usuarios.some(
    (usuario) => normalizeEmail(usuario.email) === normalizeEmail(email)
  );
}

async function findCompanyProfileId(email: string) {
  const empresas = await apiGet<EmpresaApi[]>("/api/Empresas");

  const empresa = empresas.find(
    (item) => normalizeEmail(item.email) === normalizeEmail(email)
  );

  return empresa ? String(empresa.id) : null;
}

async function findFreelancerProfileId(email: string) {
  const freelancers = await apiGet<FreelancerApi[]>("/api/Freelancers");

  const freelancer = freelancers.find(
    (item) => normalizeEmail(item.email) === normalizeEmail(email)
  );

  return freelancer ? String(freelancer.id) : null;
}

async function getProfileIdByUserType(tipoUsuario: UserType, email: string) {
  if (tipoUsuario === "empresa") {
    return findCompanyProfileId(email);
  }

  return findFreelancerProfileId(email);
}

async function saveApiUserAsLoggedUser(user: {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipoUsuario: UserType;
}) {
  const profileId = await getProfileIdByUserType(user.tipoUsuario, user.email);

  const loggedUser: StoredUser = {
    id: String(user.id),
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    tipoUsuario: user.tipoUsuario,
    perfilId: profileId,
  };

  await saveLoggedUser(loggedUser);

  return loggedUser;
}

function getFriendlyLoginError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("senha") ||
    message.includes("email") ||
    message.includes("inválid") ||
    message.includes("invalid") ||
    message.includes("incorret") ||
    message.includes("unauthorized")
  ) {
    return "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
  }

  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed")
  ) {
    return "Não foi possível conectar com a API. Verifique se a API está rodando.";
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível entrar agora. Tente novamente.";
}

function getFriendlyRegisterError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("e-mail já") ||
    message.includes("email já") ||
    message.includes("duplic") ||
    message.includes("duplicate") ||
    message.includes("already")
  ) {
    return "Este e-mail já está cadastrado. Use outro e-mail ou faça login.";
  }

  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed")
  ) {
    return "Não foi possível conectar com a API. Verifique se a API está rodando.";
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível criar sua conta agora. Tente novamente.";
}

export async function login(data: LoginRequest) {
  try {
    const response = await apiPost<LoginResponse>("/api/Login", {
      email: data.email.trim(),
      senha: data.senha,
    });

    if (!response.usuario) {
      throw new Error("Não foi possível carregar os dados do usuário.");
    }

    return saveApiUserAsLoggedUser(response.usuario);
  } catch (error) {
    throw new Error(getFriendlyLoginError(error));
  }
}

export async function register(data: RegisterRequest) {
  try {
    const emailAlreadyExists = await checkEmailAlreadyExists(data.email);

    if (emailAlreadyExists) {
      throw new Error(
        "Este e-mail já está cadastrado. Use outro e-mail ou faça login."
      );
    }

    const response = await apiPost<RegisterResponse>("/api/Usuarios", {
      nome: data.nome.trim(),
      email: data.email.trim(),
      senha: data.senha,
      tipoUsuario: data.tipoUsuario,
      telefone: data.telefone,
      cidade: data.cidade,
      estado: data.estado,
      documento: data.documento,
      nomeFantasia: data.nomeFantasia,
      descricao: data.descricao,
      experiencia: data.experiencia,
    });

    if (!response.usuario) {
      throw new Error("Conta criada, mas não foi possível carregar o usuário.");
    }

    return saveApiUserAsLoggedUser(response.usuario);
  } catch (error) {
    throw new Error(getFriendlyRegisterError(error));
  }
}

export async function logout() {
  await clearAuthStorage();
}