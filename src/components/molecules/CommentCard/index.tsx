import { CustomChakraNextLink } from '@/components/atoms';
import { ColorContext } from '@/contexts/ColorContext';
import { Box, Text, Textarea } from '@chakra-ui/react';
import { useContext } from 'react';
import { Card } from '..';

export type CommentProps = {
  id: string;
  author: {
    apelido: string;
  };
  description: string;
  createdAt: string;
};

export interface CommentCardProps {
  comment: {
    node: CommentProps;
  };
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <Textarea
        value={comment.node.description}
        isReadOnly
        focusBorderColor={green}
      />
      <Box mt={4}>
        <Text textAlign={'right'} fontSize="sm">
          <CustomChakraNextLink
            href={
              'https://diretoria.aaafuria.site/admin/core/socio/?q=18107053'
            }
            chakraLinkProps={{
              color: green,
              fontWeight: 'bold',
              _hover: {
                textDecoration: 'underline',
              },
            }}
          >
            {comment.node.author.apelido}
          </CustomChakraNextLink>
        </Text>
        <Text textAlign={'right'} fontSize="sm">
          {new Date(comment.node.createdAt as string).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo',
          })}
        </Text>
      </Box>
    </Card>
  );
};
