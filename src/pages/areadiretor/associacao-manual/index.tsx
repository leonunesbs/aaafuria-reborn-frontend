import {
  Box,
  Collapse,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CustomButtom, PageHeading, VoltarButton } from '@/components/atoms';
import { MdCheck, MdRefresh } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { useRouter } from 'next/router';

const QUERY_SOCIO = gql`
  query socioByMatricula($matricula: String) {
    socioByMatricula(matricula: $matricula) {
      nome
      matricula
      turma
      email
      isSocio
      user {
        isStaff
      }
    }
  }
`;
const NOVA_ASSOCIACAO = gql`
  mutation NovaAssociacao($matricula: String!, $tipoPlano: String!) {
    associacaoManual(matricula: $matricula, tipoPlano: $tipoPlano) {
      ok
    }
  }
`;

type NovaAssociacaoData = {
  associacaoManual?: {
    ok: boolean;
  };
};

type Inputs = {
  matricula: string;
};

function AssociacaoManual() {
  const { token, isStaff, checkCredentials } = useContext(AuthContext);
  const { data, refetch } = useQuery(QUERY_SOCIO);
  const toast = useToast();
  const router = useRouter();

  const [novaAssociacao, { loading }] = useMutation<NovaAssociacaoData>(
    NOVA_ASSOCIACAO,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [matriculaSubject, setMatriculaSubject] = useState<string | null>(null);
  const [associacaoSubject, setAssociacaoSubject] = useState<string | null>(
    null,
  );
  const {
    handleSubmit,
    control,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const handleRestart = useCallback(() => {
    setMatriculaSubject(null);
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ matricula }) => {
      setMatriculaSubject(matricula);
      await refetch({ matricula });
      onOpen();
    },
    [onOpen, refetch],
  );

  const handleNovaAssociacao = useCallback(
    async (tipoPlano: string) => {
      await novaAssociacao({
        variables: {
          matricula: matriculaSubject,
          tipoPlano,
        },
      });
      await refetch({ matricula: matriculaSubject });
      toast({
        description: `Associação [${associacaoSubject}], confirmada.`,
        status: 'success',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
    },
    [associacaoSubject, matriculaSubject, novaAssociacao, refetch, toast],
  );

  useEffect(() => {
    checkCredentials();

    if (isStaff === false) {
      toast({
        title: 'Restrito.',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
  }, [checkCredentials, isStaff, router, toast]);

  return (
    <Layout title="Associação manual">
      <Box maxW="xl" mx={'auto'}>
        <PageHeading>Associação manual</PageHeading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card maxW={'xl'} mx="auto">
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
                    isDisabled={matriculaSubject !== null}
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
            {errors.matricula && (
              <Text textAlign="center" textColor="gray.500">
                <i>{errors.matricula?.message}</i>
              </Text>
            )}
            <Stack mt={4}>
              <CustomButtom
                type="submit"
                isDisabled={matriculaSubject !== null}
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
          </Card>
        </form>
        <Collapse in={isOpen} animateOpacity>
          <Card maxW="xl" mx="auto" mt={4}>
            <Text as="strong">Informações do cliente</Text>
            <Divider />
            <Stack mt={4}>
              <Skeleton isLoaded={data?.socioByMatricula !== null}>
                <Text>{data?.socioByMatricula?.nome || 'NOME'}</Text>
              </Skeleton>
              <Skeleton isLoaded={data?.socioByMatricula !== null}>
                <Text>{data?.socioByMatricula?.matricula || '00000000'}</Text>
              </Skeleton>
              <Skeleton isLoaded={data?.socioByMatricula !== null}>
                <Text>{data?.socioByMatricula?.turma || 'MED 00'}</Text>
              </Skeleton>
              <Divider />
              <Skeleton isLoaded={data?.socioByMatricula !== null}>
                <Box>
                  {data?.socioByMatricula?.isSocio ? (
                    <CustomButtom variant={'solid'}>Sócio ativo</CustomButtom>
                  ) : (
                    <Box>
                      <Text as="strong">Nova associação</Text>
                      <HStack mt={2}>
                        <CustomButtom
                          variant={
                            associacaoSubject === 'Mensal' ? 'solid' : 'outline'
                          }
                          onClick={() => setAssociacaoSubject('Mensal')}
                        >
                          Mensal
                        </CustomButtom>
                        <CustomButtom
                          variant={
                            associacaoSubject === 'Semestral'
                              ? 'solid'
                              : 'outline'
                          }
                          onClick={() => setAssociacaoSubject('Semestral')}
                        >
                          Semestral
                        </CustomButtom>
                        <CustomButtom
                          variant={
                            associacaoSubject === 'Anual' ? 'solid' : 'outline'
                          }
                          onClick={() => setAssociacaoSubject('Anual')}
                        >
                          Anual
                        </CustomButtom>
                      </HStack>
                      <CustomButtom
                        mt={4}
                        size={'lg'}
                        onClick={() =>
                          associacaoSubject &&
                          handleNovaAssociacao(associacaoSubject)
                        }
                        leftIcon={<MdCheck size="25px" />}
                        isLoading={loading}
                      >
                        Validar
                      </CustomButtom>
                    </Box>
                  )}
                </Box>
              </Skeleton>
            </Stack>
          </Card>
        </Collapse>
        <VoltarButton href={'/areadiretor'} />
      </Box>
    </Layout>
  );
}

export default AssociacaoManual;
