import router from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { MdCalendarToday, MdCheck, MdOutlineCancel } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { ProgramacaoData } from '../../molecules/AtividadesSocioTable';
import {
  Progress,
  TableRowProps,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useContext, useState } from 'react';
import { CustomButtom, CustomIconButton } from '@/components/atoms';
import { AuthContext } from '@/contexts/AuthContext';

interface AtividadesSocioTableRowProps extends TableRowProps {
  node: ProgramacaoData;
}

const MUTATION_REMOVER_COMPETIDOR = gql`
  mutation removerCompetidor($id: ID!) {
    removerCompetidorNaProgramacao(id: $id) {
      ok
    }
  }
`;
const MUTATION_CONFIRMAR_COMPETIDOR = gql`
  mutation confirmarCompetidor($id: ID!) {
    confirmarCompetidorNaProgramacao(id: $id) {
      ok
    }
  }
`;

export const AtividadesSocioTableRow = ({
  node,
  ...rest
}: AtividadesSocioTableRowProps) => {
  const bgRow = useColorModeValue('white', 'gray.800');
  const confirmedBgRow = useColorModeValue('green.50', 'gray.900');
  const toast = useToast();
  const { isAuthenticated } = useContext(AuthContext);

  const { ['aaafuriaMatricula']: matricula } = parseCookies();
  const [isConfirmed] = useState(
    node.competidoresConfirmados.edges.find(
      ({ node: { socio } }) => socio.matricula === matricula,
    ) !== undefined,
  );

  const [confirmarCompetidor, { loading: confirmarLoading }] = useMutation(
    MUTATION_CONFIRMAR_COMPETIDOR,
  );
  const [removerCompetidor, { loading: removerLoading }] = useMutation(
    MUTATION_REMOVER_COMPETIDOR,
  );

  const { ['aaafuriaToken']: token } = parseCookies();

  const handleConfirmarCompetidor = useCallback(
    async (idProgramacao: string) => {
      await confirmarCompetidor({
        variables: {
          id: idProgramacao,
        },
        context: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }).then(() => {
        toast({
          description: 'Participação confirmada.',
          status: 'success',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        router.reload();
      });
    },
    [confirmarCompetidor, toast, token],
  );

  const handleRemoverCompetidor = useCallback(
    async (idProgramacao: string) => {
      await removerCompetidor({
        variables: {
          id: idProgramacao,
        },
        context: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }).then(() => {
        router.reload();
      });
    },
    [removerCompetidor, token],
  );

  const value =
    node.competidoresConfirmados.edges.length > 0
      ? (node.competidoresConfirmados.edges.length / node.competidoresMinimo) *
        100
      : 0;

  return (
    <Tr key={node.id} {...rest} bgColor={isConfirmed ? confirmedBgRow : bgRow}>
      <Td>
        <>
          <>
            <Text textAlign="center" size="sm">
              <i>{node.estado}</i>
            </Text>
            <Progress
              value={value}
              hasStripe={value >= 100 ? true : false}
              isAnimated
              colorScheme="green"
              mb={2}
            />
          </>
          {isConfirmed ? (
            <CustomButtom
              leftIcon={<MdOutlineCancel size="25px" />}
              colorScheme="red"
              onClick={() => handleRemoverCompetidor(node.id)}
              isLoading={removerLoading}
              isDisabled={!isAuthenticated}
            >
              Não vou
            </CustomButtom>
          ) : (
            <CustomButtom
              rightIcon={<MdCheck size="25px" />}
              onClick={() => handleConfirmarCompetidor(node.id)}
              isLoading={confirmarLoading}
              isDisabled={!isAuthenticated}
            >
              Eu vou
            </CustomButtom>
          )}
        </>
      </Td>
      <Td>{node.modalidade.nome}</Td>
      <Td>{node.modalidade.categoria}</Td>
      <Td textAlign="center">
        <CustomIconButton
          aria-label="Adicionar ao calendário"
          colorScheme="green"
          variant="ghost"
          icon={<MdCalendarToday size="20px" />}
          isDisabled
        />
        <Text>
          {new Date(node.dataHora).toLocaleDateString('pt-BR', {
            dateStyle: 'short',
            timeZone: 'America/Sao_Paulo',
          })}
        </Text>
        <Text>
          {new Date(node.dataHora).toLocaleTimeString('pt-BR', {
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo',
          })}
        </Text>
      </Td>
      <Td>{node.local}</Td>
      <Td>{node.descricao}</Td>
    </Tr>
  );
};
