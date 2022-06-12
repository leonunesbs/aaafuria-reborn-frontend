import { Box, Stack } from '@chakra-ui/react';
import { CustomButton, SejaSocioButton } from '@/components/atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { MdEmojiEvents, MdStore } from 'react-icons/md';

import { GiPartyPopper } from 'react-icons/gi';
import { LoadingContext } from '@/contexts/LoadingContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeMenuProps {}

export const HomeMenu = ({}: HomeMenuProps) => {
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);
  return (
    <Stack>
      <SejaSocioButton />
      <CustomButton
        leftIcon={<MdEmojiEvents size="20px" />}
        onClick={() => {
          setLoading(true);
          router.push('/intermed');
        }}
        variant="solid"
      >
        INTERMED
      </CustomButton>
      <CustomButton
        leftIcon={<MdStore size="20px" />}
        onClick={() => {
          setLoading(true);
          router.push('/loja');
        }}
      >
        Loja
      </CustomButton>
      <CustomButton
        leftIcon={
          <>
            <FaVolleyballBall size="20px" />
            <Box ml={2} />
            <FaDrum size="20px" />
          </>
        }
        onClick={() => router.push('/activities')}
      >
        Atividades
      </CustomButton>
      <CustomButton
        leftIcon={<GiPartyPopper size="20px" />}
        onClick={() => {
          setLoading(true);
          router.push('/eventos');
        }}
      >
        Eventos
      </CustomButton>
    </Stack>
  );
};
