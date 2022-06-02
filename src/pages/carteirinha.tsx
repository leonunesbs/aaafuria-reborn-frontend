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

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { GetServerSideProps } from 'next';
import InputMask from 'react-input-mask';
import { Layout } from '@/components/templates';
import { MdRefresh } from 'react-icons/md';
import { parseCookies } from 'nookies';

type CarteirinhaProps = BoxProps;

function Carteirinha({}: CarteirinhaProps) {
  const { green, bg } = useContext(ColorContext);
  const { user, checkAuth } = useContext(AuthContext);
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
            user?.isStaff
              ? 'inherit'
              : user?.member.hasActiveMembership
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
              {user?.isStaff
                ? 'DIRETOR'
                : user?.member.hasActiveMembership
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
                name={user?.member.name}
                src={user?.member.avatar}
                m={4}
                border={
                  user?.member.hasActiveMembership
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
                    {user?.member.name}
                  </Text>
                </Box>
                <Divider height="15px" colorScheme="green" variant="solid" />

                <FormControl>
                  <FormLabel>Email:</FormLabel>
                  <CarteirinhaInput value={user?.member.email} type="email" />
                </FormControl>
                <SimpleGrid
                  columns={{ base: 1, lg: 2 }}
                  spacing={{ base: '4', lg: '2' }}
                  maxW="xl"
                  mx="auto"
                >
                  <FormControl>
                    <FormLabel>Matrícula:</FormLabel>
                    <CarteirinhaInput value={user?.member.registration} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Data de nascimento:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={user?.member.birthDate}
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
                    <CarteirinhaInput type="number" value={user?.member.rg} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CPF:</FormLabel>
                    <Input
                      as={InputMask}
                      mask="999.999.999-99"
                      variant="fluxed"
                      isReadOnly
                      value={user?.member.cpf}
                      bgColor="green.100"
                      color="green.900"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valido até:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={user?.member.activeMembership?.currentEndDate}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sócio desde:</FormLabel>
                    <CarteirinhaInput
                      type="date"
                      value={user?.member.activeMembership?.startDate}
                    />
                  </FormControl>
                </SimpleGrid>
              </Stack>
            </GridItem>
          </Grid>
        </Card>

        {user?.isStaff ? (
          <Center>
            <Text as="i" textAlign="center" maxW="md" textColor={green}>
              *Este documento pertence a um Diretor A.A.A. Fúria.
            </Text>
          </Center>
        ) : user?.member.hasActiveMembership ? (
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
            onClick={checkAuth}
          >
            Atualizar
          </Button>
          <VoltarButton href="/areamembro" />
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
