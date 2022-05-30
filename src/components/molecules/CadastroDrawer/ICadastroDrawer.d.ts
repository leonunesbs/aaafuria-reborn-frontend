export interface ICadastroDrawer {
  isOpen: boolean;
  onClose: () => void;
}

export type CadastroInputsType = {
  matricula: string;
  confirmMatricula: stirng;
  turma: string;
  pin: string;
  confirmPin: string;
  email: string;
  confirmEmail: string;
  nome: string;
  whatsapp: string;
  apelido: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  avatar: string;
};
