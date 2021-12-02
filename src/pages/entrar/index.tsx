import React, { useCallback, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Text,
  FormLabel,
  Heading,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Image,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';

import { useForm, SubmitHandler } from 'react-hook-form';

import { useQuery, gql } from '@apollo/client';

import { Card } from '@/components/Card';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';
import { MdLogin } from 'react-icons/md';
import { AiFillHome } from 'react-icons/ai';

const QUERY = gql`
  query BuscarSocio($username: String!) {
    allSocio(user_Username: $username) {
      edges {
        node {
          nome
        }
      }
    }
  }
`;

type Inputs = {
  matricula: string;
  pin: string;
};

export default function Entrar() {
  const router = useRouter();

  const { signIn, signOut } = useContext(AuthContext);
  const { register, handleSubmit, setValue, getValues } = useForm<Inputs>();
  const [entrar, setEntrar] = React.useState(false);
  const [cadastro, setCadastro] = React.useState(false);

  const [matricula, setMatricula] = React.useState('');
  const [errorMesage, setErrorMesage] = React.useState('');

  const formValues = getValues();

  const query = useQuery(QUERY, {
    variables: { username: formValues.matricula || '' },
  });
  const handleReset = useCallback(() => {
    setEntrar(false);
    setCadastro(false);
    setMatricula('');
    setErrorMesage('');
  }, []);

  useEffect(() => {
    if (matricula.length < 8) {
      setEntrar(false);
      setCadastro(false);
      setErrorMesage('');
    }
  }, [matricula]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ matricula: mtr, pin }) => {
      query.refetch({ username: mtr });
      if (entrar) {
        signIn({ matricula: mtr, pin }).catch((err) => {
          setErrorMesage(err.message);
          signOut();
        });

        localStorage.setItem('aaafuriaMatricula', mtr);
      }
      if (mtr.length === 8) {
        // Check edges lenght from query.data
        if (query.data.allSocio.edges.length === 0) {
          signOut();
          setCadastro(true);
          setEntrar(false);
          localStorage.setItem('aaafuria@signUpMatricula', mtr);
          alert('Matrícula não encontrada. Cadastre-se!');
        } else {
          setEntrar(true);
        }
      } else {
        setEntrar(false);
        signOut();
        setCadastro(true);
        setErrorMesage('Matrícula inválida');
      }
    },
    [entrar, query, signIn, signOut],
  );

  return (
    <Box
      bg={useColorModeValue('gray.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
    >
      <Box maxW="md" mx="auto">
        <Image
          boxSize="250px"
          objectFit="cover"
          src="/calango-verde.png"
          alt="logo"
          mx="auto"
          mb={{ base: '8', md: '12' }}
        />
        <Heading textAlign="center" size="xl" fontWeight="extrabold" mb={4}>
          Acesse a plataforma
        </Heading>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} name="entrarForm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Matrícula: </FormLabel>
                <HStack>
                  <Input type="hidden" {...register('matricula')} />
                  <PinInput
                    size="lg"
                    focusBorderColor="green.500"
                    value={matricula}
                    onChange={(value) => {
                      setValue('matricula', value);
                      setMatricula(value);
                    }}
                    placeholder=""
                    autoFocus
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </FormControl>
              {entrar && (
                <FormControl>
                  <FormLabel>PIN: </FormLabel>
                  <HStack>
                    <Input type="hidden" {...register('pin')} />
                    <PinInput
                      size="lg"
                      mask
                      focusBorderColor="green.500"
                      onChange={(value) => setValue('pin', value)}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </FormControl>
              )}
              {errorMesage && <Text>{errorMesage}</Text>}
              {cadastro ? (
                <>
                  <Button
                    colorScheme="green"
                    mt={4}
                    onClick={() => router.push('/cadastro')}
                  >
                    Cadastre-se!
                  </Button>
                  <Button
                    colorScheme="red"
                    mt={4}
                    onClick={() => handleReset()}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Stack>
                  <Button
                    leftIcon={<MdLogin size="20px" />}
                    colorScheme="green"
                    mt={4}
                    type="submit"
                  >
                    Entrar
                  </Button>
                  <Button
                    leftIcon={<AiFillHome size="20px" />}
                    colorScheme="gray"
                    maxW="sm"
                    onClick={() => router.push('/')}
                  >
                    Voltar
                  </Button>
                </Stack>
              )}
            </Stack>
          </form>
        </Card>
        <Center mt={2}>
          <Text as="i" textAlign="center" maxW="md" fontWeight="light">
            *Em caso de erro atualize a página.
          </Text>
        </Center>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
