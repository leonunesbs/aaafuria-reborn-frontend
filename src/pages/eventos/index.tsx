import {
  Badge,
  Box,
  Center,
  Divider,
  FormControl,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { CustomButton, PageHeading, VoltarButton } from '@/components/atoms';
import { FaTicketAlt, FaWhatsapp } from 'react-icons/fa';
import { MdLogin, MdPayment, MdSend } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_LOTES = gql`
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
          presencial
        }
      }
    }
  }
`;
const NOVO_INGRESSO_MUTATION = gql`
  mutation ($loteId: ID!, $presencial: Boolean) {
    novoIngresso(loteId: $loteId, presencial: $presencial) {
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
    presencial: boolean;
  };
};

function Eventos() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated } = useContext(AuthContext);
  const green = useColorModeValue('green.600', 'green.200');
  const { data, refetch } = useQuery(GET_LOTES);
  const [loading, setLoading] = useState(false);

  const [novoIngresso] = useMutation(NOVO_INGRESSO_MUTATION, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const handleGoToPayment = useCallback(
    async (loteId: string, presencial: boolean) => {
      setLoading(true);
      await novoIngresso({
        variables: { loteId, presencial },
      })
        .then(({ data }) => {
          if (!presencial) {
            toast({
              title: 'Ingresso reservado, efetue o pagamento em até 1h',
              status: 'success',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
            router.push(data.novoIngresso?.ingresso?.stripeCheckoutUrl);
          } else {
            refetch();
            toast({
              title: 'Ingresso reservado, efetue o pagamento em até 1h',
              description: (
                <Box mx="auto">
                  <Text>
                    Faça um PIX para <strong>pix@aaafuria.site</strong>.
                  </Text>
                  <Text textAlign={'center'} fontSize="sm">
                    <em>Albérico S S A Gonçalves</em>
                  </Text>
                  <CustomButton
                    colorScheme={'green'}
                    variant="solid"
                    leftIcon={<FaWhatsapp size="25px" />}
                    shadow="base"
                    onClick={() =>
                      window.open('https://wa.me/558699619656', '_blank')
                    }
                  >
                    Enviar comprovante
                  </CustomButton>
                </Box>
              ),
              status: 'success',
              duration: 1000 * 60,
              isClosable: true,
              position: 'top-left',
            });
          }
        })
        .catch((error) => {
          refetch();
          toast({
            description: error.message,
            status: 'warning',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
      setLoading(false);
    },
    [novoIngresso, refetch, router, toast],
  );
  const handleParticipar = useCallback(
    async (loteId: string) => {
      setLoading(true);
      await novoIngresso({
        variables: { loteId },
      })
        .then(({ data }) => {
          if (data.novoIngresso?.ok) {
            toast({
              description: 'Participação confirmada',
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
        })
        .catch((error) => {
          alert(error.message);
        });
      setLoading(false);
    },
    [novoIngresso, toast],
  );

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
          Nada para ver aqui. Volte mais tarde.
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
            <Card
              key={node.id}
              w="100%"
              px="0"
              py="0"
              overflow="hidden"
              variant={node.presencial ? 'success' : ''}
            >
              <Image
                w="full"
                objectFit="cover"
                src={node.evento.imagem}
                mx="auto"
                alt={node.evento.nome}
              />
              <Box py="8" px={{ base: '4', md: '10' }} textAlign="center">
                <PageHeading as="h2" fontWeight="bold">
                  {node.evento.nome}
                </PageHeading>
                <Badge fontSize={'lg'} mb={4} colorScheme="green">
                  <em>
                    <Text as="time" dateTime={node.evento.dataInicio}>
                      {new Date(node.evento.dataInicio).toLocaleString(
                        'pt-BR',
                        {
                          dateStyle: 'long',
                          timeStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        },
                      )}
                    </Text>
                  </em>
                </Badge>
                <PageHeading as="h3" fontWeight="normal" fontSize="2xl">
                  {node.nome}
                </PageHeading>
                <HStack textAlign="center" justify="space-around" p={2}>
                  {node.isGratuito ? (
                    <Box textColor={green}>
                      <Text fontWeight="bold">Evento Gratuito</Text>
                    </Box>
                  ) : (
                    <>
                      <Box textColor={green}>
                        <Text>SÓCIO</Text>
                        <Text
                          fontWeight={'extrabold'}
                          fontSize={'3xl'}
                          textShadow="base"
                        >
                          R$ {node.precoSocio.toString().replace('.', ',')}
                        </Text>
                      </Box>
                      {!node.evento.exclusivoSocios && (
                        <Box>
                          <Text>NÃO SÓCIO</Text>
                          <Text
                            fontWeight={'extrabold'}
                            fontSize={'3xl'}
                            textShadow="base"
                          >
                            R$ {node.preco.toString().replace('.', ',')}
                          </Text>
                        </Box>
                      )}
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
                </HStack>
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
                            rounded="3xl"
                            focusBorderColor={green}
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            placeholder="Email do convidado"
                            type="email"
                            isRequired
                            rounded="3xl"
                            focusBorderColor={green}
                          />
                        </FormControl>
                      </Stack>
                      <CustomButton
                        type="submit"
                        size="sm"
                        isDisabled={!isAuthenticated}
                      >
                        Convidar
                      </CustomButton>
                    </Box>
                  </form>
                )}
                <Divider />
                <Text textAlign={'center'} fontSize="sm" color={green}>
                  <em>
                    *Este ingresso, após a compra, é pessoal e intransferível. O
                    acesso ao evento é restrito ao titular do ingresso com a
                    devida apresentação do mesmo na portaria, junto ao documento
                    oficial com foto.
                  </em>
                </Text>
              </Box>
              {isAuthenticated ? (
                <CustomButton
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
                      : () => handleGoToPayment(node.id, node.presencial)
                  }
                  isDisabled={
                    node.evento.exclusivoSocios &&
                    !user?.member.hasActiveMembership
                  }
                >
                  {node.isGratuito
                    ? 'Participar'
                    : node.evento.exclusivoSocios &&
                      !user?.member.hasActiveMembership
                    ? 'Exclusivo para Sócios'
                    : node.presencial
                    ? 'Reservar'
                    : 'Reservar e pagar'}
                </CustomButton>
              ) : (
                <CustomButton
                  leftIcon={<MdLogin size="25px" />}
                  borderTopRadius={0}
                  variant="solid"
                  isLoading={loading}
                  onClick={() => router.push(`/entrar?after=${router.asPath}`)}
                >
                  Faça login para participar
                </CustomButton>
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
        <CustomButton
          mt={4}
          colorScheme="gray"
          leftIcon={<FaTicketAlt size="25px" />}
          onClick={() => router.push('/eventos/meus-ingressos')}
        >
          Meus ingressos
        </CustomButton>
        <VoltarButton href="/" />
      </Stack>
    </Layout>
  );
}

export default Eventos;
