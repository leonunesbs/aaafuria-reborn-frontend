import 'react-responsive-carousel/lib/styles/carousel.min.css';

import {
  CustomButton,
  CustomChakraNextLink,
  CustomDivider,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { Card, SejaSocioPricing } from '@/components/molecules';
import {
  Box,
  BoxProps,
  Center,
  chakra,
  Circle,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { forwardRef, useContext, useRef } from 'react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';

import { Layout } from '@/components/templates/Layout';
import { ColorContext } from '@/contexts/ColorContext';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import CountUp from 'react-countup';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';

type FeaturePostData = {
  id: string;
  title: string;
  content: string;
  image: string;
  buttonTarget: string;
};

type PartnershipsData = {
  id: string;
  name: string;
  socioBenefits: string;
  logo: string;
};
interface HomeProps {
  post: FeaturePostData;
  partnerships: {
    node: PartnershipsData;
  }[];
}

const HomeSection = forwardRef<HTMLDivElement, BoxProps>(
  ({ id, children, ...rest }: BoxProps, ref) => {
    return (
      <Box id={id} ref={ref} py={10} {...rest}>
        {children}
      </Box>
    );
  },
);
HomeSection.displayName = 'HomeSection';

function Home({ post, partnerships }: HomeProps) {
  const router = useRouter();
  const sejaSocioDiv = useRef<HTMLDivElement>(null);
  const postDiv = useRef<HTMLDivElement>(null);
  const featuresDiv = useRef<HTMLDivElement>(null);
  const partnershipsDiv = useRef<HTMLDivElement>(null);
  const { bg, green, invertedBg } = useContext(ColorContext);
  const ctaLogo = useColorModeValue('/logo-cinza.png', '/logo-branco.png');
  const ChakraNextImage = chakra(NextImage);

  return (
    <Layout title="Início">
      <HomeSection id="cta">
        <Grid templateColumns={['1fr', '1fr', '1fr', '2fr 3fr']}>
          <GridItem>
            <Stack justify={'center'} h="100%">
              <Stack>
                <Text fontSize={'lg'} as="h2"></Text>
                <Heading
                  as="h1"
                  fontSize={['4xl', '5xl']}
                  textColor={invertedBg}
                >
                  A
                  <Text as="span" textColor={green}>
                    {' '}
                    MAIOR{' '}
                  </Text>
                  DO PIAUÍ ESTÁ TE ESPERANDO!
                </Heading>
              </Stack>
              <Stack direction={['column', 'column', 'row']} maxW="md">
                <CustomButton
                  variant={'solid'}
                  onClick={() =>
                    sejaSocioDiv.current?.scrollIntoView({
                      block: 'start',
                      behavior: 'smooth',
                    })
                  }
                >
                  Seja Sócio!
                </CustomButton>
                <CustomButton
                  onClick={() =>
                    post
                      ? postDiv.current?.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        })
                      : featuresDiv.current?.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        })
                  }
                >
                  Explorar
                </CustomButton>
              </Stack>
            </Stack>
          </GridItem>
          <GridItem
            display={'flex'}
            justifyContent={['center', 'center', 'center', 'flex-end']}
          >
            <Box boxSize={['xs', 'md', 'xl', '3xl']} position="relative">
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={ctaLogo}
                layout="fill"
                objectFit="cover"
                src={ctaLogo}
                quality={10}
                alt="logo"
                mx="auto"
                mb={{ base: '8', md: '12' }}
                draggable={false}
              />
            </Box>
          </GridItem>
        </Grid>
      </HomeSection>
      <HomeSection id="stats" bgColor={green} textColor={bg} rounded="3xl">
        <Stack
          direction={['column', 'row']}
          justify="space-around"
          mx="auto"
          maxW="8xl"
        >
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp
                start={0}
                end={150}
                suffix="+"
                delay={1}
                duration={1.5}
              />
            </Text>
            <Text>Sócios ativos</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp start={0} end={10} suffix="+" delay={1.5} duration={1} />
            </Text>
            <Text>Modalidades</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp
                start={0}
                end={200}
                suffix="+"
                delay={1.2}
                duration={2}
              />
            </Text>
            <Text>Atletas e ritmistas</Text>
          </Box>
        </Stack>
      </HomeSection>
      {post && (
        <HomeSection id="post" ref={postDiv}>
          <Stack w="full">
            <HStack w={'full'} justify="space-around">
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
            </HStack>
            <Grid templateColumns={['1fr', '1fr', '1fr 1fr']}>
              <GridItem
                display={'flex'}
                justifyContent={['center', 'center', 'center', 'flex-start']}
              >
                <Box boxSize={['xs', 'md', 'xl', '3xl']} position="relative">
                  <ChakraNextImage
                    placeholder="blur"
                    blurDataURL={post.image}
                    layout="fill"
                    objectFit="cover"
                    src={post.image}
                    quality={20}
                    alt="logo"
                    draggable={false}
                    rounded="3xl"
                  />
                </Box>
              </GridItem>
              <GridItem>
                <Stack h="100%">
                  <Box>
                    <Heading as="h2">{post.title}</Heading>
                    <CustomDivider />
                  </Box>
                  <Textarea
                    value={post.content}
                    fontSize={'lg'}
                    lineHeight={2}
                    isReadOnly
                    _focus={{}}
                    _hover={{}}
                    p={0}
                    border=""
                    h="100%"
                  />
                  <Stack direction={['column', 'row', 'row', 'row']}>
                    <CustomButton
                      variant={'solid'}
                      onClick={() => sejaSocioDiv.current?.scrollIntoView()}
                    >
                      Seja Sócio
                    </CustomButton>
                    {post.buttonTarget && (
                      <CustomButton
                        variant={'outline'}
                        onClick={() => router.push(post.buttonTarget)}
                      >
                        Saiba mais
                      </CustomButton>
                    )}
                  </Stack>
                </Stack>
              </GridItem>
            </Grid>
            <HStack w={'full'} justify="space-around" mb={10}>
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
              <Circle size="15px" bgColor={green} />
            </HStack>
          </Stack>
        </HomeSection>
      )}
      <HomeSection ref={featuresDiv} id="features">
        <Grid templateColumns={['1fr', '1fr 1fr', '1fr 2fr']}>
          <GridItem>
            <Stack spacing={12}>
              <Box>
                <Heading as="h2">O MELHOR DA FÚRIA!</Heading>
                <CustomDivider />
              </Box>
              <Stack>
                <Card>
                  <HStack align="flex-start">
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="esportes"
                      icon={<MdStore size="25px" />}
                      onClick={() => router.push('/loja')}
                    />
                    <Stack p={2}>
                      <CustomChakraNextLink
                        href="/loja"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Loja
                        </Text>
                      </CustomChakraNextLink>
                      <Text mb={4}>
                        Os produtos mais bonitos do Norteste estão aqui.
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
                <Card>
                  <HStack align="flex-start">
                    <Stack>
                      <CustomIconButton
                        variant={'solid'}
                        aria-label="esportes"
                        icon={<FaVolleyballBall size="25px" />}
                        onClick={() => router.push('/activities')}
                      />

                      <CustomIconButton
                        variant={'solid'}
                        aria-label="bateria"
                        icon={<FaDrum size="25px" />}
                        onClick={() => router.push('/activities')}
                      />
                    </Stack>
                    <Stack p={2}>
                      <CustomChakraNextLink
                        href="/activities"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Atividades
                        </Text>
                      </CustomChakraNextLink>
                      <Text mb={4}>
                        Programação dos treinos de todas as modalidades e dos
                        ensaios da Carabina.
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
                <Card>
                  <HStack align="flex-start">
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="eventos"
                      icon={<GiPartyPopper size="25px" />}
                      onClick={() => router.push('/eventos')}
                    />
                    <Stack p={2}>
                      <CustomChakraNextLink
                        href="/eventos"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Eventos
                        </Text>
                      </CustomChakraNextLink>
                      <Text mb={4}>
                        Tenha uma experiência única com eventos padrão Fúria de
                        qualidade!
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
              </Stack>
              <CustomButton
                variant={'solid'}
                onClick={() =>
                  sejaSocioDiv.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                  })
                }
              >
                Quero ser Sócio!
              </CustomButton>
            </Stack>
          </GridItem>

          <GridItem
            display={'flex'}
            justifyContent={['center', 'center', 'center', 'flex-end']}
          >
            <Box boxSize={['xs', 'md', 'xl', '2xl']} position="relative">
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={'/calango-verde.png'}
                layout="fill"
                objectFit="cover"
                src={'/calango-verde.png'}
                quality={100}
                alt="logo"
                mx="auto"
                draggable={false}
              />
            </Box>
          </GridItem>
        </Grid>
      </HomeSection>

      <HomeSection
        ref={sejaSocioDiv}
        bgColor={green}
        id="seja-socio"
        rounded={'3xl'}
        px={2}
      >
        <PageHeading as="h2" textColor={bg}>
          Junte-se a nós, seja um <Text as="span">sócio Fúria</Text>!
        </PageHeading>
        <Text fontSize="xl" textColor={bg} textAlign={'center'} mb={10}>
          Escolha abaixo o plano que melhor se adequa a você!
        </Text>
        <Box>
          <SejaSocioPricing />
        </Box>
      </HomeSection>
      {partnerships.length > 0 && (
        <HomeSection ref={partnershipsDiv} bgColor={bg}>
          <Box maxW="7xl" mx="auto">
            <Carousel
              autoPlay
              stopOnHover
              infiniteLoop
              useKeyboardArrows
              showStatus={false}
              showArrows={false}
              showIndicators={false}
              showThumbs={false}
              dynamicHeight={false}
              ariaLabel="Partnerships"
            >
              {partnerships.map(({ node: partnership }) => (
                <Card key={partnership.id} m={2} maxW="lg" mx="auto">
                  <HStack>
                    <Center>
                      <Box boxSize="100px" position="relative">
                        <ChakraNextImage
                          src={
                            partnership.logo !== null
                              ? partnership.logo
                              : '/calango-verde.png'
                          }
                          placeholder="blur"
                          blurDataURL={
                            partnership.logo !== null
                              ? partnership.logo
                              : '/calango-verde.png'
                          }
                          layout="fill"
                          objectFit="cover"
                          quality={10}
                          alt={partnership.name}
                          mx="auto"
                          mb={{ base: '8', md: '12' }}
                          draggable={false}
                        />
                      </Box>
                    </Center>
                    <Stack textAlign={'left'}>
                      <Heading size="lg">
                        {partnership.name.toUpperCase()}
                      </Heading>
                    </Stack>
                  </HStack>
                </Card>
              ))}
            </Carousel>
          </Box>
        </HomeSection>
      )}
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { data: featurePostData } = await client.query({
    query: gql`
      query {
        featurePost {
          id
          title
          content
          image
          buttonTarget
        }
      }
    `,
  });
  const { data: partnershipsData } = await client.query({
    query: gql`
      query {
        allPartnerships {
          edges {
            node {
              id
              name
              socioBenefits
              logo
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      post: featurePostData.featurePost,
      partnerships: partnershipsData.allPartnerships.edges,
    },
    revalidate: 60 * 60 * 1, // Every 1 hour
  };
};

export default Home;
