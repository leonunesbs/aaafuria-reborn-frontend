import { CustomButtom, PageHeading } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Table,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { MdCheck } from 'react-icons/md';

const INGRESSO_BY_ID = gql`
  query ingressoById($id: ID!) {
    ingressoById(id: $id) {
      id
      lote {
        nome
      }
      status
      dataCompra
      participante {
        nome
        categoria
        rg
        cpf
        dataNascimento
        socio {
          nome
          matricula
          turma
        }
      }
    }
  }
`;
const INVALIDAR_INGRESSO = gql`
  mutation invalidarIngresso($id: ID!) {
    invalidarIngresso(id: $id) {
      ok
    }
  }
`;

interface IngressoProps {
  id: string;
  lote: {
    nome: string;
  };
  status: string;
  dataCompra: string;
  participante: {
    nome: string;
    categoria: string;
    rg: string;
    cpf: string;
    dataNascimento: string;
    socio: {
      nome: string;
      matricula: string;
      turma: string;
    };
  };
}

const Ingresso = () => {
  const router = useRouter();
  const { id = '0' } = router.query;
  const { token } = useContext(AuthContext);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();

  const { data, loading } = useQuery(INGRESSO_BY_ID, {
    variables: { id },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const [invalidarIngresso] = useMutation(INVALIDAR_INGRESSO, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const { ingressoById: ingresso }: { ingressoById: IngressoProps } =
    (data && data) || {};

  const handleInvalidarIngresso = useCallback(() => {
    onClose();
    invalidarIngresso({
      variables: { id },
    }).then(
      ({
        data: {
          invalidarIngresso: { ok },
        },
      }) => {
        if (ok) {
          toast({
            title: 'Ingresso invalidado com sucesso!',
            status: 'success',
            duration: 5000,
            position: 'top-left',
            isClosable: true,
          });
          router.reload();
        }
      },
    );
  }, [id, invalidarIngresso, onClose, router, toast]);

  useEffect(() => {
    if (!loading && data.ingressoById === null) {
      toast({
        description: 'Ingresso não encontrado.',
        status: 'error',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
    }
  }, [data, loading, toast]);

  return (
    <Layout title="Ingresso">
      <Box maxW="xl" mx="auto">
        <PageHeading>Checagem de Ingressos</PageHeading>
        <Card
          textAlign={'center'}
          variant={
            (ingresso?.status == 'PAGO' && 'success') ||
            (ingresso?.status == 'INVALIDO' && 'error') ||
            'default'
          }
        >
          <Table mb={4}>
            <Tr>
              <Td>
                <b>Lote: </b>
              </Td>
              <Td>{ingresso?.lote?.nome}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Status: </b>
              </Td>
              <Td>{ingresso?.status}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Data da Compra: </b>
              </Td>
              <Td>
                {new Date(ingresso?.dataCompra).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'America/Sao_Paulo',
                })}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <b>Turma: </b>
              </Td>
              <Td>{ingresso?.participante?.socio?.turma}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Nome: </b>
              </Td>
              <Td>{ingresso?.participante?.nome}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Categoria: </b>
              </Td>
              <Td>{ingresso?.participante?.categoria}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>RG: </b>
              </Td>
              <Td>{ingresso?.participante?.rg}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>CPF: </b>
              </Td>
              <Td>{ingresso?.participante?.cpf}</Td>
            </Tr>
            <Tr>
              <Td>
                <b>Data de Nascimento: </b>
              </Td>
              <Td>{ingresso?.participante?.dataNascimento}</Td>
            </Tr>
          </Table>
          {ingresso?.status == 'PAGO' && (
            <CustomButtom onClick={onOpen}>Invalidar ingresso</CustomButtom>
          )}
          {ingresso?.status == 'INVALIDO' && (
            <CustomButtom colorScheme="red">INGRESSO INVÁLIDO</CustomButtom>
          )}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Invalidar ingresso
                </AlertDialogHeader>

                <AlertDialogBody>
                  Confirmar presença do Participante e invalidar o ingresso?
                  Esta ação não poderá ser desfeita.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <CustomButtom
                    ref={cancelRef}
                    colorScheme="gray"
                    onClick={onClose}
                  >
                    Cancel
                  </CustomButtom>
                  <CustomButtom
                    colorScheme="green"
                    onClick={handleInvalidarIngresso}
                    ml={3}
                    leftIcon={<MdCheck size="25px" />}
                  >
                    Invalidar
                  </CustomButtom>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Card>
      </Box>
    </Layout>
  );
};

export default Ingresso;
