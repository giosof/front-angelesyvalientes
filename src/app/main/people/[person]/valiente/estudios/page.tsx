'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Input } from '@chakra-ui/react';
import { saveEducacion, fetchEducacionesByPersona } from '@/app/helpers/api';
import { useParams } from 'next/navigation';

const EstudiosForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const params = useParams()
  const personId = params.person as string
  const [educaciones, setEducaciones] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const filteredEducaciones = educaciones.filter((edu) => {
    if (!searchTerm) return true
    const fullName = `${edu.institucion} ${edu.nivel}`
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
  })

  useEffect(() => {
    const fetchEducaciones = async () => {
      const result = await fetchEducacionesByPersona(personId);
      if (result) {
        setEducaciones(result);
      }
    };
    fetchEducaciones();
  }, [personId]);

  const onSubmit = async (data: any) => {
    console.log(data);
    const educacionData = {
      persona: {
        id: personId
      },
      institucion: data.institucion,
      nivel: data.nivel
    };
    const response = await saveEducacion(educacionData);
    if (response) {
      setMessage('Educación guardada exitosamente');
      reset();
      return;
    } else {
      setMessage('Error al guardar la educación');
    }
  };

  return (
    <Box>
    <p className="mb-6">Valiente | Estudios</p>
    <Box as="form" onSubmit={handleSubmit(onSubmit)} className="p-4 mb-6 border border-gray-300 rounded-lg">
      <div className="mb-4">
        <label htmlFor="institucion" className="block text-gray-700 mb-2">Institución</label>
        <Input id="institucion" {...register('institucion')} type="text" className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
      </div>
      <div className="mb-4">
        <label htmlFor="nivel" className="block text-gray-700 mb-2">Nivel</label>
        <Input id="nivel" {...register('nivel')} type="text" className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
      </div>
      <Button type="submit" className="bg-red-700 text-white p-2 rounded hover:bg-red-600">Guardar</Button>
      {message && <p className="mt-2 text-center text-red-500">{message}</p>}
    </Box>

    <Box>
    <div className="flex items-center p-2 rounded-full mt-4 mb-4">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <input
          type="text"
          placeholder="Buscar"
          className="w-full p-2 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="min-w-full border-separate border-4 border-gray-200">
        <thead>
          <tr>
            <th className="py-2 border border-gray-200 bg-red-100">Institución</th>
            <th className="py-2 border border-gray-200 bg-red-100">Nivel</th>
          </tr>
        </thead>
        <tbody>
          {filteredEducaciones.map((educacion, index) => (
            <tr key={index} className="bg-gray-100 hover:bg-gray-200">
              <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{educacion.institucion}</td>
              <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{educacion.nivel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
    </Box> 
  );
};

export default EstudiosForm;
