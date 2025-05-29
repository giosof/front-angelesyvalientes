'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { saveInformesClinicos, fetchClinicosByPersona, fetchDescargarInfromeClinico } from "@/app/helpers/api";
import { useParams } from "next/navigation";
import { Box, Input, Button } from '@chakra-ui/react';
import { Alert, AlertTitle } from '@chakra-ui/alert';

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
    if (!searchTerm) return true

    const docTypeInforme = `${doc.tipoInforme}`

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
          nmIdPersona: personId,
        },
        tipoInforme: data.tipoInforme,
        profesional: data.profesional,
        fecha: date.toISOString().split('T')[0]
      };

      // Guardar informe clinico
      const result = await saveInformesClinicos(informeClinicoData, file);
      if (!result) {
        setMessage('Informe clinico guardado exitosamente');
        reset();
        setFile(null);
        fetchInformesClinicos(); 
        return;
      } else {
        setMessage('Error al guardar el informe clinico');
      }
      
    } catch (error) {
      console.log('Error en el proceso de guardar los informes clinicos');
      reset();
      setFile(null);
      fetchInformesClinicos(); 
      return;
    }
  };

  const handleSearch = () => {
    fetchInformesClinicos(); 
  };

  const handleViewPdf = async ( idInforme: number ) => {
    try {
      const pdfUrl = await fetchDescargarInfromeClinico(idInforme);
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        setMessage('Error al cargar el PDF');
      }
    } catch (error) {
      console.error('Error al cargar el PDF:', error);
      setMessage('Error al cargar el PDF');
    }
  };

  useEffect(() => {
    fetchInformesClinicos();
  }, [personId]);

  return (
    <Box>
      <p className="mb-6">Valiente | Informes Clínicos</p>
      <Box  as="form" onSubmit={handleSubmit(onSubmit)}  className="p-4 mb-6 border border-gray-300 rounded-lg">
      
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
      {message && (
        <Alert status={message.includes('exitosamente') ? 'success' : 'error'} mt={4} borderRadius="md">
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      )}
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
              <th className="py-2 border border-gray-200 bg-red-100">Profesional</th>
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
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleViewPdf(doc.idInformeClinico)}
                  >
                    Ver PDF
                  </Button>
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