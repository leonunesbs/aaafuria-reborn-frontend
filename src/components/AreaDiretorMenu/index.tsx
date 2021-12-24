import React from "react";
import router from "next/router";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { Divider, Stack, StackProps } from "@chakra-ui/react";
import { MdStore } from "react-icons/md";
import CustomButtom from "../CustomButtom";
import CustomChakraNextLink from "../CustomChakraNextLink";

type AreaDiretorMenuProps = StackProps;

function AreaDiretorMenu({ ...rest }: AreaDiretorMenuProps) {
  return (
    <Stack {...rest}>
      <CustomButtom
        leftIcon={<MdStore size="20px" />}
        onClick={() => router.push("/areadiretor/plantao")}
      >
        Plantão
      </CustomButtom>

      <Divider height="15px" />

      <CustomButtom
        leftIcon={<AiFillHome size="20px" />}
        colorScheme="gray"
        onClick={() => router.push("/")}
      >
        Voltar
      </CustomButtom>
      <CustomChakraNextLink href={`${process.env.BACKEND_DOMAIN}/admin`}>
        <CustomButtom
          leftIcon={<AiFillSetting size="20px" />}
          colorScheme="yellow"
          hasExternalIcon
          chakraLinkProps={{
            target: "_blank"
          }}
        >
          Painel
        </CustomButtom>
      </CustomChakraNextLink>
    </Stack>
  );
}

export default AreaDiretorMenu;
