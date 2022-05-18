import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  CarteirinhaInput,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import React, { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { GetServerSideProps } from 'next';
import InputMask from 'react-input-mask';
import { Layout } from '@/components/templates';
import { MdRefresh } from 'react-icons/md';
import { parseCookies } from 'nookies';

const GET_SOCIO = gql`
  query {
    socioAutenticado {
      id
      user {
        isStaff
      }
      matricula
      avatar
      nome
      email
      apelido
      dataNascimento
      cpf
      rg
      isSocio
      dataInicio
      dataFim
    }
  }
`;

interface CarteirinhaProps extends BoxProps {
  token: string;
}

function Carteirinha({ token }: CarteirinhaProps) {
  const { green, bg } = useContext(ColorContext);
  const { data, refetch, loading } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  const cardBg = useColorModeValue('green.50', 'green.900');

  return (
    <Layout title="Carteirinha">
      <Box maxW="2xl" mx="auto">
        <PageHeading>Carteirinha</PageHeading>
        <Card
          overflow="hidden"
          position="relative"
          border="1px solid green"
          bgColor={cardBg}
          filter={
            data?.socioAutenticado?.user.isStaff
              ? 'inherit'
              : data?.socioAutenticado?.isSocio
              ? 'inherit'
              : 'grayscale(100%)'
          }
        >
          <Flex
            zIndex={1}
            bg={green}
            position="absolute"
            left={-16}
            top={{ base: 8, lg: 12 }}
            width={{ base: '230px', lg: '260px' }}
            transform="rotate(-45deg)"
            py={2}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize={{ base: 'sm', lg: 'lg' }}
              textTransform="uppercase"
              fontWeight="bold"
              letterSpacing="wider"
              color={bg}
            >
              {data?.socioAutenticado?.user.isStaff
                ? 'DIRETOR'
                : data?.socioAutenticado?.isSocio
                ? 'SÓCIO ATIVO'
                : 'SÓCIO INATIVO'}
            </Text>
          </Flex>
          <Flex
            zIndex={0}
            position="absolute"
            right={-16}
            bottom={-20}
            width="240px"
            py={2}
            justifyContent="center"
            alignItems="center"
          >
            <Image
              boxSize="240px"
              objectFit="cover"
              src={'/calango-verde.png'}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
              opacity={0.5}
            />
          </Flex>
          <Grid
            mx="auto"
            templateColumns={{ base: '1fr', lg: 'repeat(6, 1fr)' }}
          >
            <GridItem d="flex" alignItems="center" justifyContent="center">
              <Avatar
                size="2xl"
                name={data?.socioAutenticado?.nome}
                src={data?.socioAutenticado?.avatar}
                m={4}
                border={
                  data?.socioAutenticado?.isSocio
                    ? '5px solid green'
                    : '5px solid gray'
                }
              />
            </GridItem>
            <GridItem colSpan={5}>
              <Stack ml={4} spacing={2}>
                <Box
                  bgColor="green.100"
                  px="4"
                  py="2"
                  rounded={{ base: 'md', sm: 'lg' }}
                >
                  <Text fontSize="2xl" fontWeight="extrabold" color="green.800">
                    {data?.socioAutenticado?.nome}
                  </Text>
                </Box>
                <Divider height="15px" colorScheme="green" variant="solid" />

                <FormControl>
                  <FormLabel>Email:</FormLabel>
                  <CarteirinhaInput
                    value={data?.socioAutenticado?.email}
                    type="email"
                  />
                </FormControl>
                <SimpleGrid
                  columns={{ base: 1, lg: 2 }}
                  spacing={{ base: '4', lg: '2' }}
                  maxW="xl"
                  mx="auto"
                >
                  <FormControl>
                    <FormLabel>Matrícula:</FormLabel>
                    <CarteirinhaInput
                      value={data?.socioAutenticado?.matricula}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Data de nascimento:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={data?.socioAutenticado?.dataNascimento}
                    />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid
                  columns={{ base: 1, lg: 2 }}
                  spacing={{ base: '4', lg: '2' }}
                  maxW="xl"
                  mx="auto"
                >
                  <FormControl>
                    <FormLabel>RG:</FormLabel>
                    <CarteirinhaInput
                      type="number"
                      value={data?.socioAutenticado?.rg}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CPF:</FormLabel>
                    <Input
                      as={InputMask}
                      mask="999.999.999-99"
                      variant="fluxed"
                      isReadOnly
                      value={data?.socioAutenticado?.cpf}
                      bgColor="green.100"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valido até:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={data?.socioAutenticado?.dataFim}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sócio desde:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={data?.socioAutenticado?.dataInicio}
                    />
                  </FormControl>
                </SimpleGrid>
              </Stack>
            </GridItem>
          </Grid>
        </Card>

        {data?.socioAutenticado?.user.isStaff ? (
          <Center>
            <Text as="i" textAlign="center" maxW="md" textColor={green}>
              *Este documento pertence a um Diretor A.A.A. Fúria.
            </Text>
          </Center>
        ) : data?.socioAutenticado?.isSocio ? (
          <Center>
            <Text as="i" textAlign="center" maxW="md">
              *Este documento estará dentro da validade enquanto apresentar o
              status:{' '}
              <Text as="span" color="green" fontWeight="bold">
                Sócio ativo
              </Text>
              .
            </Text>
          </Center>
        ) : (
          <Center>
            <Text as="i" textAlign="center" maxW="md">
              *Este documento está <b>fora da validade</b> e a associação está
              inativa!
            </Text>
          </Center>
        )}
        <Stack mt={8} align="center">
          <Button
            leftIcon={<MdRefresh size="25px" />}
            colorScheme="green"
            variant="ghost"
            maxW="md"
            w="100%"
            isLoading={loading}
            onClick={() => refetch()}
          >
            Atualizar
          </Button>
          <VoltarButton href="/areasocio" />
        </Stack>
      </Box>
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
    props: {
      token,
    },
  };
};

export default Carteirinha;
