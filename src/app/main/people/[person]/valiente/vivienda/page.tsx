'use client'

import { fetchClasificacionesValiente, fetchGeneros, fetchGruposEtnicos, fetchPersonInfo, fetchTiposIdentificacion, savePersona } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Box, Button, Checkbox, Input, Select, Text, Field } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm } from "react-hook-form"

const ViviendaForm = () => {
  const params = useParams()
  const { register, handleSubmit } = useForm();





  return (
    <div>
      <Toaster />
      <form className="w-full">
        <div className="flex flex-wrap -mx-3 mb-12 justify-between">
          <p className="mb-6">Valiente | Vivienda</p>
          <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
       >
            <BsFillSave2Fill />Guardar
          </Button>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <Field.Root defaultValue={""} >
              <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
              Direccion<Field.RequiredIndicator />
              </Field.Label>
              <Input {...register("direccion")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
              type="text" />
            </Field.Root>
          </div>
        </div>

        <Box className="p-4">
          <Text fontSize="xl" mb={4}>Visita Domiciliaria</Text>
          <Input placeholder="Dirección" mb={4} {...register('direccion')} />

          <Text mb={2}>Servicios Básicos</Text>
          <Box mb={4}>
            <Checkbox.Root {...register('agua')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Agua</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('luz')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Luz</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('gas')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Gas</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('internet')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Internet</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('alcantarillado')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Alcantarillado</Checkbox.Label>
            </Checkbox.Root>
          </Box>

          <Text fontSize="lg" mb={2}>Grupo Familiar</Text>
          <Box display="flex" alignItems="center" mb={4}>
            <Input placeholder="Nombre" {...register('nombre')} mr={2} />
            <select {...register('trabaja')} >
      <option value="si">Sí</option>
      <option value="no">No</option>
    </select>
            <Checkbox.Root {...register('sabeLeer')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Leer</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('sabeEscribir')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Escribir</Checkbox.Label>
            </Checkbox.Root>
            <Input placeholder="Novedades" {...register('novedades')} mr={2} />
            <Button colorScheme="purple">Agregar</Button>
          </Box>

          
            <table className="min-w-full border-separate border-4 border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 border border-gray-200 bg-red-100" >Nombre</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Trabaja</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Seguridad Social</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Leer</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Escribir</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Novedades</th>
                </tr>
              </thead>
              <tbody>
                
                  <tr>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                  </tr>
                
              </tbody>
            </table>

          <Button colorScheme="yellow" mt={4}>Guardar</Button>
        </Box>
      </form>
    </div>
  );
};

export default ViviendaForm;