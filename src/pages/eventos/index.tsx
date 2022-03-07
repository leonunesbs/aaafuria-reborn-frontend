import {
  Box,
  Center,
  Flex,
  FormControl,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { MdLogin, MdPayment, MdSend } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaTicketAlt } from 'react-icons/fa';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const LOTE_QUERY = gql`
  query getLotes {
    allLote(ativo: true) {
      edges {
        node {
          id
          nome
          evento {
            nome
            imagem
            dataInicio
            fechado
            exclusivoSocios
          }
          preco
          precoSocio
          precoConvidado
          isGratuito
        }
      }
    }
  }
`;
const NOVO_INGRESSO_MUTATION = gql`
  mutation ($loteId: ID!) {
    novoIngresso(loteId: $loteId) {
      ok
      ingresso {
        stripeCheckoutUrl
      }
    }
  }
`;

export type EventoType = {
  nome: string;
  imagem: string;
  dataInicio: string;
  fechado: boolean;
  exclusivoSocios: boolean;
};

export type LoteType = {
  node: {
    id: string;
    nome: string;
    evento: EventoType;
    preco: number;
    precoSocio: number;
    precoConvidado: number;
    isGratuito: boolean;
  };
};

function Eventos() {
  const router = useRouter();
  const toast = useToast();
  const { data } = useQuery(LOTE_QUERY);
  const { isSocio, isAuthenticated, checkCredentials } =
    useContext(AuthContext);
  const green = useColorModeValue('green.600', 'green.200');
  const [loading, setLoading] = useState(false);

  const [novoIngresso] = useMutation(NOVO_INGRESSO_MUTATION, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const handleGoToPayment = useCallback(
    async (loteId: string) => {
      setLoading(true);
      await novoIngresso({
        variables: { loteId },
      }).then(({ data }) => {
        router.push(data.novoIngresso?.ingresso?.stripeCheckoutUrl);
      });
      setLoading(false);
    },
    [novoIngresso, router],
  );
  const handleParticipar = useCallback(
    async (loteId: string) => {
      setLoading(true);
      await novoIngresso({
        variables: { loteId },
      }).then(({ data }) => {
        if (data.novoIngresso?.ok) {
          toast({
            description: 'Participação confirmada!',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        } else {
          toast({
            title: 'Atenção',
            description: 'Você já confirmou a sua participação.',
            status: 'warning',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        }
      });
      setLoading(false);
    },
    [novoIngresso, toast],
  );

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  if (!data) {
    return (
      <Layout
        title="Eventos"
        desc="Compre aqui seu ingresso para o próximo evento com padrão Fúria de qualidade."
        isHeaded={false}
        isFooted={false}
        h="100vh"
      >
        <Center h="100vh" flexDir="row">
          <Spinner size="xl" color="green" />
        </Center>
      </Layout>
    );
  }
  return (
    <Layout
      title="Eventos"
      desc="Compre aqui seu ingresso para o próximo evento com padrão Fúria de qualidade."
    >
      <PageHeading>Eventos</PageHeading>
      <SimpleGrid
        columns={{ base: 1, lg: 3 }}
        spacing={{ base: '8', lg: '2' }}
        maxW="7xl"
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        {data?.allLote?.edges?.map(({ node }: LoteType) => {
          return (
            <Card key={node.nome} w="100%" px="0" py="0" overflow="hidden">
              <Image
                w="full"
                objectFit="cover"
                src={node.evento.imagem}
                mx="auto"
                alt={node.evento.nome}
              />
              <Box py="8" px={{ base: '4', md: '10' }}>
                <PageHeading as="h2" fontWeight="bold">
                  {node.evento.nome}
                </PageHeading>
                <PageHeading as="h3" fontWeight="normal" fontSize="lg">
                  <em>
                    {new Date(node.evento.dataInicio).toLocaleDateString(
                      'pt-BR',
                      {
                        dateStyle: 'long',
                        timeZone: 'America/Sao_Paulo',
                      },
                    )}
                  </em>
                </PageHeading>
                <PageHeading as="h3" fontWeight="normal" fontSize="lg">
                  {node.nome}
                </PageHeading>
                <Flex
                  textAlign="center"
                  justify="space-around"
                  flexGrow={1}
                  my={6}
                >
                  {node.isGratuito ? (
                    <Box textColor={green}>
                      <Text fontWeight="bold">Evento Gratuito</Text>
                    </Box>
                  ) : (
                    <>
                      <Box textColor={isSocio ? green : 'inherit'}>
                        <Text>SÓCIO</Text>
                        <Text fontWeight={'bold'} fontSize={'lg'}>
                          R$ {node.precoSocio}
                        </Text>
                      </Box>
                      <Box textColor={!isSocio ? green : 'inherit'}>
                        <Text>NÃO SÓCIO</Text>
                        <Text fontWeight={'bold'} fontSize={'lg'}>
                          R$ {node.preco}
                        </Text>
                      </Box>
                    </>
                  )}
                  {!node.evento.fechado && (
                    <Box>
                      <Text>CONVIDADO</Text>
                      <Text fontWeight={'bold'} fontSize={'lg'}>
                        R$ {node.precoConvidado}
                      </Text>
                    </Box>
                  )}
                </Flex>
                {!node.evento.fechado && (
                  <form>
                    <PageHeading as="h2" fontWeight="normal" fontSize="sm">
                      <em>Adicionar convidado</em>
                    </PageHeading>
                    <Box>
                      <Stack>
                        <FormControl>
                          <Input
                            placeholder="Nome completo do convidado"
                            isRequired
                            focusBorderColor={green}
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            placeholder="Email do convidado"
                            type="email"
                            isRequired
                            focusBorderColor={green}
                          />
                        </FormControl>
                      </Stack>
                      <CustomButtom
                        type="submit"
                        size="sm"
                        isDisabled={!isAuthenticated}
                      >
                        Convidar
                      </CustomButtom>
                    </Box>
                  </form>
                )}
              </Box>
              {isAuthenticated ? (
                <CustomButtom
                  leftIcon={
                    node.isGratuito ? (
                      <MdSend size="25px" />
                    ) : (
                      <MdPayment size="25px" />
                    )
                  }
                  borderTopRadius={0}
                  variant="solid"
                  isLoading={loading}
                  onClick={
                    node.isGratuito
                      ? () => handleParticipar(node.id)
                      : () => handleGoToPayment(node.id)
                  }
                  isDisabled={node.evento.exclusivoSocios && !isSocio}
                >
                  {node.isGratuito ? 'Participar' : 'Ir para o pagamento'}
                </CustomButtom>
              ) : (
                <CustomButtom
                  leftIcon={<MdLogin size="25px" />}
                  borderTopRadius={0}
                  variant="solid"
                  isLoading={loading}
                  onClick={() => router.push(`entrar?after=${router.asPath}`)}
                >
                  Faça login para participar
                </CustomButtom>
              )}
            </Card>
          );
        })}
      </SimpleGrid>
      {data?.allLote?.edges?.length === 0 && (
        <Text textAlign={'center'}>
          <em>Nenhum evento disponível para compra online no momento.</em>
        </Text>
      )}
      <Stack mt={4} align="center">
        <CustomChakraNextLink href="/eventos/meus-ingressos">
          <CustomButtom
            mt={4}
            colorScheme="gray"
            leftIcon={<FaTicketAlt size="25px" />}
          >
            Meus ingressos
          </CustomButtom>
        </CustomChakraNextLink>
        <VoltarButton href="/" />
      </Stack>
    </Layout>
  );
}

export default Eventos;
