import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Center,
  Collapse,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { FaExchangeAlt, FaQrcode } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useRef, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { MdCopyAll } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { parseCookies } from 'nookies';

const USER_INGRESSOS = gql`
  query getUserIngressos {
    userAuthenticatedIngressos {
      id
      dataCompra
      lote {
        nome
        evento {
          nome
        }
      }
    }
  }
`;

const TRANSFER_INGRESSO = gql`
  mutation transferIngresso($ingressoId: ID!, $newOwnerMatricula: String!) {
    transferIngresso(
      ingressoId: $ingressoId
      newOwnerMatricula: $newOwnerMatricula
    ) {
      ok
    }
  }
`;

type Inputs = {
  newOwnerMatricula: string;
  confirmNewOwnerMatricula: string;
};

function MeusEventos() {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { register, handleSubmit } = useForm<Inputs>();
  const { hasCopied, onCopy } = useClipboard('https://bit.ly/3w1n0Fz');
  const [contextIngressoId, setContextIngressoId] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [transferIngresso] = useMutation(TRANSFER_INGRESSO, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const { data } = useQuery(USER_INGRESSOS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const { isOpen, onToggle } = useDisclosure();
  const transferIngressoDisclosure = useDisclosure();

  const handleQrCode = useCallback(
    (id: string, title: string) => {
      setUrl(`http://${window?.location.host}/areadiretor/ingresso/${id}`);
      setTitle(title);
      onToggle();
    },
    [onToggle],
  );

  const onTransferSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ newOwnerMatricula, confirmNewOwnerMatricula }) => {
      if (newOwnerMatricula === confirmNewOwnerMatricula) {
        await transferIngresso({
          variables: {
            ingressoId: contextIngressoId,
            newOwnerMatricula,
          },
        })
          .then((res) => {
            if (res.data?.transferIngresso?.ok) {
              transferIngressoDisclosure.onClose();
            }
          })
          .catch((error) => {
            alert(error.message);
          });
        transferIngressoDisclosure.onClose();
      } else {
        alert('As matrículas não coincidem');
        return;
      }
    },
    [contextIngressoId, transferIngresso, transferIngressoDisclosure],
  );
  return (
    <Layout
      title="Meus ingressos"
      desc="Confira aqui seus ingressos adquiridos para os próximos eventos."
    >
      <Box maxW="5xl" mx="auto">
        <PageHeading>Meus ingressos</PageHeading>
        <Card overflowX={'auto'}>
          {data?.userAuthenticatedIngressos?.length == 0 ? (
            <Flex align="center" justify="center" flexDirection="column" p={4}>
              <Text>
                <em>Você não possui ingressos para eventos futuros.</em>
              </Text>
            </Flex>
          ) : (
            <>
              <CustomButton
                onClick={onCopy}
                variant="ghost"
                leftIcon={!hasCopied ? <MdCopyAll size="25px" /> : <></>}
              >
                {hasCopied ? 'Copiado!' : 'Copiar link convidados'}
              </CustomButton>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Ação</Th>
                    <Th>Lote - Evento</Th>
                    <Th>Data de compra</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.userAuthenticatedIngressos?.map((ingresso: any) => (
                    <Tr key={ingresso.id}>
                      <Td>
                        <HStack>
                          <CustomIconButton
                            aria-label="transfer-ingresso"
                            icon={<FaExchangeAlt size="25px" />}
                            onClick={() => {
                              setContextIngressoId(ingresso.id);
                              transferIngressoDisclosure.onOpen();
                            }}
                            isDisabled
                          />
                          <CustomIconButton
                            aria-label="qr-code"
                            icon={<FaQrcode size="25px" />}
                            onClick={() =>
                              handleQrCode(
                                ingresso.id,
                                ingresso.lote.evento.nome,
                              )
                            }
                          />
                        </HStack>
                      </Td>
                      <Td>
                        <Text
                          onClick={() =>
                            handleQrCode(ingresso.id, ingresso.lote.evento.nome)
                          }
                          cursor="pointer"
                          color={green}
                          _hover={{
                            fontWeight: 'bold',
                          }}
                        >
                          {ingresso.lote.nome} - {ingresso.lote.evento.nome}
                        </Text>
                      </Td>
                      <Td>
                        <Text as="time" dateTime={ingresso?.dataCompra}>
                          {new Date(ingresso?.dataCompra).toLocaleString(
                            'pt-BR',
                            {
                              dateStyle: 'short',
                              timeStyle: 'short',
                              timeZone: 'America/Sao_Paulo',
                            },
                          )}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
        </Card>
        <Collapse in={isOpen} animateOpacity>
          <Card py="8" px={{ base: '4', md: '10' }} mx="auto" maxW="sm" mt={4}>
            <Heading size="md" textAlign={'center'}>
              {title}
            </Heading>
            <Center mt={4}>
              <QRCode value={url} size={256} fgColor="green" />
            </Center>
          </Card>
        </Collapse>
        <Stack mt={4} align="center">
          <VoltarButton href="/eventos" />
        </Stack>
      </Box>
      <AlertDialog
        isOpen={transferIngressoDisclosure.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={transferIngressoDisclosure.onClose}
      >
        <AlertDialogOverlay>
          <form onSubmit={handleSubmit(onTransferSubmit)}>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Transferir ingresso
              </AlertDialogHeader>

              <AlertDialogBody>
                <Stack>
                  <FormControl>
                    <Input
                      placeholder="Matrícula de destino"
                      focusBorderColor={green}
                      required
                      {...register('newOwnerMatricula')}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Confirme a matrícula de destino"
                      focusBorderColor={green}
                      required
                      {...register('confirmNewOwnerMatricula')}
                    />
                  </FormControl>
                </Stack>
                <Text mt={4} textAlign="center">
                  <em>
                    Tem certeza que deseja transferir o ingresso por{' '}
                    <strong>C$ 90</strong>? Esta ação <strong>não</strong>{' '}
                    poderá ser desfeita.
                  </em>
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <CustomButton
                  onClick={transferIngressoDisclosure.onClose}
                  colorScheme="gray"
                >
                  Cancelar
                </CustomButton>
                <CustomButton variant={'solid'} ml={3} type="submit">
                  Transferir
                </CustomButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </AlertDialogOverlay>
      </AlertDialog>
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
    props: {},
  };
};

export default MeusEventos;
