import {
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { Card, SejaSocioPricing } from '@/components/molecules';
import { Layout } from '@/components/templates/Layout';
import { ColorContext } from '@/contexts/ColorContext';
import {
  Box,
  Center,
  chakra,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { useContext, useRef } from 'react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';

function Home() {
  const sejaSocioDiv = useRef<HTMLDivElement>(null);
  const featuresDiv = useRef<HTMLDivElement>(null);
  const { bg, green } = useContext(ColorContext);
  const ChakraNextImage = chakra(NextImage);
  return (
    <Layout title="Início" px={0} py={0}>
      <Box py="12" px={{ base: '4', lg: '8' }}>
        <Stack
          direction={['column-reverse', 'column-reverse', 'row']}
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
                  featuresDiv.current?.scrollIntoView({
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
            <Box
              width={['280px', '380px', '560px']}
              height={['180px', '240px', '360px']}
              position="relative"
            >
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={'/logo-aaafuria-h.webp'}
                layout="fill"
                objectFit="cover"
                src={'/logo-aaafuria-h.webp'}
                quality={1}
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
              150+
            </Text>
            <Text>Sócios ativos</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              10+
            </Text>
            <Text>Modalidades</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              200+
            </Text>
            <Text>Atletas e ritmistas</Text>
          </Box>
        </Stack>
      </Box>
      <Box ref={featuresDiv} id="features" py="12" px={{ base: '4', lg: '8' }}>
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
                quality={1}
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
        <SejaSocioPricing />
      </Box>
    </Layout>
  );
}

export default Home;
