import * as gtag from 'lib/gtag';

import {
  Box,
  Center,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  Text,
  chakra,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CadastroDrawer, Card } from '@/components/molecules';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gql, useQuery } from '@apollo/client';

import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { MdLogin } from 'react-icons/md';
import NextImage from 'next/image';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_SOCIO = gql`
  query getSocio($matricula: String) {
    socioByMatricula(matricula: $matricula) {
      apelido
    }
  }
`;

type Inputs = {
  matricula: string;
  pin: string;
};

type GetSocioData = {
  socioByMatricula: {
    apelido: string;
  };
};

export default function Entrar() {
  const router = useRouter();
  const toast = useToast();
  const { after }: { after?: string } = router.query;

  const [login, setLogin] = useState(false);
  const pinInputFieldRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useQuery<GetSocioData>(GET_SOCIO, {
    fetchPolicy: 'no-cache',
  });
  const cadastroDisclosure = useDisclosure();
  const { signIn } = useContext(AuthContext);
  const {
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const ChakraNextImage = useMemo(() => chakra(NextImage), []);

  const checkMatricula = useCallback(
    (matricula: string) => {
      refetch({ matricula }).then(({ data }) => {
        if (data.socioByMatricula) {
          setLogin(true);
          pinInputFieldRef.current?.focus();
        } else if (matricula) {
          toast({
            description: 'Matrícula não encontrada. Cadastre-se!',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          router.push(`/entrar?cadastro=${matricula}`);
          cadastroDisclosure.onOpen();
        }
      });
    },
    [cadastroDisclosure, refetch, router, toast],
  );

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ matricula, pin }) => {
      if (!login) {
        checkMatricula(matricula);
      } else {
        await signIn({
          matricula,
          pin,
          redirectUrl: after,
        })
          .then(() => {
            toast({
              description: `Olá ${data?.socioByMatricula.apelido}, bem vind@ de volta!`,
              status: 'success',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
            gtag.event({
              action: 'login',
              category: 'engagement',
              label: matricula,
              value: 1,
            });
          })
          .catch(({ message }) => {
            setError('matricula', { message });
          });
      }
    },
    [
      after,
      checkMatricula,
      data?.socioByMatricula?.apelido,
      login,
      setError,
      signIn,
      toast,
    ],
  );

  useEffect(() => {
    if (getValues().matricula?.length < 8) {
      setLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues().matricula]);

  return (
    <Layout
      title="Entrar"
      desc="Acesse a plataforma de Sócios da @aaafuria!"
      isHeaded={false}
      isFooted={false}
    >
      <Box maxW="md" mx="auto">
        <Center>
          <Box boxSize="250px" position="relative">
            <ChakraNextImage
              placeholder="blur"
              layout="fill"
              objectFit="cover"
              src={'/calango-verde.png'}
              blurDataURL={'/calango-verde.png'}
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
              draggable={false}
            />
          </Box>
        </Center>
        <PageHeading>Acesse a plataforma</PageHeading>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} name="entrarForm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="matricula">Matrícula: </FormLabel>
                <Controller
                  name="matricula"
                  control={control}
                  rules={{
                    required: 'Insira sua matrícula',
                    minLength: {
                      value: 8,
                      message: 'A Matrícula deve conter 8 números',
                    },
                    maxLength: {
                      value: 8,
                      message: 'A Matrícula deve conter 8 números',
                    },
                    onChange: () => {
                      clearErrors();
                    },
                  }}
                  render={({ field }) => (
                    <HStack>
                      <PinInput
                        size="lg"
                        focusBorderColor="green.500"
                        placeholder=""
                        autoFocus
                        onComplete={checkMatricula}
                        {...field}
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
                  )}
                />
              </FormControl>
              <Collapse in={login} animateOpacity unmountOnExit>
                <FormControl>
                  <FormLabel htmlFor="pin">PIN: </FormLabel>
                  <Controller
                    name="pin"
                    control={control}
                    rules={{
                      required: 'Insira o seu PIN',
                      minLength: {
                        value: 6,
                        message: 'O PIN deve conter 6 números',
                      },
                      maxLength: {
                        value: 6,
                        message: 'O PIN deve conter 6 números',
                      },
                      onChange: () => {
                        clearErrors();
                      },
                    }}
                    render={({ field }) => (
                      <HStack>
                        <PinInput
                          size="lg"
                          mask
                          focusBorderColor="green.500"
                          onComplete={() => handleSubmit(onSubmit)()}
                          {...field}
                        >
                          <PinInputField ref={pinInputFieldRef} />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </HStack>
                    )}
                  />
                </FormControl>
              </Collapse>
              <CustomChakraNextLink
                href="https://diretoria.aaafuria.site/accounts/password_reset/"
                chakraLinkProps={{
                  color: 'green',
                  textAlign: 'right',
                  mt: 4,
                }}
              >
                Esqueceu o seu PIN?
              </CustomChakraNextLink>
              {errors.matricula && (
                <Text textAlign="center" textColor="gray.500">
                  <i>{errors.matricula?.message}</i>
                </Text>
              )}
              {errors.pin && (
                <Text textAlign="center" textColor="gray.500">
                  <i>{errors.pin?.message}</i>
                </Text>
              )}

              <Stack>
                <CustomButton
                  leftIcon={<MdLogin size="20px" />}
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Entrar
                </CustomButton>
                <CustomButton
                  leftIcon={<AiFillHome size="20px" />}
                  colorScheme="gray"
                  onClick={() => router.push('/')}
                >
                  Início
                </CustomButton>
              </Stack>
            </Stack>
          </form>
        </Card>
        <Center mt={2}>
          <Text as="i" textAlign="center" maxW="md" fontWeight="light">
            *Em caso de erro atualize a página.
          </Text>
        </Center>
      </Box>
      <CadastroDrawer
        isOpen={cadastroDisclosure.isOpen}
        onClose={() => {
          cadastroDisclosure.onClose();
        }}
      />
    </Layout>
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
