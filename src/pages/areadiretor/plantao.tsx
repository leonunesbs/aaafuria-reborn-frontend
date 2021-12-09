import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import React, { useCallback, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Card } from '@/components/Card';
import { gql, useQuery } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
} from '@chakra-ui/react';

const QUERY_SOCIO = gql`
  query socioByMatricula($matricula: String!) {
    socioByMatricula(matricula: $matricula) {
      nome
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
  const matriculaForm = useForm<Inputs>();

  const query = useQuery(QUERY_SOCIO, {
    variables: {
      matricula: '00000000',
    },
  });

  const [socioData, setSocioData] = useState(null);
  const [matriculaInput, setMatriculaInput] = useState('');

  const submitMatricula: SubmitHandler<Inputs> = useCallback(
    ({ matricula }) => {
      query.refetch({ matricula }).then(({ data }) => setSocioData(data));
    },
    [query],
  );

  const handleRestart = useCallback(() => {
    setMatriculaInput('');
    setSocioData(null);
    matriculaForm.reset();
  }, [setSocioData, setMatriculaInput, matriculaForm]);

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
              <Button
                w="100%"
                colorScheme="green"
                type="submit"
                variant="ghost"
                isDisabled={socioData != null}
                leftIcon={<AiFillCheckCircle size="25px" />}
              >
                Confirmar
              </Button>
              <Button w="100%" colorScheme="gray" onClick={handleRestart}>
                Recomeçar
              </Button>
            </Stack>
          </Card>
        </form>
      </Box>
    </Layout>
  );
}

export default Plantao;
