import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { MdClose, MdOutlineCircle, MdReply, MdSend } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useRef } from 'react';

import { AiFillSetting } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomButton } from '@/components/atoms/CustomButton';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_ISSUE = gql`
  query getIssue($id: ID!) {
    issue(id: $id) {
      id
      status
      priority
      title
      description
      author {
        apelido
        matricula
      }
      createdAt
      updatedAt
      comments {
        edges {
          node {
            id
            author {
              apelido
            }
            description
            createdAt
          }
        }
      }
    }
  }
`;

const CLOSE_ISSUE = gql`
  mutation closeIssue($id: ID!) {
    closeIssue(id: $id) {
      ok
    }
  }
`;
const OPEN_ISSUE = gql`
  mutation openIssue($id: ID!) {
    openIssue(id: $id) {
      ok
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($issueId: ID!, $description: String!) {
    createComment(issueId: $issueId, description: $description) {
      ok
    }
  }
`;

interface QueryData {
  issue: {
    id: string;
    status: string;
    priority: string;
    title: string;
    description: string;
    author: {
      apelido: string;
      matricula: string;
    };
    createdAt: string;
    updatedAt: string;
    comments: {
      edges: {
        node: {
          id: string;
          author: {
            apelido: string;
          };
          description: string;
          createdAt: string;
        };
      }[];
    };
  };
}

type Inputs = {
  description: string;
};

function Solicitacao() {
  const router = useRouter();
  const toast = useToast();
  const { green, bg } = useContext(ColorContext);

  const cancelRef = useRef<HTMLButtonElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const commentDisclosure = useDisclosure();
  const { isAuthenticated, checkCredentials, token, isStaff } =
    useContext(AuthContext);
  const { id = '0' } = router.query;

  const { data, refetch, loading } = useQuery<QueryData>(GET_ISSUE, {
    variables: { id },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  useEffect(() => {
    refetch();
    checkCredentials();
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [checkCredentials, isAuthenticated, refetch, router]);

  const [closeIssue] = useMutation(CLOSE_ISSUE, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const [openIssue] = useMutation(OPEN_ISSUE, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const handleOpenIssue = useCallback(
    async (id: string) => {
      await openIssue({
        variables: {
          id,
        },
      })
        .then(() => {
          toast({
            title: 'Solicitação aberta com sucesso!',
            description: '',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetch();
        })
        .catch((error) => alert(error.message));
      onClose();
    },
    [onClose, openIssue, refetch, toast],
  );

  const handleCloseIssue = useCallback(
    async (id: string) => {
      await closeIssue({
        variables: {
          id,
        },
      })
        .then(() => {
          toast({
            title: 'Solicitação fechada com sucesso!',
            description: '',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetch();
        })
        .catch((error) => alert(error.message));
      onClose();
    },
    [closeIssue, onClose, refetch, toast],
  );

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ description }) => {
      await createComment({
        variables: {
          issueId: id,
          description,
        },
      })
        .then(() => {
          refetch();
          reset();
        })
        .catch((error) => alert(error.message));
    },
    [createComment, id, refetch, reset],
  );

  return (
    <Layout title="Solicitação">
      <Stack maxW="7xl" mx="auto" spacing={4}>
        <Box>
          <PageHeading>Solicitação</PageHeading>
          <Card>
            <HStack justify={'space-between'} mb={2}>
              <Skeleton isLoaded={!loading}>
                <Text>
                  Status:{' '}
                  <Badge
                    fontSize={'md'}
                    colorScheme={
                      data?.issue.status === 'Open'
                        ? 'green'
                        : data?.issue.status === 'In Progress'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {data?.issue.status}
                  </Badge>
                </Text>
                <Text>
                  Prioridade:{' '}
                  <Badge
                    fontSize={'md'}
                    colorScheme={
                      data?.issue.priority === 'LOW'
                        ? 'blue'
                        : data?.issue.priority === 'MEDIUM'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {data?.issue.priority}
                  </Badge>
                </Text>
              </Skeleton>
              <HStack>
                <Box>
                  <CustomIconButton
                    aria-label="open-issue"
                    icon={<MdOutlineCircle size="15px" />}
                    isDisabled={!isStaff}
                    onClick={() => handleOpenIssue(data?.issue.id as string)}
                  />
                </Box>
                <Box>
                  <CustomIconButton
                    aria-label="close-issue"
                    colorScheme="red"
                    icon={<MdClose size="20px" />}
                    onClick={onOpen}
                  />
                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Fechar solicitação
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Tem certeza que deseja fechar a solicitação?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <CustomButtom onClick={onClose} colorScheme="gray">
                            Cancelar
                          </CustomButtom>
                          <CustomButtom
                            colorScheme="red"
                            onClick={() =>
                              handleCloseIssue(data?.issue.id as string)
                            }
                            ml={3}
                          >
                            Fechar solicitação
                          </CustomButtom>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              </HStack>
            </HStack>
            <Skeleton isLoaded={!loading}>
              <Box mb={2}>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                  {data?.issue.title}
                </Text>
                <Divider />
              </Box>
            </Skeleton>
            <Skeleton isLoaded={!loading}>
              <Textarea
                value={data?.issue.description}
                isReadOnly
                focusBorderColor={green}
                minH="3xs"
              />
            </Skeleton>
            <Box>
              <Text textAlign={'right'} fontSize="sm">
                <CustomChakraNextLink
                  href={`https://diretoria.aaafuria.site/admin/core/socio/?q=${data?.issue.author.matricula}`}
                  chakraLinkProps={{
                    color: green,
                    fontWeight: 'bold',
                    _hover: {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {data?.issue.author.apelido}
                </CustomChakraNextLink>
              </Text>
              <Text textAlign={'right'} fontSize="sm">
                {new Date(data?.issue.createdAt as string).toLocaleString(
                  'pt-BR',
                  {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                  },
                )}
              </Text>
            </Box>
          </Card>
        </Box>
        {data?.issue.comments.edges && data.issue.comments.edges.length > 0 && (
          <Box>
            <PageHeading as="h2" size={'md'}>
              Comentários
            </PageHeading>
            <Stack>
              {data?.issue.comments.edges.map((comment) => (
                <Card key={comment.node.id}>
                  <Textarea
                    value={comment.node.description}
                    isReadOnly
                    focusBorderColor={green}
                  />
                  <Box mt={4}>
                    <Text textAlign={'right'} fontSize="sm">
                      <CustomChakraNextLink
                        href={
                          'https://diretoria.aaafuria.site/admin/core/socio/?q=18107053'
                        }
                        chakraLinkProps={{
                          color: green,
                          fontWeight: 'bold',
                          _hover: {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {comment.node.author.apelido}
                      </CustomChakraNextLink>
                    </Text>
                    <Text textAlign={'right'} fontSize="sm">
                      {new Date(
                        comment.node.createdAt as string,
                      ).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
        <Stack>
          <CustomButtom
            aria-label="comment"
            leftIcon={<MdReply size="25px" />}
            onClick={commentDisclosure.onOpen}
          >
            Responder
          </CustomButtom>
          {isStaff && (
            <CustomChakraNextLink href={'/ajuda/gerenciar-solicitacoes'}>
              <CustomButton
                leftIcon={<AiFillSetting size="20px" />}
                colorScheme={'yellow'}
              >
                Gerenciar solicitações
              </CustomButton>
            </CustomChakraNextLink>
          )}
          <VoltarButton href={'/ajuda/minhas-solicitacoes'} />
        </Stack>
      </Stack>
      <Drawer
        isOpen={commentDisclosure.isOpen}
        placement="bottom"
        size="md"
        onClose={commentDisclosure.onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton />
            <DrawerHeader>Adicionar comentário</DrawerHeader>
            <DrawerBody>
              <Textarea
                placeholder="Digite aqui um comentário..."
                focusBorderColor={green}
                {...register('description')}
              />
            </DrawerBody>

            <DrawerFooter>
              <CustomButtom
                mr={3}
                colorScheme="gray"
                onClick={commentDisclosure.onClose}
              >
                Cancelar
              </CustomButtom>
              <CustomButtom
                leftIcon={<MdSend size="20px" />}
                variant={'solid'}
                type="submit"
              >
                Enviar
              </CustomButtom>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
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

export default Solicitacao;
