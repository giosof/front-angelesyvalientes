'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { uploadInformeClinicoPdf, saveInformesClinicos, fetchClinicosByPersona } from "@/app/helpers/api";
import { useParams } from "next/navigation";
import { Box, Input } from '@chakra-ui/react';

registerLocale('es', es);

const ClinicosForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [informesClinicos, setInformesClinicos] = useState<any[]>([]);
  const params = useParams()
  const personId = params.person as string
  const [message, setMessage] = useState<string | null>(null)
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const [searchTerm, setSearchTerm] = useState("")

  const filteredInformesClinicos = informesClinicos.filter((doc) => {
    // Si no hay texto ingresado, retornar todos
    if (!searchTerm) return true

    // Concatenar nombre completo
    const docTypeInforme = `${doc.tipoInforme}`

    // Convertir ambos valores a minúscula y buscar coincidencias
    return (
      docTypeInforme.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
  })

  const fetchInformesClinicos = async () => {
    const result = await fetchClinicosByPersona(personId);
    if (result) {
      setInformesClinicos(result);
    } 
  };

  const onSubmit = async (data: any) => {
    try {
      if (!file) {
        setMessage('Archivo o tipo de documento no seleccionado');
        return;
      }

      const informeClinicoData = {
        persona: {
          id: personId,
        },
        tipoInforme: data.tipoInforme,
        profesional: data.profesional,
        fecha: date.toISOString().split('T')[0]
      };

      // Guardar informe clinico
      const result = await saveInformesClinicos(informeClinicoData);
      if (result) {
        setMessage('Informe clinico guardado exitosamente');
        reset();
        setFile(null);
        fetchInformesClinicos(); // Refrescar la lista después de guardar
        return;
      } else {
        setMessage('Error al guardar el informe clinico');
      }
      
      const urlPdf = await uploadInformeClinicoPdf(result.idInformeClinico, file, personId);
      if (!urlPdf) {
        console.log('Error al subir el archivo');
        return;
      }
    } catch (error) {
      console.log('Error en el proceso de guardar documentación');
    }
  };

  const handleSearch = () => {
    fetchInformesClinicos(); // Refrescar la lista cuando se realiza una búsqueda
  };

  useEffect(() => {
    fetchInformesClinicos();
  }, [personId]);

  return (
    <Box>
      <Box  as="form" onSubmit={handleSubmit(onSubmit)}  className="p-4 mb-6 border border-gray-300 rounded-lg">
      <p className="mb-6">Valiente | Informes Clínicos</p>
      <div id="date" className="mb-4">
        <label className="block text-gray-700 mb-2">Fecha</label>
        <DatePicker
          {...register("date")}
          dateFormat="yyyy-MM-dd"
          locale="es"
          className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          selected={date}
          onChange={(date) => setDate(date ? date : new Date())}
        />

        <div id="tipoInforme" className="mb-4">
          <label htmlFor="tipoInforme" className="block text-gray-700 mb-2">Tipo de Informe</label>
          <Input id="tipoInforme" {...register('tipoInforme')} type="text" className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
      </div>


      <div id="profesional" className="mb-4">
       <label htmlFor="profesional" className="block text-gray-700 mb-2">Profesional</label>
           <Input id="profesional" {...register('profesional')} type="text" className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
      </div>

      <div id="file" className="mb-4">
        <label className="block text-gray-700 mb-2">Subir PDF</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>

      <button className="bg-red-700 text-white p-2 rounded hover:bg-red-600" type="submit">
        Registrar Informe
      </button>
      {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </div>
      </Box>
      <Box >
      <div className="flex items-center p-2 rounded-full mt-4">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <input
          type="text"
          placeholder="Buscar por tipo de informe"
          className="w-full p-2 focus:outline-none"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch();
          }}
        />
      </div>

      <div className="mt-8">
      <table className="min-w-full border-separate border-4 border-gray-200">
          <thead>
            <tr>
              <th className="py-2 border border-gray-200 bg-red-100">Fecha</th>
              <th className="py-2 border border-gray-200 bg-red-100">Tipo Informe</th>
              <th className="py-2 border border-gray-200 bg-red-100">Profecional</th>
              <th className="py-2 border border-gray-200 bg-red-100">Pdf</th>
            </tr>
          </thead>
          <tbody>
            {filteredInformesClinicos.map((doc, index) => (
              <tr key={index} className="bg-gray-100 hover:bg-gray-200">
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{doc.fecha}</td>
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{doc.tipoInforme}</td>
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{doc.profesional}</td>
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">
                  <a href={`https://drive.google.com/file/d/${doc.urlPdf}`} target="_blank" className="text-blue-500 hover:underline">
                    Ver PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Box>
    </Box>
    
  );
};

export default ClinicosForm;