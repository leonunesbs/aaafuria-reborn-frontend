import {
  Badge,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  CustomButton,
  CustomIconButton,
  PaymentMethods,
} from '@/components/atoms';
import { MdAdd, MdCheck } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const CREATE_PAYMENT = gql`
  mutation createPayment(
    $amount: Float!
    $methodId: ID!
    $description: String!
    $userUsername: String!
  ) {
    createPayment(
      amount: $amount
      methodId: $methodId
      description: $description
      userUsername: $userUsername
    ) {
      payment {
        id
      }
      paymentCreated
    }
  }
`;

const GET_MEMBER = gql`
  query ($registration: String) {
    memberByRegistration(registration: $registration) {
      id
      name
      group
    }
  }
`;

type MemberByRegistrationData = {
  memberByRegistration: {
    id: string;
    name: string;
    group: string;
  };
};

type Inputs = {
  registration: string;
  amount: number;
  methodId: string;
  description: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AddPaymentDrawerProps {}

function AddPaymentDrawer({}: AddPaymentDrawerProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bg, green } = useContext(ColorContext);
  const { token } = useContext(AuthContext);
  const [registrationChecked, setRegistrationChecked] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>();

  const { data: memberData, refetch: refetchMemberData } =
    useQuery<MemberByRegistrationData>(GET_MEMBER, {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    });
  const [createPayment] = useMutation(CREATE_PAYMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const handleCheckRegistration = useCallback(() => {
    const registration = getValues('registration');
    if (!registration) {
      setError('registration', {
        message: 'Campo obrigatório',
      });
      return;
    }
    refetchMemberData({
      registration,
    });
    setRegistrationChecked(true);
  }, [getValues, refetchMemberData, setError]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      await createPayment({
        variables: {
          userUsername: data.registration,
          amount: data.amount,
          methodId: data.methodId,
          description: data.description,
        },
      }).then(({ data }) => {
        if (data?.createPayment?.paymentCreated) {
          reset();
          onClose();
          setRegistrationChecked(false);
          toast({
            title: 'Sucesso',
            description:
              'Fatura gerada com sucesso. Aguardando confirmação de pagamento.',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        }
      });
    },
    [createPayment, onClose, reset, toast],
  );
  return (
    <>
      <CustomIconButton
        onClick={onOpen}
        aria-label="adicionar pagamento"
        icon={<MdAdd size="20px" />}
      />
      <Drawer isOpen={isOpen} placement="right" size="sm" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton color={green} />
            <DrawerHeader>Novo pagamento</DrawerHeader>
            <DrawerBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Matrícula: </FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...register('registration', {
                        onChange: () => clearErrors('registration'),
                      })}
                      autoFocus
                      pr="4.5rem"
                      required
                      focusBorderColor={green}
                      isDisabled={registrationChecked}
                      isInvalid={!!errors.registration}
                    />
                    <InputRightElement width="4.5rem">
                      {!registrationChecked ? (
                        <CustomButton
                          h="1.75rem"
                          variant={'ghost'}
                          onClick={handleCheckRegistration}
                        >
                          Checar
                        </CustomButton>
                      ) : (
                        <CustomIconButton
                          h="1.75rem"
                          size="sm"
                          icon={<MdCheck size="20px" />}
                          aria-label="checar"
                          isDisabled
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Collapse in={registrationChecked}>
                  <Card m={4} textAlign="center">
                    <Text>{memberData?.memberByRegistration?.name}</Text>
                    <Text>
                      <Badge ml={2}>
                        {memberData?.memberByRegistration?.group}
                      </Badge>
                    </Text>
                  </Card>
                </Collapse>
                <Stack>
                  <FormControl isRequired>
                    <FormLabel>Valor: </FormLabel>

                    <InputGroup>
                      <InputLeftAddon>
                        <Text fontSize="sm">R$</Text>
                      </InputLeftAddon>
                      <NumberInput
                        focusBorderColor={green}
                        precision={2}
                        w="full"
                      >
                        <NumberInputField {...register('amount')} required />
                      </NumberInput>
                    </InputGroup>
                    <FormHelperText>
                      Use . como separador de centavos.
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Descrição: </FormLabel>
                    <Input
                      {...register('description')}
                      type="text"
                      required
                      focusBorderColor={green}
                    />
                  </FormControl>
                  <Controller
                    name="methodId"
                    control={control}
                    rules={{ required: 'Método obrigatório' }}
                    render={({ field }) => <PaymentMethods {...field} />}
                  />
                </Stack>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <CustomButton
                colorScheme={'gray'}
                mr={3}
                onClick={() => {
                  onClose();
                  reset();
                  setRegistrationChecked(false);
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                leftIcon={<FaFileInvoiceDollar size="20px" />}
                type="submit"
              >
                Gerar fatura
              </CustomButton>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
}

export default AddPaymentDrawer;
