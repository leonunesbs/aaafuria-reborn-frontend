import { CustomButtom, CustomIconButton } from '@/components/atoms';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useMutation } from '@apollo/client';
import {
  Badge,
  Box,
  Center,
  Progress,
  Spinner,
  Stack,
  Switch,
  TableRowProps,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MdCalendarToday, MdLogin } from 'react-icons/md';
import { ProgramacaoData } from '../../molecules/AtividadesSocioTable';

interface AtividadesSocioTableRowProps extends TableRowProps {
  node: ProgramacaoData;
  refetch: () => void;
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
  refetch,
  ...rest
}: AtividadesSocioTableRowProps) => {
  const router = useRouter();
  const bgRow = useColorModeValue('white', 'gray.800');
  const confirmedBgRow = useColorModeValue('green.50', 'gray.900');
  const toast = useToast();
  const { isAuthenticated } = useContext(AuthContext);

  const { ['aaafuriaMatricula']: matricula } = parseCookies();
  const [isConfirmed, setIsConfirmed] = useState(
    node.competidoresConfirmados.edges.find(
      ({ node: { socio } }) => socio.matricula === matricula,
    ) !== undefined,
  );
  const [loading, setLoading] = useState(false);

  const [value] = useState(
    node.competidoresConfirmados.edges.length > 0
      ? (node.competidoresConfirmados.edges.length / node.competidoresMinimo) *
          100
      : 0,
  );

  const [confirmarCompetidor] = useMutation(MUTATION_CONFIRMAR_COMPETIDOR);
  const [removerCompetidor] = useMutation(MUTATION_REMOVER_COMPETIDOR);

  const { ['aaafuriaToken']: token } = parseCookies();

  const handleConfirmarCompetidor = useCallback(
    async (idProgramacao: string) => {
      setLoading(true);
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
        refetch();
      });
      setLoading(false);
    },
    [confirmarCompetidor, refetch, toast, token],
  );

  const handleRemoverCompetidor = useCallback(
    async (idProgramacao: string) => {
      setLoading(true);
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
        refetch();
      });
      setLoading(false);
    },
    [refetch, removerCompetidor, token],
  );

  const handleSwitchParticipacao = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        handleConfirmarCompetidor(node.id);
      } else {
        handleRemoverCompetidor(node.id);
      }
    },
    [handleConfirmarCompetidor, handleRemoverCompetidor, node.id],
  );

  useEffect(() => {
    setIsConfirmed(
      node.competidoresConfirmados.edges.find(
        ({ node: { socio } }) => socio.matricula === matricula,
      ) !== undefined,
    );
  }, [matricula, node.competidoresConfirmados.edges]);

  return (
    <Tr key={node.id} {...rest} bgColor={isConfirmed ? confirmedBgRow : bgRow}>
      <Td>
        <Box>
          <Box>
            <Text textAlign="center">
              <i>{node.estado}</i>
            </Text>
            <Progress
              value={value}
              hasStripe={value >= 100 ? true : false}
              isAnimated
              colorScheme="green"
              mb={2}
            />
          </Box>
          <Center>
            {isAuthenticated ? (
              <Stack align="center">
                {isConfirmed && (
                  <Badge colorScheme="green" fontSize="xs">
                    EU VOU!
                  </Badge>
                )}
                {loading ? (
                  <Spinner color="green" />
                ) : (
                  <Switch
                    onChange={handleSwitchParticipacao}
                    colorScheme="green"
                    isChecked={isConfirmed}
                    size="lg"
                  />
                )}
              </Stack>
            ) : (
              <CustomButtom
                rightIcon={<MdLogin size="25px" />}
                onClick={() => router.push(`/entrar?after=${router.asPath}`)}
                isLoading={loading}
              >
                Fazer login
              </CustomButtom>
            )}
          </Center>
        </Box>
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
