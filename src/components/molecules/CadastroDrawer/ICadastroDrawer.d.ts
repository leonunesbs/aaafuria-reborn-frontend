export interface ICadastroDrawer {
  isOpen: boolean;
  onClose: () => void;
}

export type CadastroInputsType = {
  matricula: string;
  confirm_matricula: stirng;
  turma: string;
  pin: string;
  pin_confirmar: string;
  email: string;
  nome: string;
  whatsapp: string;
  apelido: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
};
