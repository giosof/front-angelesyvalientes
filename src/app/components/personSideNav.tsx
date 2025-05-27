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
import { FiMenu, FiX } from "react-icons/fi";
import { Image } from "@chakra-ui/react/image";
import { useEffect, useState } from "react";
import { fetchPersonInfo } from "../helpers/api";
import Link from "next/link";
import PhotoDropzone from "./photoDropzone";

const PersonSideNav = ({ personId }: { personId: string }) => {
  const [persona, setPersona] = useState<any>({});
  const { open, onToggle } = useDisclosure();
  const [isValiente, setIsValiente] = useState(false);

  useEffect(() => {
    async function getInfo() {
      const resPersona = await fetchPersonInfo(personId);
      setPersona(resPersona);
      setIsValiente(!!resPersona.clasificacionValiente);
    }

    if (personId && personId !== "0") {
      getInfo();
    }
  }, []);

  const handleValienteToggle = (details: { checked: boolean }) => {
    setIsValiente(details.checked);
  };

  return (
    <div className="flex md:h-full flex-col px-3 py-4 md:px-2 md:overflow-y-auto overflow-hidden">
      {/* App bar style header */}
      <div className="flex md:w-full md:justify-items-center justify-between mb-4">
        <div className="flex md:w-full md:flex-col flex-row md:items-center justify-items-center md:gap-3 mb-4 gap-6">
          {/* Imagen */}
          <Image
            className="w-24 h-24 md:size-[10rem] rounded-full object-cover md:mb-3 mb-0 mr-4 rotate-[10deg]"
            alt="Foto Persona"
            src={`https://lh3.googleusercontent.com/a-/${persona.urlFoto}`}
          />

          <div className="flex flex-col md:items-center">
            {/* Dialog para editar foto */}
            <Dialog.Root placement="center">
              <Dialog.Trigger asChild>
                <Button variant="outline" size="sm" className="mb-2 ms-6 md:self-start">
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

            {/* Nombre y Apellidos */}
            <p className="text-[14px] font-semibold text-black">{persona.txPrimerNombre} {persona.txSegundoNombre}</p>
            <p className="text-[14px] font-semibold text-black">{persona.txPrimerApellido} {persona.txSegundoApellido}</p>
          </div>
        </div>

        {/* Menu toggle for mobile */}
        <IconButton
          aria-label="Toggle Menu"
          className="md:hidden"
          size="sm"
          onClick={onToggle}
        >
          {open ? <FiX /> : <FiMenu />}
        </IconButton>
      </div>

      {/* Menú contextual para móvil */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-lg p-4">
            <div className="flex justify-end mb-4">
              <IconButton
                aria-label="Close Menu"
                size="sm"
                onClick={onToggle}
              >
                <FiX />
              </IconButton>
            </div>
            <div className="flex flex-col space-y-4">
              {/* Contenido del menú móvil */}
              <HStack gap="8">
                <Text className="text-md font-semibold text-gray-600">Activo</Text>
                <Switch.Root size="md" defaultChecked={persona.activo}>
                  <Switch.HiddenInput />
                  <Switch.Control className="bg-red-700" />
                  <Switch.Label />
                </Switch.Root>
              </HStack>

              <Link
                href={`/main/people/${personId}`}
                className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                onClick={onToggle}
              >
                Datos básicos
              </Link>

              <HStack gap="8">
                <Text className="text-md font-semibold text-gray-600">Valiente</Text>
                <Switch.Root 
                  size="md" 
                  defaultChecked={isValiente}
                  onCheckedChange={handleValienteToggle}
                >
                  <Switch.HiddenInput />
                  <Switch.Control className="bg-red-700" />
                  <Switch.Label />
                </Switch.Root>
              </HStack>

              {isValiente && (
                <>
                  <Link
                    href={`/main/people/${personId}/valiente`}
                    className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                    onClick={onToggle}
                  >
                    Datos personales
                  </Link>

                  {persona.clasificacionValiente && (
                    <>
                      <Link
                        href={`/main/people/${personId}/valiente/vivienda`}
                        className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                        onClick={onToggle}
                      >
                        Vivienda
                      </Link>

                      <Link
                        href={`/main/people/${personId}/valiente/estudios`}
                        className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                        onClick={onToggle}
                      >
                        Estudios
                      </Link>

                      <Link
                        href={`/main/people/${personId}/valiente/clinicos`}
                        className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                        onClick={onToggle}
                      >
                        Informes Clínicos
                      </Link>

                      <Link
                        href={`/main/people/${personId}/valiente/documentacion`}
                        className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                        onClick={onToggle}
                      >
                        Documentación
                      </Link>

                      <Link
                        href={`/main/people/${personId}/valiente/clases`}
                        className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                        onClick={onToggle}
                      >
                        Gestión de Clases
                      </Link>
                    </>
                  )}
                </>
              )}

              <HStack gap="8">
                <Text className="text-md font-semibold text-gray-600">Ángel</Text>
                <Switch.Root size="md">
                  <Switch.HiddenInput />
                  <Switch.Control className="bg-red-700" />
                  <Switch.Label />
                </Switch.Root>
              </HStack>

              <Link
                href={`/main/people/${personId}/angel/donaciones`}
                className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                onClick={onToggle}
              >
                Donaciones
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Menú desktop */}
      <div className="hidden md:flex flex-col space-y-2">
        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600">Activo</Text>
          <Switch.Root size="md" defaultChecked={persona.activo}>
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>

        <Link
          href={`/main/people/${personId}`}
          className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
        >
          Datos básicos
        </Link>

        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600">Valiente</Text>
          <Switch.Root 
            size="md" 
            defaultChecked={isValiente}
            onCheckedChange={handleValienteToggle}
          >
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>

        {isValiente && (
          <>
            <Link
              href={`/main/people/${personId}/valiente`}
              className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
            >
              Datos personales
            </Link>

            {persona.clasificacionValiente && (
              <>
                <Link
                  href={`/main/people/${personId}/valiente/vivienda`}
                  className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                >
                  Vivienda
                </Link>

                <Link
                  href={`/main/people/${personId}/valiente/estudios`}
                  className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                >
                  Estudios
                </Link>

                <Link
                  href={`/main/people/${personId}/valiente/clinicos`}
                  className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                >
                  Informes Clínicos
                </Link>

                <Link
                  href={`/main/people/${personId}/valiente/documentacion`}
                  className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                >
                  Documentación
                </Link>

                <Link
                  href={`/main/people/${personId}/valiente/clases`}
                  className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
                >
                  Gestión de Clases
                </Link>
              </>
            )}
          </>
        )}

        <HStack gap="8">
          <Text className="text-md font-semibold text-gray-600">Ángel</Text>
          <Switch.Root size="md">
            <Switch.HiddenInput />
            <Switch.Control className="bg-red-700" />
            <Switch.Label />
          </Switch.Root>
        </HStack>

        <Link
          href={`/main/people/${personId}/angel/donaciones`}
          className="flex h-[48px] items-center justify-start gap-2 rounded-md bg-amber-50 p-3 text-m font-bold hover:bg-red-700 hover:text-white"
        >
          Donaciones
        </Link>
      </div>
    </div>
  );
};

export default PersonSideNav;
