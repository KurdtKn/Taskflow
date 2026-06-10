export type UserType = "empresa" | "freelancer";

export type LoginRequest = {
  email: string;
  senha: string;
};

export type ApiUser = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipoUsuario: UserType;
  ativo?: boolean;
};

export type LoginResponse = {
  mensagem: string;
  usuario: ApiUser;
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: UserType;
  telefone?: string;
  cidade?: string;
  estado?: string;
  documento?: string;
  nomeFantasia?: string;
  descricao?: string;
  experiencia?: string;
};

export type RegisterResponse = {
  mensagem: string;
  usuario: ApiUser;
};

export type StoredUser = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipoUsuario: UserType;
  perfilId: string | null;
};

export type EmpresaApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cnpj: string | null;
  nomeFantasia: string | null;
  descricao: string | null;
  cidade: string | null;
  estado: string | null;
};

export type FreelancerApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  descricao: string | null;
  experiencia: string | null;
  cidade: string | null;
  estado: string | null;
  disponibilidade: boolean;
};