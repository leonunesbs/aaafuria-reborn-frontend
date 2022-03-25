import {
  Box,
  Collapse,
  Divider,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Card } from '..';
import { CustomButton } from '@/components/atoms';

export interface ClientInfoCardProps {
  isOpen: boolean;
  socioData: any;
}

export const ClientInfoCard = ({ isOpen, socioData }: ClientInfoCardProps) => {
  return (
    <Collapse in={isOpen} animateOpacity>
      <Card maxW="lg" mx="auto" mt={4}>
        <Text as="strong">Informações do cliente</Text>
        <Divider />
        <Stack mt={4}>
          <Skeleton isLoaded={socioData !== null}>
            <Text>{socioData?.matricula || '00000000'}</Text>
          </Skeleton>
          <Skeleton isLoaded={socioData !== null}>
            <Text>{socioData?.turma || 'MED 00'}</Text>
          </Skeleton>
          <Skeleton isLoaded={socioData !== null}>
            <Text>{socioData?.nome || 'NOME'}</Text>
          </Skeleton>
          <Skeleton isLoaded={socioData !== null}>
            <Box>
              {socioData?.isSocio ? (
                <CustomButton variant={'solid'}>Sócio ativo</CustomButton>
              ) : (
                <CustomButton variant={'solid'} colorScheme="red">
                  Sócio inativo
                </CustomButton>
              )}
            </Box>
          </Skeleton>
        </Stack>
      </Card>
    </Collapse>
  );
};
