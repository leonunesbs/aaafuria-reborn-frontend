import { Card } from '@/components/Card';
import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import Layout from '@/components/Layout';
import LojaPlantao from '@/components/LojaPlantao';
import PageHeading from '@/components/PageHeading';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  MdArrowLeft,
  MdCheck,
  MdRefresh,
  MdShoppingCart,
} from 'react-icons/md';

const QUERY_SOCIO = gql`
  query socioByMatricula($matricula: String!) {
    socioByMatricula(matricula: $matricula) {
      nome
      matricula
      email
      isSocio
      user {
        isStaff
      }
    }
  }
`;

type Inputs = {
  matricula: string;
};

function Plantao() {
  const { isStaff } = useContext(AuthContext);
  const matriculaForm = useForm<Inputs>();
  const router = useRouter();
  const { m }: any = router.query;
  const toast = useToast();

  const query = useQuery(QUERY_SOCIO, {
    variables: {
      matricula: '00000000',
    },
  });

  const [socioData, setSocioData] = useState<any | null>(null);
  const [matriculaInput, setMatriculaInput] = useState('');

  const handleRestart = useCallback(() => {
    setMatriculaInput('');
    setSocioData(null);
    router.replace('/areadiretor/plantao');
    matriculaForm.reset();
  }, [router, matriculaForm]);

  const getSocioData = useCallback(
    ({ matricula }: { matricula: string }) =>
      query.refetch({ matricula }).then(({ data }) => {
        setSocioData(data.socioByMatricula);
        if (!data.socioByMatricula) {
          toast({
            description: 'Matrícula não encontrada.',
            status: 'warning',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          handleRestart();
        }
      }),
    [handleRestart, query, toast],
  );

  const submitMatricula: SubmitHandler<Inputs> = useCallback(
    ({ matricula }) => {
      getSocioData({ matricula });
      router.replace(`/areadiretor/plantao?m=${matricula}`);
    },
    [getSocioData, router],
  );

  useEffect(() => {
    if (m) {
      setMatriculaInput(m);
      submitMatricula({ matricula: m });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m]);

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  return (
    <Layout title="Área do Diretor">
      <Box maxW="xl" mx="auto">
        <PageHeading>Plantão de Vendas</PageHeading>
        <form onSubmit={matriculaForm.handleSubmit(submitMatricula)}>
          <Card>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Matrícula: </FormLabel>
                <HStack>
                  <Input
                    type="hidden"
                    autoFocus
                    {...matriculaForm.register('matricula')}
                  />
                  <PinInput
                    size="lg"
                    focusBorderColor="green.500"
                    value={matriculaInput}
                    onChange={(value) => {
                      matriculaForm.setValue('matricula', value);
                      setMatriculaInput(value);
                    }}
                    isDisabled={socioData !== null}
                    placeholder=""
                  >
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                    <PinInputField borderColor="green.500" />
                  </PinInput>
                </HStack>
              </FormControl>
              {socioData && (
                <Card textAlign="center">
                  <Text>{socioData.matricula}</Text>
                  <Text>{socioData.turma}</Text>
                  <Text>{socioData.nome}</Text>
                  <Text>
                    {socioData.isSocio ? (
                      <Text textColor="green" fontWeight="bold">
                        Sócio ativo
                      </Text>
                    ) : (
                      'Sócio inativo'
                    )}
                  </Text>
                </Card>
              )}
              <Stack>
                <CustomButtom
                  type="submit"
                  isDisabled={socioData != null}
                  leftIcon={<MdCheck size="25px" />}
                >
                  Confirmar
                </CustomButtom>
                <CustomButtom
                  leftIcon={<MdRefresh size="25px" />}
                  colorScheme="yellow"
                  onClick={handleRestart}
                >
                  Recomeçar
                </CustomButtom>
              </Stack>
            </Stack>
          </Card>
        </form>
        <LojaPlantao matriculaSocio={socioData?.matricula} />
      </Box>
      <Stack mt={10} align="center">
        {socioData && (
          <CustomChakraNextLink
            href={`/areadiretor/plantao/carrinho?m=${socioData.matricula}`}
          >
            <CustomButtom
              colorScheme="gray"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Ir para o carrinho
            </CustomButtom>
          </CustomChakraNextLink>
        )}
        <CustomChakraNextLink href="/areadiretor">
          <CustomButtom
            colorScheme="red"
            leftIcon={<MdArrowLeft size="25px" />}
          >
            Voltar ao menu
          </CustomButtom>
        </CustomChakraNextLink>
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

export default Plantao;
