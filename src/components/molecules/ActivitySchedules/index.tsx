import { Activity } from '@/pages/activities';
import { ScheduleCard } from '..';
import { Stack } from '@chakra-ui/react';

export interface ActivitySchedulesProps {
  schedules: { node: Activity }[];
  refetch: () => void;
}

function ActivitySchedules({ schedules, refetch }: ActivitySchedulesProps) {
  return (
    <Stack overflowY={'auto'} rounded="md" p={1}>
      {schedules.map(({ node: schedule }) => (
        <ScheduleCard key={schedule.id} schedule={schedule} refetch={refetch} />
      ))}
    </Stack>
  );
}

export default ActivitySchedules;
