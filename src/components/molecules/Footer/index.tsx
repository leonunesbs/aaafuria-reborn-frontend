import { CustomChakraNextLink } from '@/components/atoms';
import { CustomButton } from '@/components/atoms/CustomButton';
import { ColorContext } from '@/contexts/ColorContext';
import { Box, chakra, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useContext } from 'react';
import { SocialIcons } from '..';

export const Footer = () => {
  const { green, bg } = useContext(ColorContext);
  const ChakraNextImage = chakra(NextImage);
  return (
    <Box as="footer" role={'contentinfo'} bg={green} py={12} textColor={bg}>
      <HStack w={'full'} justify="space-around">
        <Circle size="15px" bgColor={bg} />
        <Circle size="15px" bgColor={bg} />
        <Circle size="15px" bgColor={bg} />
        <Circle size="15px" bgColor={bg} />
      </HStack>
      <HStack
        py={4}
        w="full"
        maxW="7xl"
        mx="auto"
        justify={'space-between'}
        px={{ base: '4', lg: '8' }}
      >
        <Stack>
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
          <Text letterSpacing={2}>
            &copy; 2022 |{' '}
            <CustomChakraNextLink
              href="/"
              chakraLinkProps={{
                fontFamily: 'heading',
                _hover: {
                  color: green,
                },
              }}
            >
              A.A.A. FÚRIA
            </CustomChakraNextLink>
          </Text>

          <CustomChakraNextLink
            href="https://github.com/leonunesbs"
            chakraLinkProps={{
              target: '_blank',
            }}
          >
            <CustomButton
              aria-label="designer"
              variant={'outline'}
              colorScheme="gray"
              maxW="3xs"
              rightIcon={
                <NextImage
                  src={'/myLogo.png'}
                  height="25px"
                  width="25px"
                  alt="myLogo"
                />
              }
            >
              Designed by
            </CustomButton>
          </CustomChakraNextLink>
        </Stack>
        <SocialIcons variant="solid" colorScheme="gray" />
      </HStack>
    </Box>
  );
};
