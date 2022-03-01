import { Box, Stack } from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  SejaSocioButton,
} from '@/components/atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { MdEmojiEvents, MdStore } from 'react-icons/md';
import React, { useContext } from 'react';

import { GiPartyPopper } from 'react-icons/gi';
import { LoadingContext } from '@/contexts/LoadingContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeMenuProps {}

export const HomeMenu = ({}: HomeMenuProps) => {
  const { setLoading } = useContext(LoadingContext);
  return (
    <Stack>
      <SejaSocioButton />
      <CustomChakraNextLink href="/intermed">
        <CustomButtom
          leftIcon={<MdEmojiEvents size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
          variant="solid"
        >
          INTERMED
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/loja">
        <CustomButtom
          leftIcon={<MdStore size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
        >
          Loja
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/atividades">
        <CustomButtom
          leftIcon={
            <>
              <FaVolleyballBall size="20px" />
              <Box ml={2} />
              <FaDrum size="20px" />
            </>
          }
        >
          Atividades
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/eventos">
        <CustomButtom
          leftIcon={<GiPartyPopper size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
        >
          Eventos
        </CustomButtom>
      </CustomChakraNextLink>
    </Stack>
  );
};
