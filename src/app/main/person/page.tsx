'use client'

import { fetchGeneros, fetchTiposIdentificacion, savePersona } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, createListCollection, Input, ListCollection, Portal, Select } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";

type TipoIdentificacion = {
  nmTipoIdentificacion: number;
  txTipoIdentificacion: string;
};

const PersonPage = () => {
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any>();
  const [generos, setGeneros] = useState<any>();
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function getInfo() {
      const resTipos = await fetchTiposIdentificacion()
      setTiposIdentificacion(resTipos)
      
      const resGeneros = await fetchGeneros();
      
      setGeneros(resGeneros)

    }
    getInfo()
  }, [])

  if (!tiposIdentificacion || !generos) return <div>Cargando...</div>

  async function handleSavePerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('');
    
    const formData = new FormData(event.currentTarget)
    console.log(formData)
  
    const result = await savePersona(formData);

    if (result.nmIdPersona) {
      toaster.create({
        title: "Persona guardada",
        description: "La información fue almacenada exitosamente",
        type: "success"
      })
    } else {
      setErrorMessage(result.error || 'Error desconocido');
      toaster.create({
        title: "Error",
        description: "No fue posible guardar la persona. Intente más tarde o comuníquese con el administrador.",
        type: "error"
      })
    }
  }

  return (
    <div>
        <Toaster />
        <form className="w-full" onSubmit={handleSavePerson}>
          <div className="flex flex-wrap -mx-3 mb-12 justify-between">
            <p className="mb-6">Datos Básicos</p>
            <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" type="submit">
              <BsFillSave2Fill />Guardar
            </Button>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Tipo de Identificación
              </label>
              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="tipoIdentificacion">
                {tiposIdentificacion.map((tipo: any) => (
                      <option value={tipo.nmTipoIdentificacion.toString()}>{tipo.txTipoIdentificacion.toString()}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Identificación
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="identificacion" type="text" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Primer Nombre
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="primerNombre" type="text" />
              {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
            </div>
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Segundo Nombre
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="segundoNombre" type="text" />
            </div>
            <div className="w-full md:w-1/4 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Primer Apellido
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="primerApellido" type="text" />
            </div>
            <div className="w-full md:w-1/4 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Segundo Apellido
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="segundoApellido" type="text" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Género
              </label>
              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="genero">
                {generos.map((genero: any) => (
                      <option value={genero.nmIdGenero.toString()}>{genero.txGenero.toString()}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Teléfono
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="telefono" type="text" placeholder="6045555555" />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Correo electrónico
              </label>
              <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="correo" type="text" placeholder="correo@mail.com.co"/>
            </div>
          </div>
        </form>
    </div>
  );
};

export default PersonPage;