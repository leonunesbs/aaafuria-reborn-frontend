import { Card, ClientInfoCard } from '@/components/molecules';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdCheck, MdRefresh } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';

import { CustomButtom } from '@/components/atoms';
import { useRouter } from 'next/router';

const QUERY_SOCIO = gql`
  query socioByMatricula($matricula: String!) {
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

export interface InputMatriculaPlantaoProps {
  socioData: any;
  setSocioData: Dispatch<any>;
}

type Inputs = {
  matricula: string;
};

export const InputMatriculaPlantao = ({
  socioData,
  setSocioData,
}: InputMatriculaPlantaoProps) => {
  const router = useRouter();
  const { m }: any = router.query;
  const toast = useToast();

  const matriculaForm = useForm<Inputs>();

  const query = useQuery(QUERY_SOCIO, {
    variables: {
      matricula: '00000000',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [matriculaInput, setMatriculaInput] = useState('');

  const handleRestart = useCallback(() => {
    onClose();
    setMatriculaInput('');
    setSocioData(null);
    router.replace('/areadiretor/plantao');
    matriculaForm.reset();
  }, [onClose, setSocioData, router, matriculaForm]);

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
    [handleRestart, query, setSocioData, toast],
  );
  const submitMatricula: SubmitHandler<Inputs> = useCallback(
    ({ matricula }) => {
      onOpen();
      getSocioData({ matricula });
      router.replace(`/areadiretor/plantao?m=${matricula}`);
    },
    [getSocioData, onOpen, router],
  );
  useEffect(() => {
    if (m) {
      setMatriculaInput(m);
      submitMatricula({ matricula: m });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m]);
  return (
    <>
      <form onSubmit={matriculaForm.handleSubmit(submitMatricula)}>
        <Card maxW="lg" mx="auto">
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
      <ClientInfoCard socioData={socioData} isOpen={isOpen} />
    </>
  );
};
