import { Box, Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import {
  ColorModeToggle,
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
  NotificationBadge,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { FaInbox } from 'react-icons/fa';
import NextImage from 'next/image';

const GET_SOCIO = gql`
  query {
    socioAutenticado {
      matricula
      conta {
        calangos
      }
    }
  }
`;

export const Header = () => {
  const { bg, green } = useContext(ColorContext);
  const { isAuthenticated, isSocio, checkCredentials, token } =
    useContext(AuthContext);
  const { data, refetch } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  useEffect(() => {
    refetch();
    checkCredentials();
  }, [checkCredentials, refetch]);
  return (
    <>
      <Flex justify="space-between" bg={bg} py="2" px={{ base: '4', lg: '8' }}>
        <CustomChakraNextLink href="/">
          <CustomIconButton
            aria-label="início"
            icon={<AiFillHome size="20px" />}
          />
        </CustomChakraNextLink>
        {!data ? (
          <Spinner color="green" size="sm" />
        ) : (
          isAuthenticated &&
          isSocio && (
            <CustomChakraNextLink href="/areasocio/carteira">
              <CustomButton textColor={green} variant="ghost">
                <HStack w="full">
                  <NextImage
                    src={'/calango-verde.png'}
                    width="20px"
                    height="20px"
                    alt="carteira-calangos"
                  />
                  <Text fontSize="sm">
                    {data?.socioAutenticado?.conta.calangos}
                  </Text>
                </HStack>
              </CustomButton>
            </CustomChakraNextLink>
          )
        )}
        <HStack>
          <CustomChakraNextLink href="/arquivos">
            <CustomIconButton
              aria-label="files"
              icon={
                <Box position="relative">
                  <NotificationBadge />
                  <FaInbox size="20px" />
                </Box>
              }
            />
          </CustomChakraNextLink>
          <ColorModeToggle />
        </HStack>
      </Flex>
      <Flex flexGrow={1} bgColor={green} h={1} />
    </>
  );
};
