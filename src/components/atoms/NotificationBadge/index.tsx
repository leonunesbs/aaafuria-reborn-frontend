import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Circle } from '@chakra-ui/react';
import { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotificationBadgeProps {}

const GET_UNREAD_FILES = gql`
  query getUnreadFiles {
    unreadFiles {
      id
    }
  }
`;

export const NotificationBadge = ({ ...rest }: NotificationBadgeProps) => {
  const { token } = useContext(AuthContext);

  const { data } = useQuery(GET_UNREAD_FILES, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  if (!data) {
    return <></>;
  }

  if (data.unreadFiles?.length > 0) {
    return (
      <Circle
        position="absolute"
        bgColor={'tomato'}
        size="8px"
        color="tomato"
        right={0}
        {...rest}
      />
    );
  } else {
    return <></>;
  }
};
