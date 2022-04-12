import { SimpleGridProps } from '@chakra-ui/react';

export interface IAtividadeSocioTable extends SimpleGridProps {
  categoria: string;
}

export type ProgramacaoData = {
  id: string;
  estado: string;
  descricao: string;
  modalidade: {
    nome: string;
    categoria: string;
  };
  dataHora: string;
  local: string;
  finalizado: boolean;
  competidoresMinimo: number;
  grupoWhatsappUrl: string;
  competidoresConfirmados: {
    edges: {
      node: {
        socio: {
          matricula: string;
        };
      };
    }[];
  };
};
