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
  HStack,
  Skeleton,
  Spinner,
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
} from '@/components/atoms';
import { MdClose, MdOutlineCircle } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useRef } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { IIssueType } from '@/pages/ajuda/IIssueType';

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

export interface IssueInfoCardProps {
  issue: IIssueType;
  loadingIssueQuery: boolean;
  refetchIssueQuery: () => void;
}

export const IssueInfoCard = ({
  issue,
  refetchIssueQuery,
  loadingIssueQuery,
}: IssueInfoCardProps) => {
  const toast = useToast();
  const { token, isStaff } = useContext(AuthContext);
  const { green } = useContext(ColorContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

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

  const handleOpenIssue = useCallback(
    async (id: string) => {
      await openIssue({
        variables: {
          id,
        },
      })
        .then(() => {
          toast({
            description: 'Solicitação aberta com sucesso!',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetchIssueQuery();
        })
        .catch((error) => alert(error.message));
      onClose();
    },
    [onClose, openIssue, refetchIssueQuery, toast],
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
            description: 'Solicitação fechada com sucesso!',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetchIssueQuery();
        })
        .catch((error) => alert(error.message));
      onClose();
    },
    [closeIssue, onClose, refetchIssueQuery, toast],
  );

  if (!issue) {
    return <Spinner alignSelf={'center'} color={green} />;
  }

  return (
    <Box>
      <PageHeading>Solicitação</PageHeading>
      <Card>
        <Stack>
          <HStack justify={'right'}>
            <CustomIconButton
              aria-label="open-issue"
              icon={<MdOutlineCircle size="15px" />}
              isDisabled={!isStaff}
              onClick={() => handleOpenIssue(issue.id as string)}
            />
            <CustomIconButton
              aria-label="close-issue"
              colorScheme="red"
              icon={<MdClose size="20px" />}
              onClick={onOpen}
            />
          </HStack>
          <Skeleton isLoaded={!loadingIssueQuery}>
            <Box mb={2}>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                {issue.title}
              </Text>
              <Divider />
            </Box>
          </Skeleton>
          <Skeleton isLoaded={!loadingIssueQuery}>
            <Textarea
              value={issue.description}
              isReadOnly
              focusBorderColor={green}
            />
          </Skeleton>

          <HStack justify={'space-between'}>
            <Box>
              <Text>Status: </Text>
              <Skeleton isLoaded={!loadingIssueQuery}>
                <Badge
                  fontSize={'md'}
                  colorScheme={
                    issue.status === 'OPEN'
                      ? 'green'
                      : issue.status === 'IN_PROGRESS'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {issue.getStatusDisplay}
                </Badge>
              </Skeleton>
              <Text>Prioridade: </Text>
              <Skeleton isLoaded={!loadingIssueQuery}>
                <Badge
                  fontSize={'md'}
                  colorScheme={
                    issue.priority === 'LOW'
                      ? 'blue'
                      : issue.priority === 'MEDIUM'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {issue.getPriorityDisplay}
                </Badge>
              </Skeleton>
            </Box>
            <Box>
              <Text textAlign={'right'} fontSize="sm">
                <CustomChakraNextLink
                  href={`https://diretoria.aaafuria.site/admin/core/socio/?q=${issue.author.matricula}`}
                  chakraLinkProps={{
                    color: green,
                    fontWeight: 'bold',
                    _hover: {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {issue.author.apelido}
                </CustomChakraNextLink>
              </Text>
              <Text textAlign={'right'} fontSize="sm">
                {new Date(issue.createdAt as string).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'America/Sao_Paulo',
                })}
              </Text>
            </Box>
          </HStack>
        </Stack>
      </Card>
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
                variant={'solid'}
                onClick={() => handleCloseIssue(issue.id as string)}
                ml={3}
              >
                Fechar solicitação
              </CustomButtom>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
