import CustomButtom from '../CustomButtom';
import CustomChakraNextLink from '../CustomChakraNextLink';
import React from 'react';
import { AiFillHome, AiFillIdcard } from 'react-icons/ai';
import { Box, Divider, Stack, StackProps } from '@chakra-ui/react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { gql, useQuery } from '@apollo/client';
import { MdManageAccounts } from 'react-icons/md';
import { parseCookies } from 'nookies';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AreaSocioMenuProps extends StackProps {}

const QUERY_PORTAL = gql`
  query portal {
    createPortalUrl {
      stripePortalUrl
    }
  }
`;

function AreaSocioMenu({ ...rest }: AreaSocioMenuProps) {
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
        href={`${data.createPortalUrl.stripePortalUrl}`}
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
        <CustomButtom leftIcon={<AiFillHome size="20px" />} colorScheme="gray">
          Voltar ao início
        </CustomButtom>
      </CustomChakraNextLink>
    </Stack>
  );
}

export default AreaSocioMenu;
