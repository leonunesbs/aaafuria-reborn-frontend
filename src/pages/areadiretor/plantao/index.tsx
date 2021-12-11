import CustomButtom from '@/components/CustomButtom';
import Layout from '@/components/Layout';
import LojaPlantao from '@/components/LojaPlantao';
import NextLink from 'next/link';
import PageHeading from '@/components/PageHeading';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { gql, useQuery } from '@apollo/client';
import { MdCheck, MdHome, MdRefresh, MdShoppingCart } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Link,
  chakra,
} from '@chakra-ui/react';

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

const ChakraNextLink = chakra(NextLink);

function Plantao() {
  const matriculaForm = useForm<Inputs>();
  const router = useRouter();
  const { m }: any = router.query;

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
          alert('Matrícula não encontrada');
          handleRestart();
        }
      }),
    [handleRestart, query],
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
                    autoFocus
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
          <ChakraNextLink
            passHref
            href={`/areadiretor/plantao/carrinho?m=${socioData.matricula}`}
          >
            <Link _hover={{ textDecoration: 'none' }}>
              <CustomButtom
                colorScheme="gray"
                leftIcon={<MdShoppingCart size="25px" />}
              >
                Carrinho
              </CustomButtom>
            </Link>
          </ChakraNextLink>
        )}
        <ChakraNextLink passHref href="/">
          <Link _hover={{ textDecoration: 'none' }}>
            <CustomButtom colorScheme="red" leftIcon={<MdHome size="25px" />}>
              Voltar ao início
            </CustomButtom>
          </Link>
        </ChakraNextLink>
      </Stack>
    </Layout>
  );
}

export default Plantao;
