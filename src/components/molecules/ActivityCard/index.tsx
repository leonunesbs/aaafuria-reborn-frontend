import { ActivitySchedules, AddScheduleDrawer, Card } from '..';
import { HStack, Heading } from '@chakra-ui/react';

import { Activity } from '@/pages/activities';
import { ActivityIcon } from '@/components/atoms';

export interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    schedules: {
      edges: {
        node: Activity;
      }[];
    };
  };
  refetch: () => void;
}

function ActivityCard({ activity, refetch }: ActivityCardProps) {
  return (
    <Card w="full" py={6} px={[4, 6]}>
      <HStack mb={2} w="full" justify={'space-between'}>
        <HStack>
          <ActivityIcon activityName={activity.name} />
          <Heading size="sm">{activity.name.toUpperCase()}</Heading>
        </HStack>
        <AddScheduleDrawer refetch={refetch} activityId={activity.id} />
      </HStack>
      <ActivitySchedules
        schedules={activity.schedules.edges}
        refetch={refetch}
      />
    </Card>
  );
}

export default ActivityCard;
