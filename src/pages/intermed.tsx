import {
  Box,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
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

const CREATE_INTERMED_PROFILE = gql`
  mutation createIntermedProfile(
    $avatar: Upload!
    $enroll: Upload!
    $vaccineCard: Upload!
  ) {
    createIntermedProfile(
      avatar: $avatar
      enroll: $enroll
      vaccineCard: $vaccineCard
    ) {
      ok
    }
  }
`;
const CREATE_PAYMENT = gql`
  mutation createPayment(
    $amount: Float!
    $methodId: ID!
    $description: String!
    $atttachmentTitle: String
    $attachment: Upload
  ) {
    createPayment(
      amount: $amount
      methodId: $methodId
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

type Step1InputData = {
  avatar: string;
  vaccineCard: string;
  enroll: string;
};

type Step2InputData = {
  attachments: string;
};

function Intermed() {
  const { green } = useContext(ColorContext);
  const toast = useToast();
  const price = useMemo(() => {
    return {
      atletaOuRitmista: 190,
      socio: 210,
      naoSocio: 260,
    };
  }, []);
  const router = useRouter();

  const [value] = useState('pix@aaafuria.site');
  const { hasCopied, onCopy } = useClipboard(value);
  const { isAuthenticated, user, token } = useContext(AuthContext);

  const [createIntermedProfile, { loading: createIntermedProfileLoading }] =
    useMutation(CREATE_INTERMED_PROFILE, {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    });
  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const step1Form = useForm<Step1InputData>();
  const step2Form = useForm<Step2InputData>();

  const onSubmit: SubmitHandler<Step2InputData> = useCallback(
    async (data) => {
      const { attachments } = data;

      const amount = user?.member.firstTeamer
        ? price.atletaOuRitmista
        : user?.member.hasActiveMembership &&
          user.member.activeMembership?.membershipPlan.title !== 'MENSAL'
        ? price.socio
        : price.naoSocio;

      await createPayment({
        variables: {
          amount,
          methodId: 'UGF5bWVudE1ldGhvZE5vZGU6MQ==',
          description: 'Pagamento VI Intermed Nordeste',
          atttachmentTitle: 'comprovante',
          attachment: attachments[0],
        },
      }).then(({ data: { createPayment } }) => {
        if (createPayment.paymentCreated) {
          toast({
            title: 'Dados enviados com sucesso',
            description: 'Aguarde a confirmação do pagamento.',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        } else {
          toast({
            title: 'Dados já recebidos',
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

  const handleCreateIntermedProfile: SubmitHandler<Step1InputData> =
    useCallback(
      async ({ avatar, enroll, vaccineCard }) => {
        await createIntermedProfile({
          variables: {
            avatar: avatar[0],
            enroll: enroll[0],
            vaccineCard: vaccineCard[0],
          },
        })
          .then(({ data: { createIntermedProfile } }) => {
            if (createIntermedProfile.ok) {
              toast({
                title: 'Dados salvos com sucesso',
                description:
                  'Seus dados foram enviados à organizadora, efetue o pagamento para confirmar sua inscrição',
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-left',
              });
            }
          })
          .catch((err) => {
            toast({
              title: 'Erro ao salvar dados',
              description: err.message,
              status: 'error',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          });
      },
      [createIntermedProfile, toast],
    );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [isAuthenticated, router]);

  return (
    <Layout
      title="VI INTERMED NE"
      desc="O VI INTERMED NORDESTE está chegando e você não pode perder a chance de curtir a Terra da Luz junto com a Fúria. Em outubro, vamos invadir Fortaleza!"
    >
      <PageHeading>VI Intermed Nordeste</PageHeading>
      <SimpleGrid columns={1} spacing={2}>
        <Card>
          <Stack>
            <Heading size="md" as="h2" my={4}>
              COMPLETE A SUA INSCRIÇÃO
            </Heading>
            <form
              onSubmit={step1Form.handleSubmit(handleCreateIntermedProfile)}
            >
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Foto de rosto: </FormLabel>
                  <Input
                    {...step1Form.register('avatar')}
                    pt={1}
                    type="file"
                    isRequired
                    rounded="3xl"
                    focusBorderColor={green}
                  />
                  <FormHelperText>
                    Foto de frente, sem boné ou óculos escuro e em ambiente bem
                    iluminado
                  </FormHelperText>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Comprovante de vacinação: </FormLabel>
                  <Input
                    {...step1Form.register('vaccineCard')}
                    pt={1}
                    type="file"
                    isRequired
                    rounded="3xl"
                    focusBorderColor={green}
                  />
                  <FormHelperText>
                    Mínimo de 03 doses, de acordo com as regras sanitárias
                    locais.
                  </FormHelperText>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Comprovante de matrícula: </FormLabel>
                  <Input
                    {...step1Form.register('enroll')}
                    pt={1}
                    type="file"
                    isRequired
                    rounded="3xl"
                    focusBorderColor={green}
                  />
                </FormControl>
                <Card>
                  <Text>OBSERVAÇÕES IMPORTANTES:</Text>
                  <UnorderedList>
                    <ListItem>
                      EM CASO DE ADIAMENTO DO EVENTO, POR CAUSA DA PANDEMIA, A
                      INSCRIÇÃO SERÁ ADIADA PARA O PRÓXIMO EVENTO DE ORGANIZAÇÃO
                      DA LINE.
                    </ListItem>
                    <ListItem>
                      PARA COMPARECER AO O EVENTO, O PARTICIPANTE DEVE TER
                      COMPROVANTE COM 3 DOSES DE VACINA PARA COVID-19. ALÉM
                      DISSO, NÃO PODE APRESENTAR SINTOMAS, COMO FEBRE E TOSSE
                      NAS ULTIMAS 24H.
                    </ListItem>
                    <ListItem>
                      A ATLÉTICA ORGANIZADORA PREZA PELO BEM ESTAR DOS
                      PARTICIPANTES DO EVENTO, COM TOLERÂNCIA ZERO PARA
                      AGRESSÕES FÍSICAS, QUALQUER MANIFESTAÇÃO DE RACISMO,
                      HOMOFOBIA OU QUALQUER OUTRO TIPO DE PRECONCEITO, SENDO O
                      ATUANTE PUNIDO COM EXPULSÃO DO EVENTO E A ATLÉTICA PELÁ
                      QUAL O MESMO ESTAR INSCRITO PASSÍVEL DE PUNIÇÃO.
                    </ListItem>
                    <ListItem>
                      AO CONFIRMAR SUA INSCRIÇÃO VOCÊ ESTAR DE ACORDO COM OS
                      TERMOS ACIMA.
                    </ListItem>
                  </UnorderedList>
                </Card>
                <CustomButton
                  type="submit"
                  isLoading={createIntermedProfileLoading}
                >
                  Enviar
                </CustomButton>
              </Stack>
            </form>
          </Stack>
        </Card>

        <Card>
          <Heading size="md" as="h2" my={4} mb={10}>
            EFETUE O PAGAMENTO
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
            <form onSubmit={step2Form.handleSubmit(onSubmit)}>
              <Stack>
                <Box>
                  <HStack justify={'space-between'}>
                    <Text>Categoria: </Text>
                    <Text textAlign={'right'}>
                      {user?.member.firstTeamer ? (
                        'Atleta / Ritmista'
                      ) : user?.member.hasActiveMembership &&
                        user.member.activeMembership?.membershipPlan.title !==
                          'MENSAL' ? (
                        'Sócio'
                      ) : (
                        <Stack align={'flex-end'}>
                          <CustomButton
                            size="sm"
                            maxW="80px"
                            onClick={() => router.push('/sejasocio')}
                          >
                            Seja sócio
                          </CustomButton>
                          <Text>Não sócio / Sócio mensal</Text>
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
                        : user?.member.hasActiveMembership &&
                          user.member.activeMembership?.membershipPlan.title !==
                            'MENSAL'
                        ? price.socio
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
                          rounded="3xl"
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
                        pt={1}
                        type={'file'}
                        isRequired
                        rounded="3xl"
                        focusBorderColor={green}
                        {...step2Form.register('attachments')}
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
