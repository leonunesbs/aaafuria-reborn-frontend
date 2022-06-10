import {
  ColorModeToggle,
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
} from '@/components/atoms';
import {
  Avatar,
  Box,
  Center,
  chakra,
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
  useDisclosure,
} from '@chakra-ui/react';
import { useContext, useEffect, useRef } from 'react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import {
  MdHelpCenter,
  MdLogin,
  MdLogout,
  MdManageAccounts,
  MdPerson,
  MdStore,
} from 'react-icons/md';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import Hamburger from 'hamburger-react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { GiPartyPopper } from 'react-icons/gi';

export const Header = () => {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { bg, green } = useContext(ColorContext);
  const { isAuthenticated, signOut, user, checkAuth } = useContext(AuthContext);
  const ChakraNextImage = chakra(NextImage);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
                  filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
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
            <CustomChakraNextLink href="/activities">
              <CustomButton
                variant={'ghost'}
                isActive={router.asPath == '/activities'}
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
            <CustomChakraNextLink href="/ajuda/minhas-solicitacoes">
              <CustomButton
                variant={'solid'}
                isActive={router.asPath == '/ajuda/minhas-solicitacoes'}
              >
                Ajuda
              </CustomButton>
            </CustomChakraNextLink>
          </HStack>
        </HStack>
        <HStack spacing={[2, 2, 4]}>
          <ColorModeToggle />
          {isAuthenticated ? (
            <CustomChakraNextLink href={'/carteirinha'}>
              <Avatar
                display={['none', 'none', 'flex']}
                name={user?.member.name}
                src={user?.member.avatar}
                border={
                  user?.member.hasActiveMembership
                    ? '2px solid green'
                    : '2px solid gray'
                }
              />
            </CustomChakraNextLink>
          ) : (
            <CustomChakraNextLink
              href={'/entrar'}
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
            icon={
              <Hamburger
                toggled={isOpen}
                toggle={onToggle}
                size={20}
                hideOutline={false}
              />
            }
          />
        </HStack>
      </Flex>
      <Flex flexGrow={1} bgColor={green} h={1} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={green} pr={6}>
          <DrawerCloseButton color={bg} mr={6} />
          <DrawerHeader shadow={'base'} borderBottomRadius={'md'}>
            <CustomChakraNextLink
              href="/"
              chakraLinkProps={{
                onClick: onClose,
              }}
            >
              <Box height={['100px']} width={['160px']} position="relative">
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
            </CustomChakraNextLink>
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
                isActive={router.asPath == '/eventos'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<GiPartyPopper size="20px" />}
                onClick={() => router.push('/eventos')}
              >
                Eventos
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
                  <CustomButton
                    isActive={router.asPath == '/ajuda/minhas-solicitacoes'}
                    variant={'solid'}
                    justifyContent={'flex-start'}
                    leftIcon={<MdHelpCenter size="20px" />}
                    onClick={() => router.push('/ajuda/minhas-solicitacoes')}
                  >
                    Ajuda
                  </CustomButton>
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
    </>
  );
};
