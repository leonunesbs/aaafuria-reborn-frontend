import { ActivityIcon, CustomChakraNextLink } from '@/components/atoms';
import { ActivitySchedules, AddScheduleDrawer, Card } from '..';
import { Box, HStack, Heading } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { Activity } from '@/pages/activities';
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
      <HStack mb={2} w="full" justify={'space-between'} pr={1}>
        <HStack>
          <ActivityIcon activityName={activityName} />
          <CustomChakraNextLink
            href={`/activity/${activity.id}`}
            chakraLinkProps={{
              _hover: {
                textColor: 'green.500',
              },
            }}
          >
            <Heading size="sm">{activity.name.toUpperCase()}</Heading>
          </CustomChakraNextLink>
        </HStack>
        {user?.isStaff && (
          <Box>
            <AddScheduleDrawer refetch={refetch} activityId={activity.id} />
          </Box>
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
