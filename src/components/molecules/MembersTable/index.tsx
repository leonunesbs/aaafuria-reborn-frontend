import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { gql, useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Column } from 'react-table';
import { CustomTable } from '..';
import { Icon } from '@chakra-ui/react';

const ALL_MEMBERS = gql`
  query allMembers {
    allMembers {
      id
      registration
      name
      nickname
      group
      hasActiveMembership
      activeMembership {
        id
        membershipPlan {
          title
        }
      }
    }
  }
`;

type Member = {
  id: string;
  registration: string;
  name: string;
  nickname: string;
  group: string;
  hasActiveMembership: boolean;
  activeMembership: {
    id: string;
    membershipPlan: {
      title: string;
    };
  };
};

type MemberData = {
  allMembers: Member[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MembersTableProps {}

function MembersTable({}: MembersTableProps) {
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, loading } = useQuery<MemberData>(ALL_MEMBERS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Member[] = useMemo(() => {
    if (loading) {
      return [];
    }
    return data?.allMembers || [];
  }, [data, loading]);

  const tableColumns: Column<Member>[] = useMemo(
    () =>
      [
        {
          id: 'registration',
          Header: 'Matrícula',
          accessor: 'registration',
        },
        {
          id: 'name',
          Header: 'Nome',
          accessor: 'name',
        },
        {
          id: 'group',
          Header: 'Turma',
          accessor: 'group',
        },
        {
          id: 'hasActiveMembership',
          Header: 'Sócio',
          accessor: 'hasActiveMembership',
          Cell: ({ value: isSocio }: { value: boolean }) => {
            return (
              <Icon
                as={isSocio ? HiCheckCircle : HiXCircle}
                color={isSocio ? green : 'red.500'}
                h={5}
                w={5}
              />
            );
          },
        },
        {
          id: 'activeMembership',
          Header: 'Plano',
          accessor: 'activeMembership.membershipPlan.title',
          Cell: ({ value }: { value: string }) => {
            return <>{value}</> || <>{'-'}</>;
          },
        },
      ] as Column<Member>[],
    [green],
  );

  return (
    <CustomTable columns={tableColumns} data={tableData} loading={loading} />
  );
}

export default MembersTable;
