import {
  CustomButton,
  CustomChakraNextLink,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { Box, Divider, Stack, StackProps } from '@chakra-ui/react';
import NextImage from 'next/image';
import { parseCookies } from 'nookies';
import React from 'react';
import { AiFillIdcard } from 'react-icons/ai';
import { FaDrum, FaVolleyballBall, FaWallet } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';

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
        <CustomButton
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
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/atividades">
        <CustomButton
          leftIcon={
            <>
              <FaVolleyballBall size="20px" />
              <Box ml={2} />
              <FaDrum size="20px" />
            </>
          }
        >
          Atividades
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/carteirinha">
        <CustomButton leftIcon={<AiFillIdcard size="20px" />}>
          Carteirinha de sócio
        </CustomButton>
      </CustomChakraNextLink>

      <Divider height="15px" />
      <CustomChakraNextLink href="/areasocio/carteira">
        <CustomButton leftIcon={<FaWallet size="20px" />}>
          Carteira
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink
        chakraLinkProps={{
          target: '_blank',
        }}
        href={`${data?.queryStripePortalUrl?.stripePortalUrl}`}
      >
        <CustomButton
          leftIcon={<MdManageAccounts size="20px" />}
          hasExternalIcon
          colorScheme="yellow"
        >
          Gerenciar associação
        </CustomButton>
      </CustomChakraNextLink>
      <VoltarButton href="/" />
    </Stack>
  );
};
