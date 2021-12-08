import { Card } from '@/components/Card';
import { gql, useQuery } from '@apollo/client';
import InputMask from 'react-input-mask';
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Image,
  FormLabel,
  Input,
  Stack,
  Text,
  FormControl,
  SimpleGrid,
  Center,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React from 'react';
import { MdRefresh } from 'react-icons/md';
import PageHeading from '@/components/PageHeading';
import Layout from '@/components/Layout';

const GET_SOCIO = gql`
  query {
    socioAutenticado {
      matricula
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
  const router = useRouter();
  const { data } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title="Carteirinha">
      <Box maxW="2xl" mx="auto">
        <PageHeading>Carteirinha</PageHeading>
        <Card
          overflow="hidden"
          position="relative"
          border="1px solid green"
          bgColor="green.50"
          filter={
            data?.socioAutenticado?.isSocio ? 'inherit' : 'grayscale(100%)'
          }
        >
          <Flex
            zIndex={1}
            bg="green"
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
              color="gray.100"
            >
              {data?.socioAutenticado?.isSocio
                ? 'SÓCIO ATIVO'
                : 'SÓCIO INATIVO'}
            </Text>
          </Flex>
          <Flex
            zIndex={1}
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
              src="/calango-verde.png"
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
                name="Segun Adebayo"
                src="https://bit.ly/sage-adebayo"
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
                  <Input
                    variant="fluxed"
                    type="email"
                    isReadOnly
                    value={data?.socioAutenticado?.email}
                    bgColor="green.100"
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
                    <Input
                      variant="fluxed"
                      isReadOnly
                      value={data?.socioAutenticado?.matricula}
                      bgColor="green.100"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Data de nascimento:</FormLabel>
                    <Input
                      variant="fluxed"
                      type="date"
                      isDisabled
                      value={data?.socioAutenticado?.dataNascimento}
                      bgColor="green.100"
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
                    <Input
                      variant="fluxed"
                      type="number"
                      isReadOnly
                      value={data?.socioAutenticado?.rg}
                      bgColor="green.100"
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
                    <Input
                      variant="fluxed"
                      type="date"
                      isDisabled
                      value={data?.socioAutenticado?.dataFim}
                      bgColor="green.100"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sócio desde:</FormLabel>
                    <Input
                      variant="fluxed"
                      type="date"
                      isDisabled
                      value={data?.socioAutenticado?.dataInicio}
                      bgColor="green.100"
                    />
                  </FormControl>
                </SimpleGrid>
              </Stack>
            </GridItem>
          </Grid>
        </Card>
        {data?.socioAutenticado?.isSocio ? (
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
            maxW="md"
            w="100%"
            onClick={() => router.reload()}
          >
            Atualizar
          </Button>
          <Button
            colorScheme="red"
            maxW="md"
            w="100%"
            onClick={() => router.push('/areasocio')}
          >
            Voltar
          </Button>
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
        destination: '/entrar?after=/carteirinha',
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
