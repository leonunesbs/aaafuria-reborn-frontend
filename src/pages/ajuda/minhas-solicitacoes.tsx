import {
  Badge,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { MdAdd, MdHelpCenter, MdSend } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useRef } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { FaEye } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { IIssueType } from './IIssueType';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import router from 'next/router';

type Inputs = {
  title: string;
  description: string;
  priority: string;
  category: string;
};

const GET_ISSUES = gql`
  query {
    socioIssues {
      edges {
        node {
          id
          title
          description
          status
          getStatusDisplay
          priority
          getPriorityDisplay
          updatedAt
          createdAt
        }
      }
    }
  }
`;

const CREATE_ISSUE = gql`
  mutation createIssue(
    $title: String!
    $description: String!
    $priority: String!
    $category: String!
  ) {
    createIssue(
      title: $title
      description: $description
      priority: $priority
      category: $category
    ) {
      ok
    }
  }
`;

interface QueryData {
  socioIssues: {
    edges: {
      node: IIssueType;
    }[];
  };
}

function Solicitacoes() {
  const toast = useToast();
  const btnRef = useRef<HTMLButtonElement>(null);
  const createIssueDisclosure = useDisclosure();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { green, bg } = useContext(ColorContext);
  const { token, user, isAuthenticated } = useContext(AuthContext);

  const { data, refetch } = useQuery<QueryData>(GET_ISSUES, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  const [createIssue, { loading }] = useMutation(CREATE_ISSUE, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  useEffect(() => {
    refetch();
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [isAuthenticated, refetch]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ title, description, priority, category }: Inputs) => {
      await createIssue({
        variables: {
          title,
          description,
          priority,
          category,
        },
      })
        .then(() => {
          toast({
            title: 'Solicitação criada com sucesso!',
            description: 'Um membro da equipe irá responder em breve.',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          reset();
          refetch();
        })
        .catch((error) => alert(error.message));
    },
    [createIssue, refetch, reset, toast],
  );

  return (
    <Layout title="Minhas solicitações">
      <Stack maxW="7xl" mx="auto" spacing={4}>
        <PageHeading>Minhas solicitações</PageHeading>
        <Skeleton isLoaded={!loading}>
          <Card overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Título</Th>
                  <Th>Atualizado em</Th>
                  <Th>Iniciado em</Th>
                  <Th>Status</Th>
                  <Th>Prioridade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.socioIssues && data.socioIssues.edges.length < 1 && (
                  <Tr>
                    <Td colSpan={6}>
                      <Text textAlign={'center'}>
                        <em>Você ainda não possui nenhuma solicitação.</em>
                      </Text>
                    </Td>
                  </Tr>
                )}
                {data?.socioIssues?.edges.map((issue) => (
                  <Tr key={issue.node.id}>
                    <Td>
                      <HStack>
                        <CustomChakraNextLink
                          href={`/ajuda/solicitacao/${issue.node.id}`}
                        >
                          <CustomIconButton
                            aria-label="view"
                            icon={<FaEye size="15px" />}
                          />
                        </CustomChakraNextLink>
                      </HStack>
                    </Td>
                    <Td>{issue.node.title}</Td>
                    <Td>
                      <Text as="time" dateTime={issue.node.updatedAt}>
                        {new Date(issue.node.updatedAt).toLocaleString(
                          'pt-BR',
                          {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'America/Sao_Paulo',
                          },
                        )}
                      </Text>
                    </Td>
                    <Td>
                      <Text as="time" dateTime={issue.node.createdAt}>
                        {new Date(issue.node.createdAt).toLocaleString(
                          'pt-BR',
                          {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'America/Sao_Paulo',
                          },
                        )}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          issue.node.status === 'OPEN'
                            ? 'green'
                            : issue.node.status === 'IN_PROGRESS'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {issue.node.getStatusDisplay}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          issue.node.priority === 'LOW'
                            ? 'blue'
                            : issue.node.priority === 'MEDIUM'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {issue.node.getPriorityDisplay}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </Skeleton>
        <Stack>
          <CustomButton
            leftIcon={<MdAdd size="20px" />}
            onClick={createIssueDisclosure.onOpen}
          >
            Nova solicitação
          </CustomButton>
          {user?.isStaff && (
            <CustomChakraNextLink href={'/ajuda/gerenciar-solicitacoes'}>
              <CustomButton
                leftIcon={<MdHelpCenter size="25px" />}
                colorScheme={'yellow'}
              >
                Gerenciar solicitações
              </CustomButton>
            </CustomChakraNextLink>
          )}
          <VoltarButton href="/" />
        </Stack>
      </Stack>
      <Drawer
        isOpen={createIssueDisclosure.isOpen}
        placement="right"
        size={'md'}
        onClose={createIssueDisclosure.onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton />
            <DrawerHeader>Nova solicitação</DrawerHeader>
            <DrawerBody>
              <Stack>
                <FormControl>
                  <FormLabel>Título: </FormLabel>
                  <Input
                    focusBorderColor={green}
                    required
                    {...register('title')}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição: </FormLabel>
                  <Textarea
                    focusBorderColor={green}
                    required
                    {...register('description')}
                  />
                </FormControl>
                <HStack>
                  <FormControl>
                    <FormLabel>Categoria: </FormLabel>
                    <Select
                      focusBorderColor={green}
                      required
                      placeholder="Selecione..."
                      {...register('category')}
                    >
                      <option value="ASSOCIACAO">Associação</option>
                      <option value="ESPORTES">Esportes</option>
                      <option value="BATERIA">Bateria</option>
                      <option value="EVENTOS">Eventos</option>
                      <option value="LOJA">Loja</option>
                      <option value="OUTRA">Outra</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Prioridade: </FormLabel>
                    <Select
                      focusBorderColor={green}
                      required
                      placeholder="Selecione..."
                      {...register('priority')}
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                    </Select>
                  </FormControl>
                </HStack>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <CustomButton
                colorScheme={'gray'}
                mr={3}
                onClick={createIssueDisclosure.onClose}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                variant={'solid'}
                type="submit"
                leftIcon={<MdSend size="20px" />}
              >
                Enviar solicitação
              </CustomButton>
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

export default Solicitacoes;
