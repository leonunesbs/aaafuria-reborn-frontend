import {
  Avatar,
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ColorModeToggle,
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
} from '@/components/atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { MdManageAccounts, MdPerson, MdStore } from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useContext, useRef } from 'react';

import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { GiPartyPopper } from 'react-icons/gi';
import Hamburger from 'hamburger-react';
import NextImage from 'next/image';
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
  const btnRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { bg, green } = useContext(ColorContext);
  const { isAuthenticated, token, signOut, isStaff } = useContext(AuthContext);
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
          <CustomIconButton
            ref={btnRef}
            aria-label="hamburguer-menu"
            onClick={onToggle}
            icon={<Hamburger toggled={isOpen} size={24} />}
          />
        </HStack>
      </Flex>
      <Flex flexGrow={1} bgColor={green} h={1} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={green} pr={6}>
          <DrawerCloseButton color={bg} />
          <DrawerHeader>
            <CustomChakraNextLink
              href="/"
              chakraLinkProps={{
                onClick: onClose,
              }}
            >
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
          </DrawerHeader>

          <DrawerBody>
            <Stack mt={10}>
              <CustomChakraNextLink href={'/'}>
                <CustomButton
                  isActive={router.asPath == '/'}
                  variant={'solid'}
                  justifyContent={'flex-start'}
                  leftIcon={<AiFillHome size="20px" />}
                >
                  Início
                </CustomButton>
              </CustomChakraNextLink>
              <CustomChakraNextLink href={'/loja'}>
                <CustomButton
                  isActive={router.asPath == '/loja'}
                  variant={'solid'}
                  justifyContent={'flex-start'}
                  leftIcon={<MdStore size="20px" />}
                >
                  Loja
                </CustomButton>
              </CustomChakraNextLink>
              <CustomChakraNextLink href={'/atividades'}>
                <CustomButton
                  isActive={router.asPath == '/atividades'}
                  variant={'solid'}
                  py={10}
                  justifyContent={'flex-start'}
                  leftIcon={
                    <Stack>
                      <FaVolleyballBall size="20px" />
                      <FaDrum size="20px" />
                    </Stack>
                  }
                >
                  Atividades
                </CustomButton>
              </CustomChakraNextLink>
              <CustomChakraNextLink href={'/eventos'}>
                <CustomButton
                  isActive={router.asPath == '/eventos'}
                  variant={'solid'}
                  py={10}
                  justifyContent={'flex-start'}
                  leftIcon={<GiPartyPopper size="20px" />}
                >
                  Eventos
                </CustomButton>
              </CustomChakraNextLink>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Box w="full">
              <Stack>
                <CustomChakraNextLink href={'/areasocio'}>
                  <CustomButton
                    isActive={router.asPath == '/areasocio'}
                    variant={'solid'}
                    justifyContent={'flex-start'}
                    leftIcon={<MdPerson size="20px" />}
                  >
                    Área do Sócio
                  </CustomButton>
                </CustomChakraNextLink>
                {isStaff && (
                  <CustomChakraNextLink href={'/areadiretor'}>
                    <CustomButton
                      isActive={router.asPath == '/areadiretor'}
                      variant={'solid'}
                      colorScheme="yellow"
                      justifyContent={'flex-start'}
                      leftIcon={<MdManageAccounts size="20px" />}
                    >
                      Área do Diretor
                    </CustomButton>
                  </CustomChakraNextLink>
                )}
              </Stack>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
