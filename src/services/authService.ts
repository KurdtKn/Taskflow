import { apiGet, apiPost } from "./api";
import { clearAuthStorage, saveLoggedUser } from "./storage";
import type {
  EmpresaApi,
  FreelancerApi,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  StoredUser,
  UserType,
} from "@/types/api";

async function findCompanyProfileId(email: string) {
  const empresas = await apiGet<EmpresaApi[]>("/api/Empresas");

  const empresa = empresas.find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
  );

  return empresa ? String(empresa.id) : null;
}

async function findFreelancerProfileId(email: string) {
  const freelancers = await apiGet<FreelancerApi[]>("/api/Freelancers");

  const freelancer = freelancers.find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
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
  const profileId = await getProfileIdByUserType(
    user.tipoUsuario,
    user.email
  );

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

export async function login(data: LoginRequest) {
  const response = await apiPost<LoginResponse>("/api/Login", {
    email: data.email,
    senha: data.senha,
  });

  return saveApiUserAsLoggedUser(response.usuario);
}

export async function register(data: RegisterRequest) {
  const response = await apiPost<RegisterResponse>("/api/Usuarios", {
    nome: data.nome,
    email: data.email,
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

  return saveApiUserAsLoggedUser(response.usuario);
}

export async function logout() {
  await clearAuthStorage();
}