'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormEvent } from 'react';
import { loginUser } from '../app/helpers/api';
import { Link } from "@chakra-ui/react";

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
        <div className="flex flex-col lg:flex-row h-screen w-full">
          {/* Imagen a la izquierda */}
          <div className="w-full lg:w-2/3 h-48 md:h-64 lg:h-full flex-shrink-0">
            <Image
              className="w-full h-full object-contain "
              src="/logo_corporacion_no_bg.png"
              alt="Logo Corporacion Angeles y Valientes"
              width={650}
              height={650}
              priority
            />
          </div>
          
          {/* Formulario a la derecha */}
          <div className="w-full lg:w-1/3 flex items-center justify-center px-4">
            <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">Iniciar Sesión</h2>
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
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Clave</label>
                  <input
                    className="bg-white w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ingrese su clave"
                    required
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('Por favor ingrese su clave')
                    }
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                  />
                </div>
                <div className="mb-6 text-center">
                  <Link href="/olvido-clave" className="text-sm">Olvidé mi clave</Link>
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" type="submit">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
