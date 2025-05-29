'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { saveDocumentacion, fetchDocumentacionesByPersona, fetchDescargarDocumento } from "@/app/helpers/api";
import { useParams } from "next/navigation";
import { Box, Input, Button } from '@chakra-ui/react';

registerLocale('es', es);

const DocumentacionForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const params = useParams()
  const personId = params.person as string
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocumentos = documentos.filter((doc) => {
  
    if (!searchTerm) return true
    const docType = `${doc.tipoDocumentacion}`
    return (
      docType.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
  })

  const fetchDocumentaciones = async () => {
    const result = await fetchDocumentacionesByPersona(personId);
    if (result) {
      setDocumentos(result);
    } 
  };

  const onSubmit = async (data: any) => {
      if (!file) {
        setMessage('Archivo o tipo de documento no seleccionado');
        return;
      }
    
      const documentacionData = {
        persona: {
          nmIdPersona: personId,
        },
        tipoDocumentacion: data.tipoDocumentacion,
        fecha: date.toISOString().split('T')[0]
      };

      const result = await saveDocumentacion(documentacionData, file);
  
      if (result) {
        setMessage('Documentación guardada exitosamente');
        reset();
        setFile(null);
        fetchDocumentaciones();
        return;
      } else {
        setMessage('Error al guardar la documentación');
        reset();
        setFile(null);
        fetchDocumentaciones();
        return;
      }
  };

  const handleViewPdf = async (idDocumento: number) => {
    try {
      const pdfUrl = await fetchDescargarDocumento(idDocumento);
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
    const fetchDocumentaciones = async () => {
        const result = await fetchDocumentacionesByPersona(personId);
        if (result) {
          setDocumentos(result);
        } 
    };
    fetchDocumentaciones();
  }, [personId]);

  return (
    <Box>
      <p className="mb-6">Valiente | Documentación</p>
      <Box  as="form" onSubmit={handleSubmit(onSubmit)} className="p-4 mb-6 border border-gray-300 rounded-lg">
      <div id="date" className="mb-4">
        <label className="block text-gray-700 mb-2">Fecha</label>
        <DatePicker
          {...register("fecha")}
          dateFormat="yyyy-MM-dd"
          locale="es"
          className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          selected={date}
          onChange={(date) => setDate(date ? date : new Date())}
        />

      <div id="document-type" className="mb-4">
        <label className="block text-gray-700 mb-2">Tipo de Documento</label>
        <Input id="tipoDocumentacion" {...register('tipoDocumentacion')} type="text" className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
      </div>

      <div id="file" className="mb-4">
        <label className="block text-gray-700 mb-2">Subir Archivo</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>

      <button className="bg-red-700 text-white p-2 rounded hover:bg-red-600" type="submit">
        Registrar Documento
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
          placeholder="Buscar por tipo de documento"
          className="w-full p-2 focus:outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-8">
      <table className="min-w-full border-separate border-4 border-gray-200">
          <thead>
            <tr>
              <th className="py-2 border border-gray-200 bg-red-100">Fecha</th>
              <th className="py-2 border border-gray-200 bg-red-100">Tipo documento</th>
              <th className="py-2 border border-gray-200 bg-red-100">Pdf</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocumentos.map((doc, index) => (
              <tr key={index} className="bg-gray-100 hover:bg-gray-200">
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{doc.fecha}</td>
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{doc.tipoDocumentacion}</td>
                <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleViewPdf(doc.idDocumentacion)}
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

export default DocumentacionForm;