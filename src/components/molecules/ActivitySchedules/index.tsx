import { Activity } from '@/pages/activities';
import { Box } from '@chakra-ui/react';
import { ScheduleCard } from '@/components/atoms';

export interface ActivitySchedulesProps {
  schedules: { node: Activity }[];
  refetch: () => void;
}

function ActivitySchedules({ schedules, refetch }: ActivitySchedulesProps) {
  return (
    <Box overflowY={'auto'} rounded="md">
      {schedules.map(({ node: schedule }) => (
        <ScheduleCard key={schedule.id} schedule={schedule} refetch={refetch} />
      ))}
    </Box>
  );
}

export default ActivitySchedules;
