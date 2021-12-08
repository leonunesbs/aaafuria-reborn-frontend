import {
  Box,
  Heading,
  Button,
  Text,
  SimpleGrid,
  Stack,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Card } from '@/components/Card';
import React, { useCallback, useContext, useEffect } from 'react';

import { BsCurrencyDollar } from 'react-icons/bs';
import { AuthContext } from '@/contexts/AuthContext';
import { MdLogin } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';
import { parseCookies } from 'nookies';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';

const NOVO_PAGAMENTO = gql`
  mutation novoPagamento($tipoPlano: String!) {
    novoPagamento(tipoPlano: $tipoPlano) {
      pagamento {
        checkoutUrl
      }
    }
  }
`;

function SejaSocio() {
  const router = useRouter();
  const { ['aaafuriaToken']: token } = parseCookies();
  const [mutateFunction, { loading, data }] = useMutation(NOVO_PAGAMENTO);

  const { isAuthenticated } = useContext(AuthContext);
  const planos = [
    { nome: 'Mensal', valor: '14,90' },
    { nome: 'Semestral', valor: '84,90', best: true },
    { nome: 'Anual', valor: '169,80' },
  ];

  useEffect(() => {
    if (data) {
      router.push(data.novoPagamento.pagamento.checkoutUrl);
    }
  }, [data, router]);

  const handlePagar = useCallback(
    (tipoPlano: string) => {
      mutateFunction({
        variables: {
          tipoPlano: tipoPlano,
        },
        context: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      });
    },
    [mutateFunction, token],
  );

  return (
    <Layout title="Seja sócio">
      <Box maxW="5xl" mx="auto">
        <PageHeading>
          Junte-se a nós, seja um{' '}
          <Text as="span" color="green">
            sócio Fúria
          </Text>
          !
        </PageHeading>
        <SimpleGrid
          columns={{ base: 1, lg: 3 }}
          spacing={{ base: '8', lg: '2' }}
          maxW="7xl"
          mx="auto"
          justifyItems="center"
          alignItems="center"
        >
          {planos.map((plano) => {
            return (
              <Card
                key={plano.nome}
                w="100%"
                position="relative"
                overflow="hidden"
                border={plano.best ? '1px solid green' : ''}
              >
                {plano.best && (
                  <Flex
                    bg="green.200"
                    position="absolute"
                    right={-20}
                    top={6}
                    width="240px"
                    transform="rotate(45deg)"
                    py={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      fontWeight="bold"
                      letterSpacing="wider"
                      color="gray.800"
                    >
                      + Popular
                    </Text>
                  </Flex>
                )}
                <Stack spacing={4} align="center">
                  <Heading as="h3" size="md">
                    Plano {plano.nome}
                  </Heading>
                  <Text fontSize="2xl" fontWeight="extrabold" color="green">
                    R${plano.valor}
                    <Text fontSize="lg" fontWeight="light" as="i" color="black">
                      {plano.nome === 'Mensal' && '/mês'}
                      {plano.nome === 'Semestral' && '/semestre'}
                      {plano.nome === 'Anual' && '/ano'}
                    </Text>
                  </Text>

                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        colorScheme="green"
                        w="100%"
                        variant={plano.best ? 'solid' : 'outline'}
                      >
                        Seja Sócio!
                      </Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>
                          <Text fontWeight="bold">Associação {plano.nome}</Text>
                        </PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          <Flex
                            flexGrow={1}
                            justify="space-around"
                            align="center"
                          >
                            <Text fontSize="lg" fontWeight="extrabold" mb={2}>
                              R${plano.valor}
                              <Text
                                fontSize="lg"
                                fontWeight="light"
                                as="i"
                                color="black"
                              >
                                {plano.nome === 'Mensal' && '/mês'}
                                {plano.nome === 'Semestral' && '/semestre'}
                                {plano.nome === 'Anual' && '/ano'}
                              </Text>
                            </Text>
                            {!isAuthenticated ? (
                              <Button
                                colorScheme="green"
                                leftIcon={<MdLogin />}
                                onClick={() =>
                                  router.push('/entrar?after=/sejasocio')
                                }
                              >
                                Entrar
                              </Button>
                            ) : (
                              <Button
                                colorScheme="green"
                                leftIcon={<BsCurrencyDollar />}
                                isDisabled={!isAuthenticated}
                                onClick={() => handlePagar(plano.nome)}
                                isLoading={loading}
                              >
                                Pagar
                              </Button>
                            )}
                          </Flex>
                        </PopoverBody>
                        {!isAuthenticated && (
                          <PopoverFooter>
                            <Text as="i" fontSize="sm" color="gray.500">
                              *É necessario estar logado na plataforma.
                            </Text>
                          </PopoverFooter>
                        )}
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
        <Stack align="center">
          <Button
            mt={4}
            colorScheme="red"
            w="100%"
            maxW="sm"
            onClick={() => router.push('/')}
          >
            Voltar ao início
          </Button>
        </Stack>
      </Box>
    </Layout>
  );
}

export default SejaSocio;
