import { Card } from '@/components/Card';
import { gql, useMutation } from '@apollo/client';
import InputMask from 'react-input-mask';

import {
  Stack,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Button,
  Box,
  Text,
  useColorModeValue,
  Heading,
  FormHelperText,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '@/contexts/AuthContext';

type Inputs = {
  matricula: string;
  pin: string;
  pin_confirmar: string;
  email: string;
  nome: string;
  whatsapp: string;
  apelido: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
};

const NOVO_USER = gql`
  mutation novoUser(
    $nome: String!
    $apelido: String!
    $matricula: String!
    $pin: String!
    $email: String!
    $rg: String!
    $cpf: String!
    $dataNascimento: String!
    $whatsapp: String!
  ) {
    novoUser(
      nome: $nome
      apelido: $apelido
      matricula: $matricula
      pin: $pin
      email: $email
      rg: $rg
      cpf: $cpf
      dataNascimento: $dataNascimento
      whatsapp: $whatsapp
    ) {
      socio {
        nome
        isSocio
      }
    }
  }
`;

export default function Cadastro() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<Inputs>();
  const [matricula, setMatricula] = React.useState('');

  const { signIn } = useContext(AuthContext);

  const [mutateFunction, { error }] = useMutation(NOVO_USER);

  useEffect(() => {
    setValue('matricula', matricula);
    setMatricula(localStorage.getItem('aaafuria@signUpMatricula') || '');
  }, [matricula, setValue]);

  const signUp = async (data: Inputs) => {
    if (data.pin !== data.pin_confirmar) {
      alert('PINs não conferem');
      return;
    }

    mutateFunction({
      variables: {
        matricula: data.matricula,
        email: data.email,
        nome: data.nome,
        apelido: data.apelido,
        dataNascimento: data.dataNascimento,
        whatsapp: data.whatsapp,
        rg: data.rg,
        cpf: data.cpf,
        pin: data.pin,
      },
    }).then((res) => {
      if (res.data) {
        signIn({ matricula: data.matricula, pin: data.pin });
      }
    });
  };

  return (
    <Box
      bg={useColorModeValue('gray.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
    >
      <Box maxW="2xl" mx="auto">
        <Heading textAlign="center" size="xl" fontWeight="extrabold" mb={4}>
          Crie sua conta na plataforma
        </Heading>
        <Card>
          <form id="signUp" onSubmit={handleSubmit(signUp)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Matrícula: </FormLabel>
                <HStack>
                  <Input type="hidden" {...register('matricula')} required />
                  <PinInput
                    size="lg"
                    focusBorderColor="green.500"
                    value={matricula}
                    placeholder=""
                    autoFocus
                    isDisabled
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
              <FormControl>
                <FormLabel>Email: </FormLabel>
                <Input
                  type="email"
                  focusBorderColor="green.500"
                  required
                  {...register('email')}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nome completo: </FormLabel>
                <Input
                  focusBorderColor="green.500"
                  {...register('nome')}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Apelido: </FormLabel>
                <Input
                  focusBorderColor="green.500"
                  {...register('apelido')}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Data de nascimento: </FormLabel>
                <Input
                  type="date"
                  focusBorderColor="green.500"
                  {...register('dataNascimento')}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Whatsapp: </FormLabel>
                <Input
                  as={InputMask}
                  mask="(99) 99999-9999"
                  type="tel"
                  focusBorderColor="green.500"
                  {...register('whatsapp')}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>CPF: </FormLabel>
                <Input
                  as={InputMask}
                  mask="999.999.999-99"
                  focusBorderColor="green.500"
                  {...register('cpf')}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>RG: </FormLabel>
                <Input
                  focusBorderColor="green.500"
                  {...register('rg')}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>PIN: </FormLabel>
                <HStack>
                  <Input type="hidden" {...register('pin')} required />
                  <PinInput
                    size="lg"
                    focusBorderColor="green.500"
                    mask
                    onChange={(value) => setValue('pin', value)}
                    onComplete={(value) => setValue('pin', value)}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
                <FormHelperText>Escolha um PIN de 6 números.</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Confirmar PIN: </FormLabel>
                <HStack>
                  <Input
                    type="hidden"
                    {...register('pin_confirmar')}
                    required
                  />
                  <PinInput
                    size="lg"
                    focusBorderColor="green.500"
                    mask
                    onChange={(value) => setValue('pin_confirmar', value)}
                    onComplete={(value) => setValue('pin_confirmar', value)}
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
              <Text textAlign="center" fontSize="sm" color="red.500">
                {error && error.message}
              </Text>
            </Stack>
            <Stack mt={8}>
              <Button type="submit" colorScheme="green">
                Cadastrar
              </Button>
              <Button colorScheme="gray" onClick={() => router.back()}>
                Voltar
              </Button>
              <Button colorScheme="gray" onClick={() => router.push('/')}>
                Início
              </Button>
            </Stack>
          </form>
        </Card>
      </Box>
    </Box>
  );
}
