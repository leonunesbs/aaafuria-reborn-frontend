import CustomButtom from '../CustomButtom';
import CustomIconButton from '../CustomIconButton';
import router from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { MdCalendarToday, MdCheck, MdOutlineCancel } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { ProgramacaoData } from '../AtividadesSocioTable';
import { Progress, TableRowProps, Td, Text, Tr } from '@chakra-ui/react';
import { useState } from 'react';

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

function AtividadesSocioTableRow({
  node,
  ...rest
}: AtividadesSocioTableRowProps) {
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

  const handleConfirmarCompetidor = (idProgramacao: string) => {
    confirmarCompetidor({
      variables: {
        id: idProgramacao,
      },
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    });
    router.reload();
  };

  const handleRemoverCompetidor = (idProgramacao: string) => {
    removerCompetidor({
      variables: {
        id: idProgramacao,
      },
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    });
    router.reload();
  };

  const value =
    node.competidoresConfirmados.edges.length > 0
      ? (node.competidoresConfirmados.edges.length / node.competidoresMinimo) *
        100
      : 0;

  return (
    <Tr key={node.id} {...rest} bgColor={isConfirmed ? 'green.50' : 'white'}>
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
            >
              Não vou
            </CustomButtom>
          ) : (
            <CustomButtom
              rightIcon={<MdCheck size="25px" />}
              onClick={() => handleConfirmarCompetidor(node.id)}
              isLoading={confirmarLoading}
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
}

export default AtividadesSocioTableRow;
