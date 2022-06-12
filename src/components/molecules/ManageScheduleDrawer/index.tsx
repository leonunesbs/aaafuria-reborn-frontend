import { CustomButton, CustomIconButton } from '@/components/atoms';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAssignment, MdSave } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

const TOGGLE_PRESENCE = gql`
  mutation ToggleUserPresence($scheduleId: ID!, $userId: ID!) {
    toggleUserPresence(scheduleId: $scheduleId, userId: $userId) {
      ok
      presence
    }
  }
`;

function ParticipantRow({
  scheduleId,
  participant,
  usersPresent,
  refetch,
}: {
  scheduleId: string;
  participant: Member;
  usersPresent: Member[];
  refetch: () => void;
}) {
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { onToggle, isOpen } = useDisclosure({ defaultIsOpen: true });
  const [isPresent, setIsPresent] = useState(
    useMemo(() => {
      return usersPresent.some((user) => user.id === participant.id);
    }, [participant.id, usersPresent]),
  );

  const [togglePresence, { loading }] = useMutation(TOGGLE_PRESENCE, {
    variables: {
      scheduleId: scheduleId,
      userId: participant.id,
    },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Tr key={participant.id}>
      <Td onClick={onToggle} cursor={'pointer'}>
        {isOpen ? participant.nickname : participant.name}
      </Td>
      <Td isNumeric>{participant.group}</Td>
      <Td isNumeric>
        {loading ? (
          <Spinner color={green} />
        ) : (
          <Switch
            colorScheme={'green'}
            defaultChecked={isPresent}
            onChange={() => {
              setIsPresent(!isPresent);
              togglePresence();
              refetch();
            }}
          />
        )}
      </Td>
    </Tr>
  );
}

const GET_SCHEDULE = gql`
  query GetSchedule($scheduleId: ID) {
    schedule(scheduleId: $scheduleId) {
      id
      activity {
        id
        name
      }
      usersConfirmed {
        edges {
          node {
            member {
              id
              nickname
              group
              name
            }
          }
        }
      }
      usersPresent {
        edges {
          node {
            member {
              id
              nickname
              group
              name
            }
          }
        }
      }
    }
  }
`;

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($scheduleId: ID!) {
    deleteSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

const END_SCHEDULE = gql`
  mutation EndSchedule($scheduleId: ID!) {
    endSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

export interface ManageScheduleDrawerProps {
  scheduleId: string;
  refetch: () => void;
}

type Member = {
  id: string;
  nickname: string;
  group: string;
  name: string;
};

type ScheduleData = {
  schedule: {
    id: string;
    activity: {
      id: string;
      name: string;
    };
    usersConfirmed: {
      edges: {
        node: {
          member: Member;
        };
      }[];
    };
    usersPresent: {
      edges: {
        node: {
          member: Member;
        };
      }[];
    };
  };
};

function ManageScheduleDrawer({
  scheduleId,
  refetch,
}: ManageScheduleDrawerProps) {
  const { token } = useContext(AuthContext);
  const { green, bg } = useContext(ColorContext);

  const { onOpen, isOpen, onClose } = useDisclosure();

  const { data, refetch: getScheduleRefetch } = useQuery<ScheduleData>(
    GET_SCHEDULE,
    {
      variables: { scheduleId },
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
    variables: { scheduleId },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [endSchedule, { loading }] = useMutation(END_SCHEDULE, {
    variables: { scheduleId },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const usersPresent = useMemo(() => {
    if (!data) return [];
    return data.schedule.usersPresent.edges.map(({ node }) => node.member);
  }, [data]);

  return (
    <>
      <CustomIconButton
        onClick={onOpen}
        size="sm"
        aria-label="adicionar atividade"
        icon={<MdAssignment size="20px" />}
      />
      <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgColor={bg}>
          <DrawerCloseButton color={green} />
          <DrawerHeader fontFamily={'AACHENN'}>
            GERENCIAR ATIVIDADE
          </DrawerHeader>
          <DrawerBody overflowY={'auto'}>
            <Stack mb={10}>
              <FormControl isReadOnly>
                <FormLabel htmlFor="activity">Atividade: </FormLabel>
                <Input
                  focusBorderColor={green}
                  value={data?.schedule.activity.name}
                />
              </FormControl>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Participante</Th>
                      <Th isNumeric>Turma</Th>
                      <Th isNumeric>Frequência</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.schedule.usersConfirmed.edges.map(
                      ({ node: { member } }) => (
                        <ParticipantRow
                          key={member.id}
                          scheduleId={scheduleId}
                          participant={member}
                          usersPresent={usersPresent}
                          refetch={getScheduleRefetch}
                        />
                      ),
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Text
              textColor={'red'}
              fontSize="xs"
              textAlign={'right'}
              cursor="pointer"
              onClick={async () => {
                await deleteSchedule().then(() => {
                  refetch();
                  onClose();
                });
              }}
            >
              Excluir atividade
            </Text>
          </DrawerBody>

          <DrawerFooter>
            <CustomButton
              colorScheme={'gray'}
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              isLoading={loading}
              leftIcon={<MdSave size="20px" />}
              onClick={async () => {
                await endSchedule().then(() => {
                  refetch();
                  onClose();
                });
              }}
            >
              Encerrar treino
            </CustomButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ManageScheduleDrawer;
