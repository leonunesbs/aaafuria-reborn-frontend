import { Box, chakra, HStack, Stack, Text } from '@chakra-ui/react';

import { CustomChakraNextLink } from '@/components/atoms';
import { CustomButton } from '@/components/atoms/CustomButton';
import { ColorContext } from '@/contexts/ColorContext';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { SocialIcons } from '..';

export const Footer = () => {
  const router = useRouter();
  const { green, bg } = useContext(ColorContext);
  const ChakraNextImage = chakra(NextImage);
  return (
    <Box as="footer" role={'contentinfo'} bg={green}>
      <HStack
        py={4}
        w="full"
        mx="auto"
        justify={'space-between'}
        px={{ base: '4', lg: '8' }}
      >
        <Stack>
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
              alt="footer-logo"
              mb={{ base: '8', md: '12' }}
              draggable={false}
              filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
            />
          </Box>
          <Text letterSpacing={2} textColor={bg}>
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

          <CustomButton
            aria-label="designer"
            variant={'solid'}
            size={'xs'}
            rightIcon={
              <Box boxSize="20px" position="relative">
                <NextImage src={'/myLogo.png'} alt="myLogo" layout="fill" />
              </Box>
            }
            onClick={() => router.push('https://github.com/leonunesbs')}
          >
            Designed by
          </CustomButton>
        </Stack>
        <SocialIcons variant="solid" />
      </HStack>
    </Box>
  );
};
