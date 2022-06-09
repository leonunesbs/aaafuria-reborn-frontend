import { ActivitySchedules, AddScheduleDrawer, Card } from '..';
import { HStack, Heading } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { Activity } from '@/pages/activities';
import { ActivityIcon } from '@/components/atoms';
import { AuthContext } from '@/contexts/AuthContext';

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
  const { user } = useContext(AuthContext);
  const activityName = useMemo(() => activity.name, [activity.name]);
  return (
    <Card w="full" py={6} px={[4, 6]}>
      <HStack mb={2} w="full" justify={'space-between'}>
        <HStack>
          <ActivityIcon activityName={activityName} />
          <Heading size="sm">{activity.name.toUpperCase()}</Heading>
        </HStack>
        {user?.isStaff && (
          <AddScheduleDrawer refetch={refetch} activityId={activity.id} />
        )}
      </HStack>
      <ActivitySchedules
        schedules={activity.schedules.edges}
        refetch={refetch}
      />
    </Card>
  );
}

export default ActivityCard;
