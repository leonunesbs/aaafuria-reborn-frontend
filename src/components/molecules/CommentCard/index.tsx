import { Box, Text, Textarea } from '@chakra-ui/react';

import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomChakraNextLink } from '@/components/atoms';
import { ICommentType } from '@/pages/ajuda/IIssueType';
import { useContext } from 'react';

export interface CommentCardProps {
  comment: {
    node: ICommentType;
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
        minH="3xs"
      />
      <Box mt={4}>
        <Text textAlign={'right'} fontSize="sm">
          <CustomChakraNextLink
            href={`${process.env.DIRETORIA_DOMAIN}/admin/core/socio/?q=18107053`}
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
          <Text as="time" dateTime={comment.node.createdAt}>
            {new Date(comment.node.createdAt as string).toLocaleString(
              'pt-BR',
              {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
              },
            )}
          </Text>
        </Text>
      </Box>
    </Card>
  );
};
