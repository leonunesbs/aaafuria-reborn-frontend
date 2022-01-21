import {
  ColorModeToggle,
  CustomButtom,
  CustomChakraNextLink,
  CustomIconButton,
} from '@/components/atoms';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import {
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';

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
                <Image src="/calango-verde.png" boxSize="15px" alt="calangos" />
                <Text fontSize="sm">
                  {data?.socioAutenticado?.conta.calangos}
                </Text>
              </HStack>
            </CustomButtom>
          </CustomChakraNextLink>
        )
      )}
      <ColorModeToggle />
    </Flex>
  );
};
