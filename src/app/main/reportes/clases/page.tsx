"use client";
import React, { useEffect, useState } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import { fetchProgramas, fetchReporteClasesPorPrograma } from '@/app/helpers/api';

interface Programa {
  id: number;
  nombre: string;
}

interface FichaFinalizada {
  idFicha: number;
  tema: string;
  urlRecurso: string;
  codigoFicha: number;
  fechaRealizada: string | null;
}

interface ValienteReporte {
  idValiente: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  fichasFinalizadas: FichaFinalizada[];
}

const ReporteClasesPage: React.FC = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState<string>("");
  const [reporte, setReporte] = useState<ValienteReporte[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clasesHeaders, setClasesHeaders] = useState<{ codigo: number; tema: string }[]>([]);

  useEffect(() => {
    const cargarProgramas = async () => {
      const data = await fetchProgramas();
      if (data && Array.isArray(data)) {
        setProgramas(data);
      }
    };
    cargarProgramas();
  }, []);

  const handleProgramaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idPrograma = e.target.value;
    setProgramaSeleccionado(idPrograma);
    if (idPrograma) {
      const data = await fetchReporteClasesPorPrograma(idPrograma);
      if (data && Array.isArray(data)) {
        setReporte(data);
        // Obtener los headers de clases únicos y ordenados
        const clasesSet = new Map<number, string>();
        data.forEach((valiente: ValienteReporte) => {
          valiente.fichasFinalizadas.forEach((ficha) => {
            clasesSet.set(ficha.codigoFicha, ficha.tema);
          });
        });
        const clasesArr = Array.from(clasesSet.entries()).map(([codigo, tema]) => ({ codigo, tema }));
        clasesArr.sort((a, b) => a.codigo - b.codigo);
        setClasesHeaders(clasesArr);
      } else {
        setReporte([]);
        setClasesHeaders([]);
      }
    } else {
      setReporte([]);
      setClasesHeaders([]);
    }
  };

  // Construir nombre completo y usar correo o teléfono como identificador
  const getNombreCompleto = (v: ValienteReporte) =>
    [v.primerNombre, v.segundoNombre, v.primerApellido, v.segundoApellido].filter(Boolean).join(' ');
  const getIdentificador = (v: ValienteReporte) => v.correo || v.telefono || '';

  const filteredReporte = reporte.filter(valiente =>
    getNombreCompleto(valiente).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getIdentificador(valiente).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="p-6 md:p-12 bg-background min-h-screen">
      <Text as="h1" className="mb-6 text-2xl font-bold text-gray-800">Reporte de Clases</Text>
      <Box className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={programaSeleccionado}
          onChange={handleProgramaChange}
          className="w-64 appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="">Selecciona un programa</option>
          {programas.map((programa) => (
            <option key={programa.id} value={programa.id.toString()}>
              {programa.nombre}
            </option>
          ))}
        </select>
        <Input
          type="text"
          placeholder="Buscar por nombre o correo/teléfono"
          className="w-72 bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border border-gray-200 bg-red-100 text-xs font-medium text-gray-700 uppercase tracking-wider text-left">Nombre</th>
              <th className="py-3 px-4 border border-gray-200 bg-red-100 text-xs font-medium text-gray-700 uppercase tracking-wider text-left">Identificación</th>
              {clasesHeaders.map((clase) => (
                <th key={clase.codigo} className="py-3 px-4 border border-gray-200 bg-red-100 text-xs font-medium text-red-700 uppercase tracking-wider text-center">
                  Clase {clase.codigo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReporte.map((valiente, idx) => (
              <tr key={valiente.idValiente} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                <td className="py-2 px-4 border border-gray-200 text-gray-700 text-left">{getNombreCompleto(valiente)}</td>
                <td className="py-2 px-4 border border-gray-200 text-gray-700 text-left">{getIdentificador(valiente)}</td>
                {clasesHeaders.map((clase) => {
                  const ficha = valiente.fichasFinalizadas.find(f => f.codigoFicha === clase.codigo);
                  return (
                    <td key={clase.codigo} className="py-2 px-4 border border-gray-200 text-center text-lg font-bold text-black">
                      {ficha && ficha.fechaRealizada ? "X" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default ReporteClasesPage;
