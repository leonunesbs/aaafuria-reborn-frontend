import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useMutation, useQuery } from '@apollo/client';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MdHome, MdLogin, MdPayment } from 'react-icons/md';

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
          }
          preco
          precoSocio
          precoConvidado
        }
      }
    }
  }
`;
const NOVO_INGRESSO_MUTATION = gql`
  mutation ($loteId: ID!) {
    novoIngresso(loteId: $loteId) {
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
};

export type LoteType = {
  node: {
    id: string;
    nome: string;
    evento: EventoType;
    preco: number;
    precoSocio: number;
    precoConvidado: number;
  };
};

function Eventos() {
  const router = useRouter();
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
                alt="Evento 1"
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
              <CustomButtom
                leftIcon={
                  isAuthenticated ? (
                    <MdPayment size="25px" />
                  ) : (
                    <MdLogin size="25px" />
                  )
                }
                borderTopRadius={0}
                isLoading={loading}
                onClick={
                  isAuthenticated
                    ? () => handleGoToPayment(node.id)
                    : () => router.push(`entrar?after=${router.asPath}`)
                }
              >
                {isAuthenticated
                  ? 'Ir para o pagamento'
                  : 'Faça login para pagar'}
              </CustomButtom>
            </Card>
          );
        })}
      </SimpleGrid>
      {data?.allLote?.edges?.length === 0 && (
        <Text textAlign={'center'} colspa>
          <em>Nenhum evento disponível para compra online no momento.</em>
        </Text>
      )}
      <Stack mt={4} align="center">
        <CustomChakraNextLink href="/">
          <CustomButtom
            mt={4}
            colorScheme="red"
            leftIcon={<MdHome size="25px" />}
          >
            Voltar ao início
          </CustomButtom>
        </CustomChakraNextLink>
      </Stack>
    </Layout>
  );
}

export default Eventos;
