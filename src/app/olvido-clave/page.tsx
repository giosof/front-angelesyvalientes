'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormEvent } from 'react';
import { Button, ButtonGroup, PinInput, Stack, Text, Input, Box } from "@chakra-ui/react";
import { Alert, AlertTitle } from '@chakra-ui/alert';
import { verificarUsuario, actualizarContrasena } from "../helpers/api";

export default function OlvidoClave() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Paso 1: Validar usuario
  const handleVerificarUsuario = async () => {
    setMessage('');
    if (!username) {
      setMessage('Por favor ingrese su usuario');
      return;
    }
    const result = await verificarUsuario(username);
    if (result && typeof result === 'string' && result.toLowerCase().includes('código')) {
      setMessage(result);
      setCurrentStep(1);
    } else {
      setMessage(result || 'Error al verificar el usuario');
    }
  };

  // Paso 2: Validar código
  const handleVerificarCodigo = () => {
    setMessage('');
    if (codigoVerificacion.length !== 4) {
      setMessage('Por favor ingrese el código completo');
      return;
    }
    setCurrentStep(2);
  };

  // Paso 3: Cambiar clave
  const handleActualizarContrasena = async () => {
    setMessage('');
    if (!nuevaContrasena || !confirmarContrasena) {
      setMessage('Por favor ingrese y confirme la nueva contraseña');
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    const result = await actualizarContrasena(username, codigoVerificacion, nuevaContrasena);
    if (result && typeof result === 'string' && result.toLowerCase().includes('actualizada')) {
      setSuccess(true);
      setMessage(result);
    } else {
      setMessage(result || 'Error al actualizar la contraseña');
    }
  };

  return (
    <div>
      <main>
        <div className="flex flex-col lg:flex-row h-screen w-full">
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
            <div className="w-full max-w-md">
              {/* Indicador de pasos manual */}
              <div className="flex flex-col items-start mb-8">
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mr-3 ${currentStep === 0 ? 'bg-red-600' : 'bg-gray-400'}`}>1</div>
                  <span className={`font-semibold ${currentStep === 0 ? 'text-red-700' : 'text-gray-700'}`}>Validación usuario</span>
                </div>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mr-3 ${currentStep === 1 ? 'bg-red-600' : 'bg-gray-400'}`}>2</div>
                  <span className={`font-semibold ${currentStep === 1 ? 'text-red-700' : 'text-gray-700'}`}>Verificación código</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mr-3 ${currentStep === 2 ? 'bg-red-600' : 'bg-gray-400'}`}>3</div>
                  <span className={`font-semibold ${currentStep === 2 ? 'text-red-700' : 'text-gray-700'}`}>Cambio clave</span>
                </div>
              </div>
              <Box>
                {currentStep === 0 && (
                  <>
                    {message && (
                      <Alert status={message.toLowerCase().includes('código') ? 'success' : 'error'} mt={4} borderRadius="md">
                        <AlertTitle>{message}</AlertTitle>
                      </Alert>
                    )}
                    <Text className="block text-gray-700 text-sm font-bold mb-8">Escriba el usuario que usa para ingresar a la aplicación</Text>
                    <Input
                      className="bg-white w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      required
                    />
                    <Button mt={4} colorScheme="red" onClick={handleVerificarUsuario}>Siguiente</Button>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    {message && (
                      <Alert status={message.toLowerCase().includes('código') ? 'success' : 'error'} mt={4} borderRadius="md">
                        <AlertTitle>{message}</AlertTitle>
                      </Alert>
                    )}
                    <div className="flex gap-3 mb-4 justify-center">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="w-14 h-14 text-center text-2xl border-2 border-gray-300 rounded-lg shadow focus:outline-none focus:border-red-500 transition-all bg-white"
                          value={codigoVerificacion[i] || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            let newCode = codigoVerificacion.split('');
                            newCode[i] = val;
                            setCodigoVerificacion(newCode.join('').slice(0, 4));
                            // Mover foco al siguiente input
                            if (val && i < 3) {
                              const nextInput = document.getElementById(`code-input-${i + 1}`);
                              if (nextInput) (nextInput as HTMLInputElement).focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !codigoVerificacion[i] && i > 0) {
                              const prevInput = document.getElementById(`code-input-${i - 1}`);
                              if (prevInput) (prevInput as HTMLInputElement).focus();
                            }
                          }}
                          id={`code-input-${i}`}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                    <Button colorScheme="red" onClick={handleVerificarCodigo}>Siguiente</Button>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    {!success ? (
                      <>
                        {message && (
                          <Alert status={message.toLowerCase().includes('actualizada') ? 'success' : 'error'} mt={4} borderRadius="md">
                            <AlertTitle>{message}</AlertTitle>
                          </Alert>
                        )}
                        <div className="space-y-4">
                          <div>
                            <Text className="block text-gray-700 text-sm font-bold mb-2">Nueva contraseña</Text>
                            <Input
                              type="password"
                              value={nuevaContrasena}
                              onChange={(e) => setNuevaContrasena(e.target.value)}
                              placeholder="Ingrese su nueva contraseña"
                              className="bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                            <ul className="mt-2 space-y-1 text-sm">
                              <li className={nuevaContrasena.length >= 8 ? "text-green-600 flex items-center" : "text-gray-700 flex items-center"}>
                                <span className="mr-2">{nuevaContrasena.length >= 8 ? "✔️" : "⬜"}</span>
                                Mínimo 8 caracteres
                              </li>
                              <li className={/[A-Z]/.test(nuevaContrasena) ? "text-green-600 flex items-center" : "text-gray-700 flex items-center"}>
                                <span className="mr-2">{/[A-Z]/.test(nuevaContrasena) ? "✔️" : "⬜"}</span>
                                Al menos una mayúscula
                              </li>
                              <li className={/\d/.test(nuevaContrasena) ? "text-green-600 flex items-center" : "text-gray-700 flex items-center"}>
                                <span className="mr-2">{/\d/.test(nuevaContrasena) ? "✔️" : "⬜"}</span>
                                Al menos un número
                              </li>
                            </ul>
                          </div>
                          <div>
                            <Text className="block text-gray-700 text-sm font-bold mb-2">Confirmar contraseña</Text>
                            <Input
                              type="password"
                              value={confirmarContrasena}
                              onChange={(e) => setConfirmarContrasena(e.target.value)}
                              placeholder="Confirme su nueva contraseña"
                              className="bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                            {confirmarContrasena && confirmarContrasena !== nuevaContrasena && (
                              <div className="text-red-600 text-xs mt-1">Las contraseñas no coinciden</div>
                            )}
                          </div>
                        </div>
                        <Button
                          mt={4}
                          colorScheme="red"
                          onClick={handleActualizarContrasena}
                          disabled={
                            !(
                              nuevaContrasena.length >= 8 &&
                              /[A-Z]/.test(nuevaContrasena) &&
                              /\d/.test(nuevaContrasena) &&
                              nuevaContrasena === confirmarContrasena
                            )
                          }
                        >
                          Cambiar clave
                        </Button>
                      </>
                    ) : (
                      <>
                        <Alert status="success" mt={4} borderRadius="md">
                          <AlertTitle>{message}</AlertTitle>
                        </Alert>
                        <Button mt={4} colorScheme="green" onClick={() => router.push('/')}>Aceptar</Button>
                      </>
                    )}
                  </>
                )}
              </Box>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
