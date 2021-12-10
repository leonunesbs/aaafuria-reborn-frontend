import PageHeading from '@/components/PageHeading';
import React, { useCallback, useContext, useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { GetServerSideProps } from 'next';
import { gql, useQuery } from '@apollo/client';
import { MdLogin } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  Text,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Image,
  useColorModeValue,
  Center,
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import CadastroDrawer from '@/components/CadastroDrawer';

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { signIn, signOut } = useContext(AuthContext);
  const { register, handleSubmit, setValue, getValues } = useForm<Inputs>();
  const [entrar, setEntrar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [cadastro, setCadastro] = React.useState(false);

  const [matricula, setMatricula] = React.useState('');
  const [errorMesage, setErrorMesage] = React.useState('');

  const ChakraNextImage = chakra(Image);

  const formValues = getValues();

  const query = useQuery(QUERY, {
    variables: { username: formValues.matricula || '' },
  });
  const handleReset = useCallback(() => {
    localStorage.removeItem('aaafuria@signUpMatricula');
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
      setLoading(true);
      query.refetch({ username: mtr });

      const { after }: { after?: string } = router.query;

      if (entrar) {
        signIn({ matricula: mtr, pin, redirectUrl: after }).catch((err) => {
          setErrorMesage(err.message);
          signOut();
        });
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

      setLoading(false);
    },
    [setLoading, entrar, query, signIn, signOut, router.query],
  );

  return (
    <Box
      bg={useColorModeValue('gray.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
    >
      <Box maxW="md" mx="auto">
        <Center>
          <Box boxSize="250px" position="relative">
            <ChakraNextImage
              placeholder="blur"
              blurDataURL="/calango-verde.png"
              layout="fill"
              objectFit="cover"
              src="/calango-verde.png"
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
            />
          </Box>
        </Center>
        <PageHeading>Acesse a plataforma</PageHeading>
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
                  <Button colorScheme="green" mt={4} onClick={onOpen}>
                    Cadastre-se!
                  </Button>
                  <CadastroDrawer isOpen={isOpen} onClose={onClose} />
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
                    variant="ghost"
                    mt={4}
                    isLoading={loading}
                    type="submit"
                  >
                    Entrar
                  </Button>
                  <Button
                    leftIcon={<AiFillHome size="20px" />}
                    colorScheme="gray"
                    variant="ghost"
                    onClick={() => router.push('/')}
                  >
                    Início
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
