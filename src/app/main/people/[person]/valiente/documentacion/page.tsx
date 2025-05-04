'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { uploadToGoogleDrive, saveDocumentacion } from "@/app/helpers/api";
import { useParams } from "next/navigation";

registerLocale('es', es);

const DocumentacionForm = () => {
  const { register } = useForm();
  const [date, setDate] = useState(new Date());
  const [documentType, setDocumentType] = useState<{ value: string; label: string } | null>(null);
  const [file, setFile] = useState(null);
  const params = useParams()
  const personId = params.person as string
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      if (!file || !documentType) {
        console.error('Archivo o tipo de documento no seleccionado');
        return;
      }

      // Subir el archivo a Google Drive
      const urlPdf = await uploadToGoogleDrive(personId, file);
      if (!urlPdf) {
        console.error('Error al subir el archivo');
        return;
      }

      // Preparar datos de la documentación
      const documentacionData = {
        persona: {
          nmIdPersona: personId,
        },
        tipoDocumentacion: documentType.value,
        urlPdf: urlPdf,
        fecha: date.toISOString().split('T')[0]
      };

      // Guardar la documentación
      const result = await saveDocumentacion(documentacionData);
      if (result) {
        console.log('Documentación guardada exitosamente');
      } else {
        console.error('Error al guardar la documentación');
      }
    } catch (error) {
      console.error('Error en el proceso de guardar documentación:', error);
    }
  };

  const handleSearchDocuments = () => {
    console.log('Buscar documentos por ID de persona');
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <div id="date" className="mb-4">
        <label className="block text-gray-700 mb-2">Fecha</label>
        <DatePicker
          {...register("fechaNacimiento")}
          dateFormat="yyyy-MM-dd"
          locale="es"
          className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          selected={date}
          onChange={(date) => setDate(date ? date : new Date())}
        />
      </div>

      <div id="document-type" className="mb-4">
        <label className="block text-gray-700 mb-2">Tipo de Documento</label>
        <ReactSelect
          value={documentType}
          onChange={(selectedOption: SingleValue<{ value: string; label: string }>) => setDocumentType(selectedOption)}
          className="w-full"
          options={[
            { value: 'passport', label: 'Pasaporte' },
            { value: 'id', label: 'Cédula' },
            { value: 'driver_license', label: 'Licencia de Conducir' }
          ]}
        />
      </div>

      <div id="file" className="mb-4">
        <label className="block text-gray-700 mb-2">Subir Archivo</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
      </div>

      <button className="bg-red-700 text-white p-2 rounded hover:bg-red-600" onClick={handleSubmit}>
        Registrar Documento
      </button>
      
      <div className="flex items-center p-2 rounded-full mt-4">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <input
          type="text"
          placeholder="Buscar"
          className="w-full p-2 focus:outline-none"
        />
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h7m0 0l-3.5-3.5M22 12l-3.5 3.5"></path>
          </svg>
        </button>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4 bg-black text-white p-2 rounded">
          <div>Fecha</div>
          <div>Tipo documento</div>
          <div>Pdf</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="p-2 border rounded">20/12/2024</div>
          <div className="p-2 border rounded">Registro Civil</div>
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="p-2 border rounded">20/12/2024</div>
          <div className="p-2 border rounded">Consentimiento Padre</div>
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentacionForm;