import { Card } from '@/components/Card';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import { gql, useQuery } from '@apollo/client';
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
import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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

  const submitMatricula: SubmitHandler<Inputs> = useCallback(
    ({ matricula }) => {
      query.refetch({ matricula }).then(({ data }) => setSocioData(data));
    },
    [query],
  );

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
                    onChange={(value) => {
                      matriculaForm.setValue('matricula', value);
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
              <Button w="100%" colorScheme="green" type="submit">
                Confirmar
              </Button>
            </Stack>
          </Card>
        </form>
      </Box>
    </Layout>
  );
}

export default Plantao;
