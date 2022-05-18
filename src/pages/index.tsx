import {
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { Card, SejaSocioPricing } from '@/components/molecules';
import { Layout } from '@/components/templates/Layout';
import { ColorContext } from '@/contexts/ColorContext';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import {
  Box,
  Center,
  chakra,
  Circle,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { useContext, useRef } from 'react';
import CountUp from 'react-countup';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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

function Home({ post, partnerships }: HomeProps) {
  const sejaSocioDiv = useRef<HTMLDivElement>(null);
  const postDiv = useRef<HTMLDivElement>(null);
  const featuresDiv = useRef<HTMLDivElement>(null);
  const partnershipsDiv = useRef<HTMLDivElement>(null);
  const { bg, green } = useContext(ColorContext);
  const ctaLogo = useColorModeValue('/logo-cinza.png', '/logo-branco.png');
  const ChakraNextImage = chakra(NextImage);

  console.log(post);
  return (
    <Layout title="Início" px={0} py={0}>
      <Box py="12" px={{ base: '4', lg: '8' }}>
        <Stack
          direction={['column', 'column', 'row']}
          justify={'space-around'}
          align="center"
          spacing={8}
          maxW="8xl"
          mx="auto"
        >
          <Stack spacing={4} maxW="xl">
            <Stack>
              <Heading as="h1" fontSize={['4xl', '5xl']}>
                A MAIOR DO PIAUÍ ESTÁ TE ESPERANDO!
              </Heading>
              <Text fontSize={'lg'} as="h2">
                Você está a poucos cliques de ser Sócio da maior do Piauí.
              </Text>
              <Text as="h3">💚 1ºLugar Geral V Intermed NE</Text>
              <Text as="h3">🥁 1ºLugar Bateria III Intermed NE</Text>
            </Stack>
            <Stack>
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
                Ver mais
              </CustomButton>
            </Stack>
          </Stack>
          <Center>
            <Box boxSize={['xs', 'md', 'lg']} position="relative">
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
          </Center>
        </Stack>
      </Box>
      <Box bgColor={green} textColor={bg} py={12}>
        <Stack
          direction={['column', 'row']}
          spacing={6}
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
      </Box>
      {post && (
        <Box
          id="post"
          ref={postDiv}
          bgColor={bg}
          py={12}
          px={{ base: '4', lg: '8' }}
        >
          <HStack w={'full'} justify="space-around">
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
          </HStack>
          <Stack spacing={8} maxW="7xl" w="full" mx="auto" my={12}>
            <Stack
              w="full"
              justify="space-around"
              direction={['column', 'column', 'row']}
            >
              <Center>
                <Box
                  width={['400px', '500px', '550px']}
                  height={['400px', '500px', '550px']}
                  position="relative"
                >
                  <ChakraNextImage
                    placeholder="blur"
                    blurDataURL={post.image}
                    layout="fill"
                    objectFit="cover"
                    src={post.image}
                    quality={20}
                    alt="logo"
                    draggable={false}
                    rounded="md"
                  />
                </Box>
              </Center>
              <Stack justify={'space-between'}>
                <Stack justify={'center'} h="100%" my={4}>
                  <Heading as="h2" textAlign={['left', 'left', 'right']}>
                    {post.title}
                  </Heading>
                  <Text as="h4" maxW="md" textAlign={['left', 'left', 'right']}>
                    {post.content}
                  </Text>
                </Stack>
                <Stack>
                  <CustomButton
                    variant={'solid'}
                    onClick={() => sejaSocioDiv.current?.scrollIntoView()}
                  >
                    Seja sócio
                  </CustomButton>
                  {post.buttonTarget && (
                    <CustomChakraNextLink href={post.buttonTarget}>
                      <CustomButton variant={'outline'}>
                        Saiba mais
                      </CustomButton>
                    </CustomChakraNextLink>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <HStack w={'full'} justify="space-around" mb={10}>
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
            <Circle size="15px" bgColor={green} />
          </HStack>
        </Box>
      )}
      <Box ref={featuresDiv} id="features" py={12} px={{ base: '4', lg: '8' }}>
        <Stack
          direction={['column', 'column', 'row']}
          justify={'space-around'}
          align="center"
          spacing={8}
          maxW="8xl"
          mx="auto"
        >
          <Stack spacing={12}>
            <Stack>
              <Heading as="h2">O MELHOR DA FÚRIA!</Heading>
              <Text fontSize={'lg'} as="h3">
                A seguir você encontrará nossas atividades, produtos e eventos.
              </Text>
            </Stack>
            <Stack>
              <Card maxW="xl">
                <HStack align="flex-start">
                  <CustomChakraNextLink href={'/loja'}>
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="esportes"
                      icon={<MdStore size="25px" />}
                    />
                  </CustomChakraNextLink>
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
              <Card maxW="xl">
                <HStack align="flex-start">
                  <Stack>
                    <CustomChakraNextLink
                      href={'/atividades?categoria=Esporte'}
                    >
                      <CustomIconButton
                        variant={'solid'}
                        aria-label="esportes"
                        icon={<FaVolleyballBall size="25px" />}
                      />
                    </CustomChakraNextLink>
                    <CustomChakraNextLink
                      href={'/atividades?categoria=Bateria'}
                    >
                      <CustomIconButton
                        variant={'solid'}
                        aria-label="bateria"
                        icon={<FaDrum size="25px" />}
                      />
                    </CustomChakraNextLink>
                  </Stack>
                  <Stack p={2}>
                    <CustomChakraNextLink
                      href="/atividades"
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
              <Card maxW="xl">
                <HStack align="flex-start">
                  <CustomChakraNextLink href={'eventos'}>
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="eventos"
                      icon={<GiPartyPopper size="25px" />}
                    />
                  </CustomChakraNextLink>
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
          </Stack>
          <Center>
            <Box
              width={['200px', '230px', '400px']}
              height={['210px', '240px', '410px']}
              position="relative"
            >
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={'/calango-verde.png'}
                layout="fill"
                objectFit="cover"
                src={'/calango-verde.png'}
                quality={40}
                alt="logo"
                mx="auto"
                mb={{ base: '8', md: '12' }}
                draggable={false}
              />
            </Box>
          </Center>
        </Stack>
        <Box maxW="xl" mx="auto" mt={6}>
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
        </Box>
      </Box>

      <Box ref={sejaSocioDiv} bgColor={green} id="seja-socio" py={12} px={2}>
        <PageHeading as="h2" textColor={bg}>
          Junte-se a nós, seja um <Text as="span">sócio Fúria</Text>!
        </PageHeading>
        <Text fontSize="xl" textColor={bg} textAlign={'center'} mb={10}>
          Escolha abaixo o plano que melhor se adequa a você!
        </Text>
        <Box px={[0, 0, 8]}>
          <SejaSocioPricing />
        </Box>
      </Box>
      {partnerships.length > 0 && (
        <Box ref={partnershipsDiv} bgColor={bg} py={2} px={2}>
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
        </Box>
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
