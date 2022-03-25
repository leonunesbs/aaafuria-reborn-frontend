import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdReply, MdSend } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useRef } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomButton } from '@/components/atoms';

export interface CreateCommentProps {
  issueId: string;
  refetchIssue: () => void;
}

const CREATE_COMMENT = gql`
  mutation createComment($issueId: ID!, $description: String!) {
    createComment(issueId: $issueId, description: $description) {
      ok
    }
  }
`;

type Inputs = {
  description: string;
};

export const CreateComment = ({
  issueId,
  refetchIssue,
}: CreateCommentProps) => {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green, bg } = useContext(ColorContext);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [createComment, { loading: createCommentLoading }] = useMutation(
    CREATE_COMMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ description }) => {
      await createComment({
        variables: {
          issueId: issueId,
          description,
        },
      })
        .then(() => {
          toast({
            description: 'Comentário adicionado!',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetchIssue();
          reset();
          onClose();
        })
        .catch((error) => alert(error.message));
    },
    [createComment, issueId, onClose, refetchIssue, reset, toast],
  );
  return (
    <>
      <CustomButton
        aria-label="comment"
        leftIcon={<MdReply size="25px" />}
        onClick={onOpen}
      >
        Responder
      </CustomButton>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        size="md"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton />
            <DrawerHeader>Adicionar comentário</DrawerHeader>
            <DrawerBody>
              <Textarea
                placeholder="Digite aqui um comentário..."
                focusBorderColor={green}
                autoFocus
                {...register('description')}
              />
            </DrawerBody>

            <DrawerFooter>
              <CustomButton mr={3} colorScheme="gray" onClick={onClose}>
                Cancelar
              </CustomButton>
              <CustomButton
                leftIcon={<MdSend size="20px" />}
                variant={'solid'}
                type="submit"
                isLoading={createCommentLoading}
              >
                Enviar
              </CustomButton>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
