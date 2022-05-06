import {
  Badge,
  Box,
  HStack,
  Heading,
  Icon,
  Progress,
  Spinner,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
} from '@/components/atoms';
import { MdCalendarToday, MdLogin } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import Confetti from 'react-confetti';
import { FaWhatsapp } from 'react-icons/fa';
import { IAtividadesSocioTableRow } from './IAtividadesSocioTableRow';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

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
  handleRefetch,
  ...rest
}: IAtividadesSocioTableRow) => {
  const router = useRouter();
  const bgRow = useColorModeValue('white', 'gray.800');
  const confirmedBgRow = useColorModeValue('green.50', 'green.900');
  const toast = useToast();
  const { isAuthenticated } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const [confetti, setConfetti] = useState(false);

  const { ['aaafuriaMatricula']: matricula } = parseCookies();
  const [isConfirmed, setIsConfirmed] = useState(
    node.competidoresConfirmados.edges.find(
      ({ node: { socio } }) => socio.matricula === matricula,
    ) !== undefined,
  );
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () =>
      node.competidoresConfirmados.edges.length > 0
        ? (node.competidoresConfirmados.edges.length /
            node.competidoresMinimo) *
          100
        : 0,
    [node.competidoresConfirmados.edges.length, node.competidoresMinimo],
  );

  const [confirmarCompetidor] = useMutation(MUTATION_CONFIRMAR_COMPETIDOR);
  const [removerCompetidor] = useMutation(MUTATION_REMOVER_COMPETIDOR);

  const { ['aaafuriaToken']: token } = parseCookies();

  const handleConfetti = useCallback(() => {
    setConfetti(true);
  }, []);

  const handleConfirmarCompetidor = useCallback(
    async (idProgramacao: string) => {
      setIsConfirmed(true);
      setTimeout(() => setLoading(true), 100);
      await confirmarCompetidor({
        variables: {
          id: idProgramacao,
        },
        context: {
          headers: {
            authorization: `JWT ${token || ' '}`,
          },
        },
      })
        .then(() => {
          toast({
            title: 'Participação confirmada!',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          handleConfetti();
        })
        .catch(() => {
          toast({
            title: 'Erro ao confirmar participação.',
            status: 'error',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
      handleRefetch();
      setLoading(false);
    },
    [confirmarCompetidor, handleConfetti, handleRefetch, toast, token],
  );

  const handleRemoverCompetidor = useCallback(
    async (idProgramacao: string) => {
      setIsConfirmed(false);
      setTimeout(() => setLoading(true), 100);
      await removerCompetidor({
        variables: {
          id: idProgramacao,
        },
        context: {
          headers: {
            authorization: `JWT ${token || ' '}`,
          },
        },
      })
        .then(() => {
          toast({
            title: 'Participação removida!',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        })
        .catch(() => {
          toast({
            title: 'Erro ao remover participação.',
            status: 'error',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
      handleRefetch();
      setLoading(false);
    },
    [handleRefetch, removerCompetidor, toast, token],
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
  }, [matricula, node.competidoresConfirmados.edges, toast]);

  return (
    <Card
      key={node.id}
      {...rest}
      bgColor={isConfirmed ? confirmedBgRow : bgRow}
      position="relative"
      overflow={'hidden'}
    >
      {confetti && (
        <Confetti
          onConfettiComplete={() => setConfetti(false)}
          initialVelocityY={20}
          gravity={0.2}
          numberOfPieces={300}
          recycle={false}
        />
      )}
      <Stack direction={['column', 'column', 'row']}>
        <Stack w="full" spacing={4}>
          <Heading as="h2" size="md">
            {node.modalidade.nome}
            <Badge
              ml={2}
              fontFamily="Lato"
              colorScheme={node.estado === 'Confirmado' ? 'green' : 'orange'}
            >
              {node.estado}
            </Badge>
          </Heading>
          <Box>
            <HStack>
              <Text>Local: </Text>
              <Text>{node.local}</Text>
            </HStack>
            <HStack>
              <Text>Obs.: </Text>
              <Text>{node.descricao}</Text>
            </HStack>
          </Box>
          <HStack>
            <Icon as={MdCalendarToday} color={green} w={6} h={6} />
            <Text as={'time'} dateTime={node.dataHora}>
              {new Date(node.dataHora).toLocaleString('pt-BR', {
                timeStyle: 'short',
                dateStyle: 'short',
                timeZone: 'America/Sao_Paulo',
              })}
            </Text>
          </HStack>
        </Stack>
        <Stack
          spacing={6}
          direction={['row-reverse', 'row-reverse', 'column-reverse']}
          justify="space-around"
          align={'center'}
        >
          <Box>
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
              <CustomButton
                rightIcon={<MdLogin size="25px" />}
                onClick={() => router.push(`/entrar?after=${router.asPath}`)}
                isLoading={loading}
              >
                Fazer login
              </CustomButton>
            )}
          </Box>
          {isAuthenticated && node.grupoWhatsappUrl && (
            <CustomChakraNextLink
              href={node.grupoWhatsappUrl}
              chakraLinkProps={{ target: '_blank' }}
            >
              <CustomIconButton
                aria-label={node.modalidade.nome}
                icon={<FaWhatsapp size="25px" />}
              />
            </CustomChakraNextLink>
          )}
        </Stack>
      </Stack>
      <Progress
        position={'absolute'}
        value={value}
        hasStripe={value >= 100 ? true : false}
        isAnimated
        colorScheme="green"
        mb={2}
        w="full"
        bottom={-2}
        left={0}
      />
    </Card>
  );
};
