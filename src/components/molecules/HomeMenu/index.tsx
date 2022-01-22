import React from 'react';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';
import { Box, Stack } from '@chakra-ui/react';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
export interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeMenu = ({ setLoading }: HomeMenuProps) => {
  return (
    <Stack>
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
