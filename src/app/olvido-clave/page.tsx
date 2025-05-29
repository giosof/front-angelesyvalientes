'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormEvent } from 'react';
import { Button, ButtonGroup, PinInput, Stack, Steps, Text } from "@chakra-ui/react";
import { loginUser } from "../helpers/api";

export default function Login() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('');
    
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
  
    const result = await loginUser(username, password);

    if (result.ok) {
      router.push('/main');
    } else {
      setErrorMessage(result.error || 'Error desconocido');
    }
  }

  return (
    <div>
      <main>
        <div className="flex flex-col  lg:flex-row h-screen w-full">
          {/* Imagen a la izquierda */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-4 m-20">
            <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
              <Image
                className="w-full h-full object-contain "
                src="/logo_corporacion_no_bg.png"
                alt="Logo Corporacion Angeles y Valientes"
                width={400}
                height={400}
                priority
              />
              <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">¿Cómo recuperar tu clave?</h2>
              <h3 className="text-lg text-gray-700 font-bold mb-6 text-center">Digita tu usuario. Al dar click en siguiente llegará un código al correo registrado. 
                Para completar el proceso de recuperación, digita tu código a continuación y cambia tu clave.</h3>
            </div>
          </div>
          
          {/* Formulario a la derecha */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-4 bg-amber-300">
            <Steps.Root
              orientation="vertical"
              height="400px"
              defaultStep={0}
              count={3}
            >
              <Steps.List>
                  <Steps.Item key="0" index={0} title="1. Validación usuario">
                    <Steps.Indicator />
                    <Steps.Title className="text-black">Validación usuario</Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
                  <Steps.Item key="1" index={1} title="2. Verificación código">
                    <Steps.Indicator />
                    <Steps.Title className="text-black">Verificación código</Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
                  <Steps.Item key="2" index={2} title="3. Cambio clave">
                    <Steps.Indicator />
                    <Steps.Title className="text-black">Cambio clave</Steps.Title>
                    <Steps.Separator />
                  </Steps.Item>
              </Steps.List>

              <Stack>
                  <Steps.Content key="0" index={0}>
                  <div className="mb-4">
                    <Text className="block text-gray-700 text-sm font-bold mb-8">Escriba el usuario que usa para ingresar a la aplicación</Text>
                    <input
                      className="bg-white w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Ingrese su usuario"
                      required
                      onInvalid={(e) =>
                        (e.target as HTMLInputElement).setCustomValidity('Por favor ingrese su usuario')
                      }
                      onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                    />
                  </div>
                  </Steps.Content>
                  <Steps.Content key="1" index={1}>
                  <Text className="block text-gray-700 text-sm font-bold mb-8">Se envió un mensaje al correo electrónico registrado. Digite el código de verificación.</Text>
                    <PinInput.Root size="lg">
                      <PinInput.HiddenInput />
                      <PinInput.Control>
                        <PinInput.Input index={0} />
                        <PinInput.Input index={1} />
                        <PinInput.Input index={2} />
                        <PinInput.Input index={3} />
                      </PinInput.Control>
                    </PinInput.Root>
                  </Steps.Content>
                  <Steps.Content key="2" index={2}>
                    description 3
                  </Steps.Content>
                <Steps.CompletedContent>Recuperación de clave exitosa</Steps.CompletedContent>

                <ButtonGroup size="sm" variant="outline">
                  <Steps.PrevTrigger asChild>
                    <Button>Anterior</Button>
                  </Steps.PrevTrigger>
                  <Steps.NextTrigger asChild>
                    <Button>Siguiente</Button>
                  </Steps.NextTrigger>
                </ButtonGroup>
              </Stack>
            </Steps.Root>

            <div className="w-full hidden max-w-md p-6 md:p-18 md:m-12 bg-white shadow-lg rounded-lg">
              {errorMessage && (
                <div className="mb-4 text-red-600 text-sm font-medium bg-red-100 p-2 rounded">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Usuario</label>
                  <input
                    className="bg-white w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Ingrese su usuario"
                    required
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('Por favor ingrese su usuario')
                    }
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                  />
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" type="submit">Enviar código</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
