import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Divider,
  HStack,
  Icon,
  Image,
  Stack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from 'react';
import { FaEquals } from 'react-icons/fa';
import { MdArrowLeft } from 'react-icons/md';

const GET_BANK_DATA = gql`
  query getMovimentacoes {
    allUserMovimentacoes(resolvida: true) {
      edges {
        node {
          valor
          descricao
          resolvidaEm
          contaOrigem {
            socio {
              conta {
                calangos
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

interface BankData {
  allUserMovimentacoes: {
    edges: {
      node: {
        valor: string;
        descricao: string;
        resolvidaEm: string;
        contaOrigem: {
          socio: {
            conta: {
              calangos: number;
            };
          };
        };
        contaDestino: {
          socio: {
            apelido: string;
          };
        };
      };
    }[];
    pageInfo: {
      hasNextPage: boolean;
    };
  };
}

function Carteira() {
  const [totalReais, setTotalReais] = useState(0.0);
  const router = useRouter();
  const toast = useToast();
  const { isSocio, checkCredentials } = useContext(AuthContext);
  const { data, refetch } = useQuery<BankData>(GET_BANK_DATA, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
    fetchPolicy: 'no-cache',
  });
  const contaSocio =
    data?.allUserMovimentacoes.edges[0]?.node.contaOrigem.socio.conta;
  const movimentacoes = data?.allUserMovimentacoes.edges.map(
    (movimentacao) => movimentacao.node,
  );

  useEffect(() => {
    refetch();
    checkCredentials();
  }, [checkCredentials, refetch]);

  useEffect(() => {
    if (isSocio === false) {
      toast({
        title: 'Que pena! Você não é sócio...',
        description: 'Mas nossa associação está aberta, Seja Sócio!',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/sejasocio');
    }
  }, [isSocio, router, toast]);

  useEffect(() => {
    if (movimentacoes) {
      const total = movimentacoes.reduce(
        (acc, curr) => acc + parseFloat(curr.valor),
        0,
      );
      setTotalReais(total);
    }
  }, [movimentacoes]);

  const sortedMovimentacoes = movimentacoes?.sort((a, b) => {
    const aDate = new Date(a.resolvidaEm);
    const bDate = new Date(b.resolvidaEm);
    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  });

  return (
    <Layout title="Minha carteira">
      <Stack maxW="4xl" mx="auto" spacing={4}>
        <PageHeading>Minha carteira</PageHeading>
        <HStack alignSelf={'center'}>
          <Card py={2}>
            <Stat>
              <StatLabel>A cada</StatLabel>
              <StatNumber>R$ 5</StatNumber>
              <StatHelpText>Gastos na plataforma</StatHelpText>
            </Stat>
          </Card>
          <Icon as={FaEquals} size="45px" />
          <Card py={2} variant="success">
            <Stat>
              <StatLabel>Receba</StatLabel>
              <StatNumber>
                <HStack>
                  <Image
                    src="/calango-verde.png"
                    boxSize="25px"
                    alt="calangos"
                  />
                  <Text>50</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>Em cashback</StatHelpText>
            </Stat>
          </Card>
        </HStack>
        <Divider />
        <Card>
          <StatGroup>
            <Stat textAlign={'center'}>
              <StatLabel>Total gasto (R$):</StatLabel>
              <StatNumber>
                <HStack justify="center">
                  <Text>R$ {totalReais.toFixed(1)}</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>reais</StatHelpText>
            </Stat>
            <Stat textAlign={'center'}>
              <StatLabel>Seu saldo (C$):</StatLabel>
              <StatNumber>
                <HStack justify="center">
                  <Image
                    src="/calango-verde.png"
                    boxSize="25px"
                    alt="calangos"
                  />
                  <Text>{contaSocio?.calangos || 0}</Text>
                </HStack>
              </StatNumber>
              <StatHelpText>calangos</StatHelpText>
            </Stat>
          </StatGroup>
          <PageHeading as="h2" size="md" mt={4}>
            Histórico de movimentações
          </PageHeading>
          <Box overflowX={'auto'}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th>Total (R$)</Th>
                  <Th>Total (C$)</Th>
                  <Th>Data</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedMovimentacoes?.map((movimentacao) => (
                  <Tr key={movimentacao.resolvidaEm}>
                    <Th>{movimentacao.descricao}</Th>
                    <Th>R$ {movimentacao.valor}</Th>
                    <Th>
                      <HStack>
                        <Image
                          src="/calango-verde.png"
                          boxSize="15px"
                          alt="calangos"
                        />
                        ]
                        <Text>
                          {(
                            Math.floor(parseFloat(movimentacao.valor) / 5) * 50
                          ).toFixed(0)}
                        </Text>
                      </HStack>
                    </Th>
                    <Th>
                      {new Date(movimentacao.resolvidaEm).toLocaleString(
                        'pt-BR',
                        {
                          dateStyle: 'short',
                          timeStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        },
                      )}
                    </Th>
                  </Tr>
                ))}
                {!sortedMovimentacoes?.length && (
                  <Tr>
                    <Th colSpan={4}>
                      <Text textAlign={'center'}>
                        <em>Nenhuma movimentação encontrada</em>
                      </Text>
                    </Th>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Card>
        <Stack mt={4} align="center">
          <CustomChakraNextLink href="/areasocio">
            <CustomButtom
              colorScheme="red"
              leftIcon={<MdArrowLeft size="25px" />}
            >
              Voltar
            </CustomButtom>
          </CustomChakraNextLink>
        </Stack>
      </Stack>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Carteira;
