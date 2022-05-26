import { CadastroInputsType, ICadastroDrawer } from './ICadastroDrawer';
import { Controller, useForm } from 'react-hook-form';
import { CustomButton, PageHeading } from '@/components/atoms';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import InputMask from 'react-input-mask';
import { Layout } from '@/components/templates';
import { useRouter } from 'next/router';

const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $username: String!
    $password: String!
    $name: String!
    $nickname: String!
    $birthDate: String!
    $phone: String!
    $rg: String!
    $cpf: String!
    $avatar: Upload!
    $group: String!
    $email: String!
  ) {
    createAccount(
      username: $username
      password: $password
      name: $name
      nickname: $nickname
      birthDate: $birthDate
      phone: $phone
      rg: $rg
      cpf: $cpf
      avatar: $avatar
      group: $group
      email: $email
    ) {
      ok
    }
  }
`;

export const CadastroDrawer = ({
  isOpen,
  onClose,
  ...rest
}: ICadastroDrawer) => {
  const router = useRouter();
  const { cadastro }: { cadastro?: string } = router.query;
  const { control, register, handleSubmit, setValue } =
    useForm<CadastroInputsType>({
      defaultValues: {
        matricula: cadastro,
      },
    });
  const [matricula, setMatricula] = React.useState('');
  const toast = useToast();

  const { signIn } = useContext(AuthContext);

  const [mutateFunction, { error }] = useMutation(CREATE_ACCOUNT);

  useEffect(() => {
    setValue('matricula', matricula);
    setMatricula(cadastro || '');
  }, [cadastro, isOpen, matricula, setValue]);

  const signUp = useCallback(
    async (data: CadastroInputsType) => {
      if (data.pin !== data.confirmPin) {
        toast({
          description: 'Os PINs inseridos são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }
      if (data.email !== data.confirmEmail) {
        toast({
          description: 'Os Emails inseridos são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }

      if (data.matricula !== data.confirmMatricula) {
        toast({
          description: 'As matrículas inseridas são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }

      mutateFunction({
        variables: {
          username: data.matricula,
          password: data.pin,
          name: data.nome,
          nickname: data.apelido,
          birthDate: data.dataNascimento,
          phone: data.whatsapp,
          rg: data.rg,
          cpf: data.cpf,
          avatar: data.avatar[0],
          group: data.turma,
          email: data.email,
        },
      }).then(({ data: { ok } }) => {
        if (ok) {
          signIn({ matricula: data.matricula, pin: data.pin });
        }
      });
    },
    [mutateFunction, signIn, toast],
  );

  const handleClose = useCallback(() => {
    onClose();
    router.replace('/entrar');
  }, [onClose, router]);

  return (
    <Drawer
      size="sm"
      placement="top"
      onClose={handleClose}
      isOpen={isOpen}
      {...rest}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p={0} mb={14}>
          <Layout
            title="Cadastro"
            desc="Crie sua conta na plataforma!"
            isHeaded={false}
            isFooted={false}
          >
            <PageHeading>Crie sua conta</PageHeading>
            <Card>
              <form id="signUp" onSubmit={handleSubmit(signUp)}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Matrícula: </FormLabel>
                    <Controller
                      name="matricula"
                      control={control}
                      rules={{
                        required: 'Matrícula obrigatória',
                        minLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                        maxLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            placeholder=""
                            isDisabled
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
                  <FormControl>
                    <FormLabel>Confirme sua matrícula: </FormLabel>
                    <Controller
                      name="confirmMatricula"
                      control={control}
                      rules={{
                        required: 'Matrícula obrigatória',
                        minLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                        maxLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            placeholder=""
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
                    <FormLabel>Confirmar email: </FormLabel>
                    <Input
                      type="email"
                      focusBorderColor="green.500"
                      required
                      {...register('confirmEmail')}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Turma: </FormLabel>
                    <Input
                      as={InputMask}
                      mask="MED: 99"
                      type="tel"
                      focusBorderColor="green.500"
                      {...register('turma')}
                      required
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
                    <FormLabel>Foto: </FormLabel>
                    <Input
                      pt={1}
                      type="file"
                      focusBorderColor="green.500"
                      {...register('avatar')}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>PIN: </FormLabel>
                    <Controller
                      name="pin"
                      control={control}
                      rules={{
                        required: 'PIN obrigatório',
                        minLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                        maxLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            mask
                            {...field}
                          >
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

                    <FormHelperText>
                      Escolha um PIN de 6 números.
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirmar PIN: </FormLabel>
                    <Controller
                      name="confirmPin"
                      control={control}
                      rules={{
                        required: 'PIN obrigatório',
                        minLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                        maxLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            mask
                            {...field}
                          >
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

                  <Text textAlign="center" fontSize="sm" color="red.500">
                    {error && error.message}
                  </Text>
                </Stack>
                <Stack mt={8}>
                  <CustomButton type="submit">Cadastrar</CustomButton>
                  <CustomButton colorScheme="gray" onClick={handleClose}>
                    Fechar
                  </CustomButton>
                </Stack>
              </form>
            </Card>
          </Layout>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
