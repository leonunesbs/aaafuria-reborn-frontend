import {
  Box,
  Divider,
  HStack,
  Icon,
  Stack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { PageHeading, VoltarButton } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaEquals } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import NextImage from 'next/image';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

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
  const { user, token } = useContext(AuthContext);
  const { data } = useQuery<BankData>(GET_BANK_DATA, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const contaSocio =
    data?.allUserMovimentacoes.edges[0]?.node.contaOrigem.socio.conta;
  const movimentacoes = data?.allUserMovimentacoes.edges.map(
    (movimentacao) => movimentacao.node,
  );

  useEffect(() => {
    if (user?.member.hasActiveMembership === false) {
      toast({
        title: 'Que pena! Você não é sócio...',
        description: 'Mas nossa associação está aberta, Seja Sócio!',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/#seja-socio');
    }
  }, [router, toast, user?.member.hasActiveMembership]);

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
                  <NextImage
                    src={'/calango-verde.png'}
                    width={'25px'}
                    height={'25px'}
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
                  <NextImage
                    src={'/calango-verde.png'}
                    width={'25px'}
                    height={'25px'}
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
                    <Td>{movimentacao.descricao}</Td>
                    <Td>R$ {movimentacao.valor}</Td>
                    <Td>
                      <HStack>
                        <NextImage
                          src={'/calango-verde.png'}
                          width={'15px'}
                          height={'15px'}
                          alt="calangos"
                        />
                        ]
                        <Text>
                          {(
                            Math.floor(parseFloat(movimentacao.valor) / 5) * 50
                          ).toFixed(0)}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text as="time" dateTime={movimentacao.resolvidaEm}>
                        {new Date(movimentacao.resolvidaEm).toLocaleString(
                          'pt-BR',
                          {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'America/Sao_Paulo',
                          },
                        )}
                      </Text>
                    </Td>
                  </Tr>
                ))}
                {!sortedMovimentacoes?.length && (
                  <Tr>
                    <Td colSpan={4}>
                      <Text textAlign={'center'}>
                        <em>Nenhuma movimentação encontrada</em>
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Card>
        <Stack mt={4} align="center">
          <VoltarButton href="/areamembro" />
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
