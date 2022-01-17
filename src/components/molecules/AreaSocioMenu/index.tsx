import React from 'react';
import { AiFillIdcard } from 'react-icons/ai';
import { Box, Divider, Stack, StackProps } from '@chakra-ui/react';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { gql, useQuery } from '@apollo/client';
import { MdArrowLeft, MdManageAccounts } from 'react-icons/md';
import { parseCookies } from 'nookies';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AreaSocioMenuProps extends StackProps {}

const QUERY_PORTAL = gql`
  query portalUrl {
    queryStripePortalUrl {
      stripePortalUrl
    }
  }
`;

export const AreaSocioMenu = ({ ...rest }: AreaSocioMenuProps) => {
  const { data } = useQuery(QUERY_PORTAL, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  return (
    <Stack {...rest}>
      <CustomChakraNextLink href="/carteirinha">
        <CustomButtom leftIcon={<AiFillIdcard size="20px" />}>
          Carteirinha
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/areasocio/atividades">
        <CustomButtom
          leftIcon={
            <>
              <FaVolleyballBall size="20px" />
              <Box ml={2} />
              <FaDrum size="20px" />
            </>
          }
        >
          Atividades
        </CustomButtom>
      </CustomChakraNextLink>
      <Divider height="15px" />
      <CustomChakraNextLink
        chakraLinkProps={{
          target: '_blank',
        }}
        href={`${data?.queryStripePortalUrl?.stripePortalUrl}`}
      >
        <CustomButtom
          leftIcon={<MdManageAccounts size="20px" />}
          hasExternalIcon
          colorScheme="yellow"
        >
          Gerenciar associação
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/">
        <CustomButtom leftIcon={<MdArrowLeft size="25px" />} colorScheme="red">
          Voltar
        </CustomButtom>
      </CustomChakraNextLink>
    </Stack>
  );
};
