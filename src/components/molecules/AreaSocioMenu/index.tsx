import { Box, Divider, Stack, StackProps } from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  VoltarButton,
} from '@/components/atoms';
import { FaDrum, FaVolleyballBall, FaWallet } from 'react-icons/fa';
import React, { useCallback, useContext, useState } from 'react';

import { AiFillIdcard } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { MdManageAccounts } from 'react-icons/md';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AreaMembroMenuProps extends StackProps {}

export const AreaMembroMenu = ({ ...rest }: AreaMembroMenuProps) => {
  const router = useRouter();
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleBillingPortal = useCallback(async () => {
    setBillingPortalLoading(true);
    const { data, errors, loading } = await client.query({
      query: gql`
        query getUser {
          user {
            member {
              billingPortalUrl
            }
          }
        }
      `,
      context: {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    });
    if (errors) {
      setBillingPortalLoading(loading);
      throw errors;
    }
    setBillingPortalLoading(loading);
    router.push(data.user.member.billingPortalUrl);
  }, [router, token]);

  return (
    <Stack {...rest}>
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
          Carteirinha
        </CustomButton>
      </CustomChakraNextLink>

      <Divider height="15px" />
      <CustomChakraNextLink href="/bank/my-payments">
        <CustomButton leftIcon={<FaWallet size="20px" />}>
          Pagamentos
        </CustomButton>
      </CustomChakraNextLink>

      <CustomButton
        leftIcon={<MdManageAccounts size="20px" />}
        hasExternalIcon
        colorScheme="yellow"
        isLoading={billingPortalLoading}
        onClick={handleBillingPortal}
      >
        Gerenciar associação
      </CustomButton>
      <VoltarButton href="/" />
    </Stack>
  );
};
