import {
  Box,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { MdCheck, MdFileCopy, MdSend } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const CREATE_PAYMENT = gql`
  mutation createPayment(
    $amount: Float!
    $method: String!
    $description: String!
    $atttachmentTitle: String
    $attachment: Upload
  ) {
    createPayment(
      amount: $amount
      method: $method
      description: $description
      atttachmentTitle: $atttachmentTitle
      attachment: $attachment
    ) {
      payment {
        id
      }
      paymentCreated
    }
  }
`;

type InputData = {
  attachments: string;
};

function Intermed() {
  const toast = useToast();
  const price = useMemo(() => {
    return {
      atletaOuRitmista: 190,
      socioAnual: 210,
      naoSocio: 260,
    };
  }, []);
  const router = useRouter();
  const { green } = useContext(ColorContext);

  const [value] = useState('pix@aaafuria.site');
  const { hasCopied, onCopy } = useClipboard(value);
  const { isAuthenticated, user, token } = useContext(AuthContext);

  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const { handleSubmit, register } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = useCallback(
    async (data) => {
      const { attachments } = data;

      const amount = user?.member.firstTeamer
        ? price.atletaOuRitmista
        : user?.member.hasActiveMembership
        ? new Date(
            user.member.activeMembership?.currentEndDate as string,
          ).getMonth() == 11
          ? price.socioAnual
          : price.naoSocio
        : price.naoSocio;

      await createPayment({
        variables: {
          amount: amount,
          method: 'PX',
          description: 'Pagamento VI Intermed Nordeste',
          atttachmentTitle: 'comprovante',
          attachment: attachments[0],
        },
      }).then(({ data: { createPayment } }) => {
        if (createPayment.paymentCreated) {
          toast({
            title: 'Dados enviados com sucesso!',
            description: 'Aguarde a confirmação do pagamento.',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        } else {
          toast({
            title: 'Dados já recebidos!',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        }
        router.push(`/bank/payment/${createPayment.payment.id}`);
      });
    },
    [price, user, createPayment, toast, router],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [isAuthenticated, router]);

  return (
    <Layout title="Intermed">
      <Box maxW="4xl" mx="auto">
        <PageHeading>VI Intermed Nordeste</PageHeading>
        <SimpleGrid columns={1} spacing={2}>
          <Card>
            <Stack>
              <Heading size="md" as="h2">
                1. Cadastre-se do VI INTERMED NORDESTE e reserve seu LOTE
              </Heading>
              <CustomButton
                onClick={() =>
                  window.open('http://intermednordeste.com/login', '_blank')
                }
              >
                Cadastre-se no INTERMED
              </CustomButton>
            </Stack>
          </Card>

          <Card>
            <Heading size="md" as="h2" mb={10}>
              2. Efetue o pagamento
            </Heading>
            <Center mb={4}>
              <Box rounded="md" overflow={'hidden'}>
                <Image
                  src={'/lote-intermed.jpg'}
                  height="500px"
                  width="400px"
                  alt={'lote-intermed'}
                />
              </Box>
            </Center>
            <Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                  <Box>
                    <HStack justify={'space-between'}>
                      <Text>Categoria: </Text>
                      <Text textAlign={'right'}>
                        {user?.member.firstTeamer ? (
                          'Atleta / Ritmista'
                        ) : user?.member.hasActiveMembership ? (
                          new Date(
                            user.member.activeMembership
                              ?.currentEndDate as string,
                          ).getMonth() == 11 ? (
                            'Sócio 2022.2'
                          ) : (
                            <Stack align={'flex-end'}>
                              <CustomButton
                                size="sm"
                                maxW="80px"
                                onClick={() => router.push('/sejasocio')}
                              >
                                Seja sócio
                              </CustomButton>
                              <Text>
                                Não sócio / Sócio mensal / Sócio 2022.1
                              </Text>
                            </Stack>
                          )
                        ) : (
                          <Stack align={'flex-end'}>
                            <CustomButton
                              size="sm"
                              maxW="80px"
                              onClick={() => router.push('/sejasocio')}
                            >
                              Seja sócio
                            </CustomButton>
                            <Text>Não sócio / Sócio mensal / Sócio 2022.1</Text>
                          </Stack>
                        )}
                      </Text>
                    </HStack>
                    <HStack justify={'space-between'}>
                      <Text>Total: </Text>
                      <Text
                        fontWeight={'bold'}
                        fontSize="2xl"
                        textAlign={'right'}
                      >
                        R$
                        {user?.member.firstTeamer
                          ? price.atletaOuRitmista
                          : user?.member.hasActiveMembership
                          ? new Date(
                              user.member.activeMembership
                                ?.currentEndDate as string,
                            ).getMonth() == 11
                            ? price.socioAnual
                            : price.naoSocio
                          : price.naoSocio}
                      </Text>
                    </HStack>
                  </Box>
                  <Card px={4}>
                    <Stack>
                      <FormControl>
                        <FormLabel>
                          <Text>Chave PIX</Text>
                        </FormLabel>
                        <HStack>
                          <Input
                            value={value}
                            isReadOnly
                            focusBorderColor={green}
                          />
                          <CustomIconButton
                            onClick={onCopy}
                            ml={2}
                            icon={
                              hasCopied ? (
                                <MdCheck size="20px" />
                              ) : (
                                <MdFileCopy size="20px" />
                              )
                            }
                            aria-label="Copiar"
                          />
                        </HStack>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          <Text>Comprovante de pagamento</Text>
                        </FormLabel>
                        <Input
                          {...register('attachments')}
                          focusBorderColor={green}
                          pt={1}
                          type={'file'}
                          isRequired
                        />
                      </FormControl>
                      <CustomButton
                        leftIcon={<MdSend size="20px" />}
                        type="submit"
                        isLoading={loading}
                      >
                        Enviar inscrição
                      </CustomButton>
                    </Stack>
                  </Card>
                </Stack>
              </form>
            </Stack>
          </Card>
        </SimpleGrid>
      </Box>
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
    props: {
      token,
    },
  };
};

export default Intermed;
