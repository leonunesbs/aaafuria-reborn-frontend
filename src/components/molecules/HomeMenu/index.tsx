import {
  CustomButton,
  CustomChakraNextLink,
  SejaSocioButton,
} from '@/components/atoms';
import { Box, Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { MdEmojiEvents, MdStore } from 'react-icons/md';

import { LoadingContext } from '@/contexts/LoadingContext';
import { GiPartyPopper } from 'react-icons/gi';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeMenuProps {}

export const HomeMenu = ({}: HomeMenuProps) => {
  const { setLoading } = useContext(LoadingContext);
  return (
    <Stack>
      <SejaSocioButton />
      <CustomChakraNextLink href="/intermed">
        <CustomButton
          leftIcon={<MdEmojiEvents size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
          variant="solid"
        >
          INTERMED
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/loja">
        <CustomButton
          leftIcon={<MdStore size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
        >
          Loja
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/activities">
        <CustomButton
          leftIcon={
            <>
              <FaVolleyballBall size="20px" />
              <Box ml={2} />
              <FaDrum size="20px" />
            </>
          }
        >
          Atividades
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/eventos">
        <CustomButton
          leftIcon={<GiPartyPopper size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
        >
          Eventos
        </CustomButton>
      </CustomChakraNextLink>
    </Stack>
  );
};
