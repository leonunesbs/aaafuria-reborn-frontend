import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  chakra,
} from '@chakra-ui/react';
import {
  ColorModeToggle,
  CustomButton,
  CustomChakraNextLink,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import NextImage from 'next/image';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const GET_SOCIO = gql`
  query {
    socioAutenticado {
      id
      apelido
      nome
      avatar
      isSocio
      matricula
      conta {
        calangos
      }
    }
  }
`;

export const Header = () => {
  const router = useRouter();
  const { bg, green } = useContext(ColorContext);
  const { isAuthenticated, token, signOut } = useContext(AuthContext);
  const { data } = useQuery(GET_SOCIO, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });
  const ChakraNextImage = chakra(NextImage);

  return (
    <>
      <Flex
        justify="space-between"
        bg={bg}
        py="2"
        px={[2, 2, 2, 14]}
        mx="auto"
        maxW={'8xl'}
      >
        <HStack spacing={10}>
          <Center>
            <CustomChakraNextLink href="/">
              <Box
                height={['80px', '100px']}
                width={['130px', '160px']}
                position="relative"
              >
                <ChakraNextImage
                  placeholder="blur"
                  layout="fill"
                  objectFit="cover"
                  src={'/logo-aaafuria-h.webp'}
                  blurDataURL={'/logo-aaafuria-h.webp'}
                  quality={1}
                  alt="logo"
                  mx="auto"
                  mb={{ base: '8', md: '12' }}
                  draggable={false}
                />
              </Box>
            </CustomChakraNextLink>
          </Center>
          <HStack display={['none', 'none', 'flex']}>
            <CustomChakraNextLink href="/">
              <CustomButton variant={'ghost'} isActive={router.asPath == '/'}>
                Início
              </CustomButton>
            </CustomChakraNextLink>
            <CustomChakraNextLink href="/loja">
              <CustomButton
                variant={'ghost'}
                isActive={router.asPath == '/loja'}
              >
                Loja
              </CustomButton>
            </CustomChakraNextLink>
            <CustomChakraNextLink href="/atividades">
              <CustomButton
                variant={'ghost'}
                isActive={router.asPath == '/atividades'}
              >
                Atividades
              </CustomButton>
            </CustomChakraNextLink>
            <CustomChakraNextLink href="/eventos">
              <CustomButton
                variant={'ghost'}
                isActive={router.asPath == '/eventos'}
              >
                Eventos
              </CustomButton>
            </CustomChakraNextLink>
          </HStack>
        </HStack>
        <HStack spacing={4}>
          <ColorModeToggle />
          {isAuthenticated ? (
            <Menu>
              <MenuButton>
                <Avatar
                  display={['none', 'none', 'flex']}
                  name={data?.socioAutenticado?.nome}
                  src={data?.socioAutenticado?.avatar}
                  border={
                    data?.socioAutenticado?.isSocio
                      ? '2px solid green'
                      : '2px solid gray'
                  }
                />
                <Avatar
                  size="md"
                  display={['flex', 'flex', 'none']}
                  name={data?.socioAutenticado?.nome}
                  src={data?.socioAutenticado?.avatar}
                  border={
                    data?.socioAutenticado?.isSocio
                      ? '2px solid green'
                      : '2px solid gray'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuGroup title="Menu">
                  <CustomChakraNextLink href={'/'}>
                    <MenuItem>Início</MenuItem>
                  </CustomChakraNextLink>
                  <CustomChakraNextLink href={'/loja'}>
                    <MenuItem>Loja</MenuItem>
                  </CustomChakraNextLink>
                  <CustomChakraNextLink href={'/atividades'}>
                    <MenuItem>Atividades</MenuItem>
                  </CustomChakraNextLink>
                  <CustomChakraNextLink href={'/eventos'}>
                    <MenuItem>Eventos</MenuItem>
                  </CustomChakraNextLink>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Conta">
                  <CustomChakraNextLink href={'/areasocio'}>
                    <MenuItem>Área do Sócio</MenuItem>
                  </CustomChakraNextLink>
                  <CustomChakraNextLink href={'/areadiretor'}>
                    <MenuItem>Área do Diretor</MenuItem>
                  </CustomChakraNextLink>
                  <MenuItem onClick={signOut}>Sair</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem>
                  {data?.socioAutenticado?.apelido}{' '}
                  {data?.socioAutenticado?.matricula}
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <CustomChakraNextLink
              href={'entrar'}
              chakraLinkProps={{
                display: ['none', 'none', 'flex'],
              }}
            >
              <CustomButton>Entrar</CustomButton>
            </CustomChakraNextLink>
          )}
        </HStack>
      </Flex>
      <Flex flexGrow={1} bgColor={green} h={1} />
    </>
  );
};
