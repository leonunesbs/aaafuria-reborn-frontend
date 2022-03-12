import {
  Box,
  Flex,
  HStack,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ColorModeToggle,
  CustomButtom,
  CustomChakraNextLink,
  CustomIconButton,
  NotificationBadge,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { FaInbox } from 'react-icons/fa';
import NextImage from 'next/image';
import { parseCookies } from 'nookies';

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
  const bg = useColorModeValue('white', 'gray.800');
  const green = useColorModeValue('green.600', 'green.200');
  const { isAuthenticated, isSocio, checkCredentials } =
    useContext(AuthContext);
  const { data, refetch } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    refetch();
    checkCredentials();
  }, [checkCredentials, refetch]);
  return (
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
            <CustomButtom flexDir="column" textColor={green} w="initial">
              <HStack>
                <NextImage
                  src={'/calango-verde.png'}
                  width="20px"
                  height="20px"
                  alt="calangos"
                />
                <Text fontSize="sm">
                  {data?.socioAutenticado?.conta.calangos}
                </Text>
              </HStack>
            </CustomButtom>
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
  );
};
