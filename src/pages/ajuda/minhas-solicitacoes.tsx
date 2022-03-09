import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Textarea,
  Th,
  Thead,
  Tr,
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
import { MdClose, MdSend } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useRef } from 'react';

import { AiFillSetting } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomButton } from '@/components/atoms/CustomButton';
import { FaEye } from 'react-icons/fa';
import { Layout } from '@/components/templates';

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
          updatedAt
          createdAt
          priority
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

const CLOSE_ISSUE = gql`
  mutation closeIssue($id: ID!) {
    closeIssue(id: $id) {
      ok
    }
  }
`;

interface QueryData {
  socioIssues: {
    edges: {
      node: {
        id: string;
        title: string;
        description: string;
        status: string;
        updatedAt: string;
        createdAt: string;
        priority: string;
      };
    }[];
  };
}

function Solicitacoes() {
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { green } = useContext(ColorContext);
  const { token, isStaff } = useContext(AuthContext);

  const { data, refetch } = useQuery<QueryData>(GET_ISSUES, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [createIssue, { loading }] = useMutation(CREATE_ISSUE, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const [closeIssue] = useMutation(CLOSE_ISSUE, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

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
  return (
    <Layout title="Minhas solicitações">
      <Stack maxW="5xl" mx="auto" spacing={4}>
        <PageHeading>Minhas solicitações</PageHeading>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    {...register('category')}
                  >
                    <option>Selecione...</option>
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
                    {...register('priority')}
                  >
                    <option>Selecione...</option>
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </Select>
                </FormControl>
              </HStack>
              <CustomButtom type="submit" leftIcon={<MdSend size="20px" />}>
                Enviar solicitação
              </CustomButtom>
            </Stack>
          </form>
        </Card>
        <PageHeading as="h2" size="md">
          Histórico de solicitações
        </PageHeading>
        <Skeleton isLoaded={!loading}>
          <Card overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Atualizado em</Th>
                  <Th>Aberto em</Th>
                  <Th>Título</Th>
                  <Th>Status</Th>
                  <Th>Prioridade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.socioIssues?.edges.map((issue) => (
                  <Tr key={issue.node.id}>
                    <Th>
                      <HStack>
                        <CustomChakraNextLink
                          href={`/ajuda/solicitacao/${issue.node.id}`}
                        >
                          <CustomIconButton
                            aria-label="view"
                            icon={<FaEye size="15px" />}
                          />
                        </CustomChakraNextLink>
                        <Box>
                          <CustomIconButton
                            aria-label="close-issue"
                            colorScheme="red"
                            icon={<MdClose size="15px" />}
                            onClick={onOpen}
                          />
                          <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                          >
                            <AlertDialogOverlay>
                              <AlertDialogContent>
                                <AlertDialogHeader
                                  fontSize="lg"
                                  fontWeight="bold"
                                >
                                  Fechar solicitação
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                  Tem certeza? Esta ação não poderá ser desfeita
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                  <CustomButtom
                                    onClick={onClose}
                                    colorScheme="gray"
                                  >
                                    Cancelar
                                  </CustomButtom>
                                  <CustomButtom
                                    colorScheme="red"
                                    onClick={() =>
                                      handleCloseIssue(issue.node.id)
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
                    </Th>
                    <Th>
                      {new Date(issue.node.updatedAt).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </Th>
                    <Th>
                      {new Date(issue.node.createdAt).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </Th>
                    <Th>{issue.node.title}</Th>
                    <Th>
                      <Badge
                        colorScheme={
                          issue.node.status === 'Open'
                            ? 'green'
                            : issue.node.status === 'In Progress'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {issue.node.status}
                      </Badge>
                    </Th>
                    <Th>
                      <Badge
                        colorScheme={
                          issue.node.priority === 'LOW'
                            ? 'blue'
                            : issue.node.priority === 'MEDIUM'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {issue.node.priority}
                      </Badge>
                    </Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </Skeleton>
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
        <VoltarButton href="/" />
      </Stack>
    </Layout>
  );
}

export default Solicitacoes;
