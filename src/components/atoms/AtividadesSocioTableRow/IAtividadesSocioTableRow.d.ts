import { ProgramacaoData } from '@/components/molecules/AtividadesSocioTable/IAtividadesSocioTable';
import { TableRowProps } from '@chakra-ui/react';

export interface IAtividadesSocioTableRow extends TableRowProps {
  node: ProgramacaoData;
  handleRefetch: () => void;
}
