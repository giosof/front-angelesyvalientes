'use client'

import { AspectRatio, Button, CloseButton, Dialog, HStack, Portal, Switch, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react/image";
import { useEffect, useState } from "react";
import { fetchPersonInfo } from "../helpers/api";
import Link from "next/link";
import PhotoDropzone from "./photoDropzone";

const PersonSideNav = ({personId} : {personId: string}) => {
  const [persona, setPersona] = useState<any>({});

  useEffect(() => {
    async function getInfo() {
      const resPersona = await fetchPersonInfo(personId)
      setPersona(resPersona)
    }

    if (personId && personId !== "0") {
      getInfo()
    }
    
  }, [])

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
          <div className="justify-items-center mb-8">
            <Image className="size-[10rem] rounded-full rotate-[15deg] mb-2" alt="Foto Persona" src={`https://lh3.googleusercontent.com/d/${persona.urlFoto}`} />
            {/*<div className="size-[10rem] bg-red-200 rounded-full mb-2 items-center">
            </div>*/}
            <Dialog.Root placement="center">
              <Dialog.Trigger asChild>
                <Button variant="outline" size="sm">
                  Editar Foto
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Body pt="4">
                      <Dialog.Title>Foto de Perfil</Dialog.Title>
                      <Dialog.Description mb="4">
                        Arrastra o sube la foto de perfil de la persona
                      </Dialog.Description>
                      <AspectRatio ratio={4 / 3} rounded="lg" overflow="hidden">
                        <PhotoDropzone personId={personId} />
                      </AspectRatio>
                    </Dialog.Body>
                    <Dialog.CloseTrigger top="0" insetEnd="-12" asChild>
                      <CloseButton bg="bg" size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
            {/*<iframe src="https://drive.google.com/file/d/1h-G0jGKPPFprWBBzDye6iA_SxO2LCqxS/preview" width="200" height="200" allow="autoplay"></iframe>*/}
            <p className="text-[15px] ml-3 text-black font-semibold">{persona.txPrimerNombre} {persona.txSegundoNombre}</p>
            <p className="text-[15px] ml-3 text-black font-semibold">{persona.txPrimerApellido} {persona.txSegundoApellido}</p>
          </div>
          {/*<Image class="w-full justify-center" src="/logo-corporacion.jpeg" alt="Logo" width={60} height={60} />*/}
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0">
            <HStack gap="8">
              <Text className="text-md font-semibold text-gray-600 dark:text-stone-700">Activo</Text>
              <Switch.Root size='md'>
                <Switch.HiddenInput />
                <Switch.Control className="bg-red-700"/>
                <Switch.Label />
              </Switch.Root>
            </HStack>
            <Link href={`/main/people/${personId}`} className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Datos básicos</p>
            </Link>
            <HStack gap="8">
              <Text  className="text-md font-semibold text-gray-600 dark:text-stone-700">Valiente</Text>
              <Switch.Root  size='md'>
                <Switch.HiddenInput />
                <Switch.Control className="bg-red-700"/>
                <Switch.Label />
              </Switch.Root>
            </HStack>
            <Link href={`/main/people/${personId}/valiente`} className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Datos personales</p>
            </Link>
            <Link href={`/main/people/${personId}/valiente/vivienda`} className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Vivienda</p>
            </Link>
            <Link href="" className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Estudios</p>
            </Link>
            
            <a href="" className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Informes Clínicos</p>
            </a>
            <a href="" className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Documentación</p>
            </a>
            <a href="" className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
              <p className="hidden md:block">Programas</p>
            </a>
            <HStack gap="8">
              <Text  className="text-md font-semibold text-gray-600 dark:text-stone-700">Ángel</Text>
              <Switch.Root size='md'>
                <Switch.HiddenInput />
                <Switch.Control className="bg-red-700"/>
                <Switch.Label />
              </Switch.Root>
            </HStack>
            <div className="hidden h-auto w-full w-full grow md:block"></div>
          </div>
        </div>
    );
};

export default PersonSideNav;