import { Box, Divider, Stack, StackProps } from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  VoltarButton,
} from '@/components/atoms';
import { FaDrum, FaVolleyballBall, FaWallet } from 'react-icons/fa';
import { gql, useQuery } from '@apollo/client';

import { AiFillIdcard } from 'react-icons/ai';
import { MdManageAccounts } from 'react-icons/md';
import NextImage from 'next/image';
import React from 'react';
import { parseCookies } from 'nookies';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AreaSocioMenuProps extends StackProps {}

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
      <CustomChakraNextLink href="/loja-calangos">
        <CustomButtom
          leftIcon={
            <NextImage
              src={'/calango-verde.png'}
              alt="calangos"
              width={'25px'}
              height={'25px'}
            />
          }
        >
          Loja Calangos
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/atividades">
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
      <CustomChakraNextLink href="/carteirinha">
        <CustomButtom leftIcon={<AiFillIdcard size="20px" />}>
          Carteirinha de sócio
        </CustomButtom>
      </CustomChakraNextLink>

      <Divider height="15px" />
      <CustomChakraNextLink href="/areasocio/carteira">
        <CustomButtom leftIcon={<FaWallet size="20px" />}>
          Carteira
        </CustomButtom>
      </CustomChakraNextLink>
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
      <VoltarButton href="/" />
    </Stack>
  );
};
