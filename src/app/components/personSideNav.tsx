'use client'

import {
  AspectRatio,
  Button,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Portal,
  Switch,
  Text,
  useDisclosure,
  VStack,
  Box,
} from "@chakra-ui/react";
import { FiMenu, FiX } from "react-icons/fi"; // ← aquí los nuevos iconos
import { Image } from "@chakra-ui/react/image";
import { useEffect, useState } from "react";
import { fetchPersonInfo } from "../helpers/api";
import Link from "next/link";
import PhotoDropzone from "./photoDropzone";

const PersonSideNav = ({ personId }: { personId: string }) => {
  const [persona, setPersona] = useState<any>({});
  const { open, onToggle } = useDisclosure();

  useEffect(() => {
    async function getInfo() {
      const resPersona = await fetchPersonInfo(personId);
      setPersona(resPersona);
    }

    if (personId && personId !== "0") {
      getInfo();
    }
  }, []);

  return (
    <div className="flex md:h-full flex-col px-3 py-4 md:px-2 md:overflow-y-auto overflow-hidden">
      {/* App bar style header */}
      <div className="flex md:w-full md:justify-items-center justify-between mb-4">
        <div className="flex md:w-full md:flex-col flex-row md:items-center justify-items-center md:gap-3 mb-4 gap-6">
          {/* Imagen */}
          <Image
            className="w-24 h-24 md:size-[10rem] rounded-full object-cover md:mb-3 mb-0 mr-4 rotate-[10deg]" // Tamaño de la imagen y márgenes
            alt="Foto Persona"
            src={`https://lh3.googleusercontent.com/d/${persona.urlFoto}`}
          />
          
          {/* Nombre y Apellidos */}
          <div className="flex flex-col md:items-center ">
            <p className="text-[14px] font-semibold text-black">{persona.txPrimerNombre} {persona.txSegundoNombre}</p>
            <p className="text-[14px] font-semibold text-black">{persona.txPrimerApellido} {persona.txSegundoApellido}</p>
          </div>
        </div>

        {/* Menu toggle for mobile */}
        <IconButton
          aria-label="Toggle Menu"
          className="md:hidden"
          size="sm"
          onClick={onToggle}>
            {open ? <FiX /> : <FiMenu />}
        </IconButton>
      </div>

      {/* Dialog para editar foto */}
      <Dialog.Root placement="center">
        <Dialog.Trigger asChild>
          <Button variant="outline" size="sm" className="mb-4 md:self-start">
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

      {/* Menú (Oculto en pantallas pequeñas y visible cuando el estado isOpen es true) */}
      <div
        className={`flex flex-col space-y-2 mt-4 md:flex-row md:space-x-4 md:mt-0 ${open ? 'block' : 'hidden'} md:block`}
      >
        {/* Switches y Links */}
        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600 dark:text-stone-700">Activo</Text>
          <Switch.Root size="md">
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>

        <Link
          href={`/main/people/${personId}`}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Datos básicos</p>
        </Link>

        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600 dark:text-stone-700">Valiente</Text>
          <Switch.Root size="md">
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>

        <Link
          href={`/main/people/${personId}/valiente`}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Datos personales</p>
        </Link>

        <Link
          href={`/main/people/${personId}/valiente/vivienda`}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Vivienda</p>
        </Link>

        <Link
          href={`/main/people/${personId}/valiente/estudios`}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Estudios</p>
        </Link>

        <a
          href=""
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Informes Clínicos</p>
        </a>

        <a
          href=""
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Documentación</p>
        </a>

        <a
          href=""
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg_amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white md:justify-start"
        >
          <p className="hidden md:block">Programas</p>
        </a>

        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600 dark:text-stone-700">Ángel</Text>
          <Switch.Root size="md">
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>
      </div>
    </div>
  );
};

export default PersonSideNav;
