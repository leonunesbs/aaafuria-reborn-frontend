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
  Stack,
  Text,
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
import {
  MdLogin,
  MdLogout,
  MdManageAccounts,
  MdPerson,
  MdShoppingCart,
  MdStore,
} from 'react-icons/md';
import { ReactNode, useContext } from 'react';

import { AiFillHome } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { CgMenu } from 'react-icons/cg';
import { ColorContext } from '@/contexts/ColorContext';
import { ImCross } from 'react-icons/im';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

const HeaderMenuItem = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  const router = useRouter();
  const { green, invertedBg } = useContext(ColorContext);

  return (
    <CustomChakraNextLink
      chakraLinkProps={{
        textColor: router.asPath === href ? green : invertedBg,
      }}
      href={href}
    >
      {children}
    </CustomChakraNextLink>
  );
};

export const Header = () => {
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { bg, green } = useContext(ColorContext);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const ChakraNextImage = chakra(NextImage);

  const menuItems = [
    {
      title: 'Início',
      href: '/',
    },
    {
      title: 'Loja',
      href: '/loja',
    },
    {
      title: 'Atividades',
      href: '/activities',
    },
    {
      title: 'Confrontos',
      href: '/activities/matches',
    },
  ];

  return (
    <Box zIndex={1000}>
      <Flex justify="space-between" bg={bg} py="2" mx="auto" px={['2', '10']}>
        <HStack spacing={10}>
          <Center>
            <Box
              height={['80px', '100px']}
              width={['130px', '160px']}
              position="relative"
              onClick={() => router.push('/')}
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
                filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
              />
            </Box>
          </Center>
          <HStack
            display={['none', 'none', 'none', 'flex']}
            spacing={6}
            fontSize={'lg'}
            fontFamily="AACHENN"
            textTransform={'uppercase'}
          >
            {menuItems.map((item) => (
              <HeaderMenuItem key={item.href} href={item.href}>
                {item.title}
              </HeaderMenuItem>
            ))}
          </HStack>
        </HStack>
        <HStack spacing={[2, 2, 4]}>
          <ColorModeToggle />
          <CustomIconButton
            aria-label="hamburguer-menu"
            onClick={onToggle}
            icon={<CgMenu size="25px" />}
          />
          {isAuthenticated ? (
            <>
              {router.asPath.includes('/loja') && (
                <CustomIconButton
                  aria-label="cart"
                  icon={<MdShoppingCart size="25px" />}
                  onClick={() => router.push('/store/cart')}
                />
              )}
              <Avatar
                display={['none', 'none', 'flex']}
                name={user?.member.name}
                src={user?.member.avatar}
                border={
                  user?.member.hasActiveMembership
                    ? '2px solid green'
                    : '2px solid gray'
                }
                onClick={() => router.push('/carteirinha')}
              />
            </>
          ) : (
            <CustomButton
              display={['none', 'none', 'flex']}
              onClick={() => router.push('/entrar')}
            >
              Entrar
            </CustomButton>
          )}
        </HStack>
      </Flex>
      <Flex flexGrow={1} bgColor={green} h={'0.5'} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={green} pr={6}>
          <DrawerCloseButton color={bg} mr={6} />
          <DrawerHeader shadow={'base'} borderBottomRadius={'md'}>
            <Box
              height={['100px']}
              width={['160px']}
              position="relative"
              onClick={() => {
                onClose();
                router.push('/');
              }}
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
                filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
              />
            </Box>
          </DrawerHeader>

          <DrawerBody
            borderRightRadius={'md'}
            shadow={'base'}
            my={2}
            py={4}
            px={2}
          >
            <Stack>
              <CustomButton
                isActive={router.asPath == '/'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<AiFillHome size="20px" />}
                onClick={() => router.push('/')}
              >
                Início
              </CustomButton>
              <CustomButton
                isActive={router.asPath == '/loja'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<MdStore size="20px" />}
                onClick={() => router.push('/loja')}
              >
                Loja
              </CustomButton>

              <CustomButton
                isActive={router.asPath == '/activities'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={
                  <HStack>
                    <FaVolleyballBall size="20px" />
                    <FaDrum size="20px" />
                  </HStack>
                }
                onClick={() => router.push('/activities')}
              >
                Atividades
              </CustomButton>
              <CustomButton
                isActive={router.asPath == '/activities/matches'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<ImCross size="20px" />}
                onClick={() => router.push('/activities/matches')}
              >
                Confrontos
              </CustomButton>
            </Stack>
          </DrawerBody>

          <DrawerFooter shadow={'base'} borderTopRadius={'md'}>
            {isAuthenticated ? (
              <Box w="full">
                <Stack>
                  <CustomButton
                    isActive={router.asPath == '/areamembro'}
                    variant={'solid'}
                    justifyContent={'flex-start'}
                    leftIcon={<MdPerson size="20px" />}
                    onClick={() => router.push('/areamembro')}
                  >
                    Área do Membro
                  </CustomButton>
                  {user?.isStaff && (
                    <CustomButton
                      isActive={router.asPath == '/areadiretor'}
                      variant={'solid'}
                      colorScheme="yellow"
                      justifyContent={'flex-start'}
                      leftIcon={<MdManageAccounts size="20px" />}
                      onClick={() => router.push('/areadiretor')}
                    >
                      Área do Diretor
                    </CustomButton>
                  )}
                </Stack>
                <Box h={'1px'} my={6} bgColor={'rgb(0,0,0,0.5)'} rounded="sm" />
                <Stack>
                  <HStack w="full" justify={'space-between'}>
                    <HStack>
                      <Avatar
                        name={user?.member.name}
                        src={user?.member.avatar}
                        border={
                          user?.member.hasActiveMembership
                            ? '2px solid green'
                            : '2px solid gray'
                        }
                        onClick={() => router.push('/carteirinha')}
                      />
                      <Stack spacing={0} textColor={bg}>
                        <Text fontSize={['md']} fontWeight="bold">
                          {user?.member.nickname}
                        </Text>
                        <Text fontSize={['xs']}>
                          {user?.member.registration}
                        </Text>
                      </Stack>
                    </HStack>
                    <CustomIconButton
                      aria-label="sair"
                      variant={'solid'}
                      icon={<MdLogout size="20px" />}
                      onClick={signOut}
                    />
                  </HStack>
                </Stack>
              </Box>
            ) : (
              <Box w="full">
                <CustomButton
                  isActive={router.asPath == '/entrar'}
                  variant={'solid'}
                  justifyContent={'flex-start'}
                  leftIcon={<MdLogin size="20px" />}
                  onClick={() => router.push('/entrar')}
                >
                  Entrar
                </CustomButton>
              </Box>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
