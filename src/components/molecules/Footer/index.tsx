import { Box, Circle, HStack, Stack, Text, chakra } from '@chakra-ui/react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomButton } from '@/components/atoms/CustomButton';
import { CustomChakraNextLink } from '@/components/atoms';
import NextImage from 'next/image';
import { SocialIcons } from '..';
import { useContext } from 'react';
import { useRouter } from 'next/router';

export const Footer = () => {
  const router = useRouter();
  const { green, bg } = useContext(ColorContext);
  const ChakraNextImage = chakra(NextImage);
  return (
    <Box as="footer" role={'contentinfo'} bg={green} py={12}>
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
            maxW="150px"
            rightIcon={
              <NextImage
                src={'/myLogo.png'}
                height="25px"
                width="25px"
                alt="myLogo"
              />
            }
            justifyContent="flex-start"
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
