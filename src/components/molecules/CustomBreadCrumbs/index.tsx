import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useContext, useState } from 'react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomChakraNextLink } from '@/components/atoms';
import { useRouter } from 'next/router';

export const CustomBreadCrumbs = ({ hrefs }: ICustomBreadCrumbs) => {
  const router = useRouter();
  const { bg, green } = useContext(ColorContext);
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  if (!hrefs) {
    return null;
  }
  return (
    <Breadcrumb p={[2, 4]} spacing="8px" separator="&gt;" bg={bg}>
      <BreadcrumbItem>
        <CustomChakraNextLink href="/">
          <BreadcrumbLink>Início</BreadcrumbLink>
        </CustomChakraNextLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <CustomChakraNextLink
          href="/loja"
          chakraLinkProps={
            isCurrentPage
              ? {
                  fontWeight: 'black',
                  color: green,
                }
              : {}
          }
        >
          <BreadcrumbLink>Loja</BreadcrumbLink>
        </CustomChakraNextLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
