import { CustomButton, PageHeading } from '@/components/atoms';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { MdCheck } from 'react-icons/md';

const GET_SOCIO = gql`
  query {
    socioAutenticado {
      id
      verifiedEmail
    }
  }
`;

const EMAIL_VALIDATION = gql`
  mutation emailValidation($email: String!) {
    verifyEmail(email: $email) {
      ok
    }
  }
`;

type Inputs = {
  email: string;
  confirmEmail: string;
};

export const EmailConfirmation = ({ ...rest }: IEmailConfirmation) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Inputs>();
  const { data } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });
  const [validateEmail] = useMutation(EMAIL_VALIDATION, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    ({ email, confirmEmail }) => {
      if (email !== confirmEmail) {
        setError('confirmEmail', {
          message: 'Emails não conferem',
          type: 'value',
        });
        return;
      }

      validateEmail({
        variables: {
          email: email,
        },
      }).then(() => {
        onClose();
        toast({
          description: 'Email confirmado com sucesso!',
          position: 'top-left',
          status: 'success',
          duration: 2500,
          isClosable: true,
        });
      });
    },
    [onClose, setError, toast, validateEmail],
  );

  useEffect(() => {
    if (data?.socioAutenticado && !data.socioAutenticado.verifiedEmail) {
      onOpen();
    } else {
      onClose();
    }
  }, [data, isAuthenticated, onClose, onOpen]);

  return (
    <Drawer size={'full'} isOpen={isOpen} onClose={onClose} {...rest}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <PageHeading mt={10}>Por favor, confirme seu email!</PageHeading>
        </DrawerHeader>
        <DrawerBody>
          <Card maxW={'2xl'} mx="auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <FormControl>
                  <FormLabel>Email: </FormLabel>
                  <Input
                    type={'email'}
                    isRequired
                    focusBorderColor={green}
                    autoFocus
                    autoComplete="off"
                    {...register('email')}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Confirme seu email: </FormLabel>
                  <Input
                    type={'email'}
                    isRequired
                    focusBorderColor={green}
                    autoComplete="off"
                    {...register('confirmEmail')}
                  />
                </FormControl>
                {errors.confirmEmail && (
                  <Text textAlign={'center'} textColor="gray.500">
                    <em>{errors.confirmEmail.message}</em>
                  </Text>
                )}
                <CustomButton type="submit" leftIcon={<MdCheck size="25px" />}>
                  Confirmar email
                </CustomButton>
              </Stack>
            </form>
          </Card>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
