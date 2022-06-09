import {
  Badge,
  Box,
  HStack,
  Progress,
  Spinner,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';

import { Activity } from '@/pages/activities';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

const CONFIRM_TO_SCHEDULE = gql`
  mutation confirmToSchedule($scheduleId: ID!) {
    confirmToSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

const CANCEL_FROM_SCHEDULE = gql`
  mutation cancelFromSchedule($scheduleId: ID!) {
    cancelFromSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

export interface ScheduleCardProps {
  schedule: Activity;
  refetch: () => void;
}

export default function ScheduleCard({ schedule, refetch }: ScheduleCardProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const [confirmToSchedule, { loading: confirmLoading }] = useMutation(
    CONFIRM_TO_SCHEDULE,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const [cancelFromSchedule, { loading: cancelLoading }] = useMutation(
    CANCEL_FROM_SCHEDULE,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const handleSwitch = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, scheduleId: string) => {
      if (event.target.checked) {
        await confirmToSchedule({
          variables: {
            scheduleId,
          },
        }).then(({ data, errors }) => {
          if (errors) {
            toast({
              title: 'Erro ao confirmar participação.',
              status: 'error',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
            throw errors;
          }
          if (data.confirmToSchedule.ok) {
            refetch();
            toast({
              title: 'Participação confirmada',
              status: 'success',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          }
        });
      } else {
        await cancelFromSchedule({
          variables: {
            scheduleId,
          },
        }).then(({ data, errors }) => {
          if (errors) {
            toast({
              title: 'Erro ao remover participação.',
              status: 'error',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
            throw errors;
          }
          if (data.cancelFromSchedule.ok) {
            refetch();
            toast({
              title: 'Participação removida',
              status: 'info',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          }
        });
      }
    },
    [cancelFromSchedule, confirmToSchedule, refetch, toast],
  );
  return (
    <Box
      key={schedule.id}
      position={'relative'}
      rounded={'md'}
      overflow="hidden"
    >
      <HStack p={2} mb={2} w="full" justify="space-between">
        <Stack>
          <Text fontSize="sm">
            {schedule.location}
            <br />
            <Text fontSize="xs">
              {new Date(schedule.startDate as string).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
              })}
            </Text>
            <HStack>
              {schedule.tags?.map((tag) => (
                <Badge
                  key={tag}
                  colorScheme="green"
                  variant="solid"
                  rounded="full"
                  fontSize="xx-small"
                >
                  {tag}
                </Badge>
              ))}
            </HStack>
          </Text>
          <Text fontSize="xs">{schedule.description}</Text>
        </Stack>
        {confirmLoading || cancelLoading === true ? (
          <Spinner color={green} />
        ) : (
          <Switch
            colorScheme={'green'}
            isChecked={schedule.currentUserConfirmed}
            onChange={(e) => handleSwitch(e, schedule.id)}
          />
        )}
      </HStack>
      <Progress
        position={'absolute'}
        value={(schedule.confirmedCount / schedule.maxParticipants) * 100}
        hasStripe={schedule.confirmedCount >= schedule.maxParticipants}
        isAnimated
        colorScheme={
          schedule.confirmedCount < schedule.minParticipants ? 'gray' : 'green'
        }
        w="full"
        bottom={-2}
        left={0}
      />
    </Box>
  );
}
