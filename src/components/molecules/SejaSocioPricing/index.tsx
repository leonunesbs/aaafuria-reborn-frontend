import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { gql, useMutation } from '@apollo/client';
import {
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { HiCheckCircle } from 'react-icons/hi';
import { MdLogin } from 'react-icons/md';
import { Card } from '..';
import { ISejaSocioPricing } from './ISejaSocioPricing';

const NOVO_PAGAMENTO = gql`
  mutation novoPagamento($tipoPlano: String!) {
    novoPagamento(tipoPlano: $tipoPlano) {
      pagamento {
        checkoutUrl
      }
    }
  }
`;

export const SejaSocioPricing = ({}: ISejaSocioPricing) => {
  const router = useRouter();
  const { green, bg } = useContext(ColorContext);
  const { isAuthenticated, token } = useContext(AuthContext);
  const [mutateFunction, { loading, data }] = useMutation(NOVO_PAGAMENTO);
  const color = useColorModeValue('black', 'white');
  const planos = [
    {
      slug: 'Mensal',
      nome: 'PLANO MENSAL',
      valor: '24,90',
      features: [
        '1 mês de acesso',
        'Participe dos treinos de todas as modalidades',
        'Participe dos ensaios da Carabina',
        'Ganhe desconto em produtos e eventos',
        'Acumule Calangos para desconto no INTERMED!',
        'Desconto no BONDE DO AHAM',
      ],
    },
    {
      slug: 'Semestral',
      nome: 'PACOTE SEMESTRAL',
      descricao: `Associação válida até (${
        new Date().getMonth() > 6 ? '31/12' : '30/06'
      }/${new Date().getFullYear()}).`,
      valor: '99,50',
      best: true,
      features: [
        'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
        'Acesso durante o semestre atual',
        'Participe dos treinos de todas as modalidades',
        'Participe dos ensaios da Carabina',
        'Ganhe desconto em produtos e eventos',
        'Desconto no INTERMED!',
        'Desconto no BONDE DO AHAM',
      ],
    },
    {
      slug: 'Anual',
      nome: 'PACOTE ANUAL',
      descricao: `Associação válida até (31/12/${new Date().getFullYear()}).`,
      valor: '198,00',
      features: [
        'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
        'Acesso durante o semestre atual e o próximo semestre',
        'Participe dos treinos de todas as modalidades',
        'Participe dos ensaios da Carabina',
        'Ganhe desconto em produtos e eventos',
        'Desconto no INTERMED',
        'Desconto no BONDE DO AHAM',
      ],
    },
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
            authorization: `JWT ${token || ' '}`,
          },
        },
      });
    },
    [mutateFunction, token],
  );
  return (
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
            h="100%"
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
            <Stack spacing={4} h="100%" justify={'space-between'}>
              <Stack spacing={4}>
                <Heading as="h3" size="lg">
                  {plano.nome}
                </Heading>

                <Text fontSize="2xl" fontWeight="extrabold" color={green}>
                  R${plano.valor}
                  <Text fontSize="lg" fontWeight="light" as="i" color={color}>
                    {plano.slug === 'Mensal' && '/mês'}
                    {plano.slug === 'Semestral' &&
                      `/${new Date().getFullYear()}.${
                        new Date().getMonth() > 6 ? '2' : '1'
                      }`}
                    {plano.slug === 'Anual' &&
                      `/${new Date().getFullYear()}.1 + ${new Date().getFullYear()}.2`}
                  </Text>
                </Text>
                <List spacing="4" mx="auto">
                  {plano.features.map((feature, index) => (
                    <ListItem fontWeight="medium" key={index}>
                      <ListIcon
                        fontSize="xl"
                        as={HiCheckCircle}
                        marginEnd={2}
                        color={green}
                      />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </Stack>
              <Popover placement="top">
                <Stack>
                  <Text textAlign="center" as="em">
                    Assine agora e aproveite 5% de desconto na{' '}
                    <strong>primeira associação</strong>!
                  </Text>
                  <Text textAlign="center" fontSize="sm">
                    {plano.descricao}
                  </Text>
                  <PopoverTrigger>
                    <Button
                      colorScheme="green"
                      w="100%"
                      variant={plano.best ? 'solid' : 'outline'}
                    >
                      Seja Sócio!
                    </Button>
                  </PopoverTrigger>
                </Stack>
                <Portal>
                  <PopoverContent bg={bg} _focus={{}}>
                    <PopoverArrow />
                    <PopoverHeader>
                      <Text fontWeight="bold">Associação {plano.nome}</Text>
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Flex flexGrow={1} justify="space-around" align="center">
                        <Text fontSize="lg" fontWeight="extrabold" mb={2}>
                          R${plano.valor}
                          <Text
                            fontSize="lg"
                            fontWeight="light"
                            as="i"
                            color={color}
                          >
                            {plano.slug === 'Mensal' && '/mês'}
                            {plano.slug === 'Semestral' &&
                              `/${new Date().getFullYear()}.${
                                new Date().getMonth() > 6 ? '2' : '1'
                              }`}
                            {plano.slug === 'Anual' &&
                              `/${new Date().getFullYear()}.1 + ${new Date().getFullYear()}.2`}
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
                            onClick={() => handlePagar(plano.slug)}
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
  );
};
