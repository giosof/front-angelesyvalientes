'use client'
import React, { useState } from 'react';
import {
    Button,
    Select,
    Stack,
    Input,
    createListCollection,
    Tabs,
} from '@chakra-ui/react';
import { Download, X, BookOpen, Calculator, Microscope, CheckCircle } from 'lucide-react';
import { fetchProgramasByValiente, saveMatriculaValiente, fetchFichasByProgramaAndPersona, completarClase, fetchDescargarFichas } from '@/app/helpers/api';
import { useParams } from 'next/navigation';

interface Programa {
    id: number;
    nombre: string;
    matriculado: boolean;
}

interface Ficha {
    idFicha: number;
    tema: string;
    urlRecurso: string;
    codigoFicha: number;
    fechaRealizada: string | null;
}

const GestionDeClases: React.FC = () => {
    const [programaSeleccionado, setProgramaSeleccionado] = useState<string[]>([]);
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [fechasFinalizacion, setFechasFinalizacion] = useState<{ [idFicha: number]: string }>({});
    const params = useParams()
    const personId = params.person as string

    React.useEffect(() => {
        const cargarProgramas = async () => {
            const data = await fetchProgramasByValiente(personId);
            if (data && Array.isArray(data)) {
                setProgramas(data);
                // Seleccionar el primer programa no matriculado si existe
                const primerProgramaNoMatriculado = data.find(p => !p.matriculado);
                if (primerProgramaNoMatriculado) {
                    setProgramaSeleccionado([primerProgramaNoMatriculado.id.toString()]);
                }
            }
        };
        cargarProgramas();
    }, [personId]);

    const cargarFichas = async (idPrograma: string) => {
        const data = await fetchFichasByProgramaAndPersona(idPrograma, personId);
        if (data && Array.isArray(data)) {
            setFichas(data);
        }
    };

    const handleMatricular = async () => {
        try {
            if (!programaSeleccionado[0]) {
                alert('Por favor seleccione un programa');
                return;
            }
            
            const response = await saveMatriculaValiente(personId, programaSeleccionado[0]);
            if (response) {
                alert('Matrícula realizada con éxito');
                // Recargar programas después de matricular
                const data = await fetchProgramasByValiente(personId);
                if (data && Array.isArray(data)) {
                    setProgramas(data);
                }
            } else {
                alert('Error al realizar la matrícula');
            }
        } catch (error) {
            console.error('Error al matricular:', error);
            alert('Error al realizar la matrícula');
        }
    };

    const handleCompletarClase = async (idFicha: number, fechaFinalizacion: string) => {
        try {
            const response = await completarClase(idFicha.toString(), personId, fechaFinalizacion);
            if (response) {
                alert('Clase completada con éxito');
                // Recargar fichas del programa actual
                if (programaSeleccionado[0]) {
                    await cargarFichas(programaSeleccionado[0]);
                }
                // Limpiar la fecha seleccionada para esa ficha
                setFechasFinalizacion((prev) => ({ ...prev, [idFicha]: '' }));
            } else {
                alert('Error al completar la clase');
            }
        } catch (error) {
            console.error('Error al completar clase:', error);
            alert('Error al completar la clase');
        }
    };

    const handleDescargarArchivo = async (idFicha: number) => {
        try {
            const pdfUrl = await fetchDescargarFichas(idFicha);
            if (pdfUrl) {
              window.open(pdfUrl, '_blank');
            } else {
              alert('Error al cargar el PDF');
            }
          } catch (error) {
            console.error('Error al cargar el PDF:', error);
            alert('Error al cargar el PDF');
          }
    };

    // Filtrar programas matriculados y no matriculados
    const programasMatriculados = programas.filter(p => p.matriculado);
    const programasNoMatriculados = programas.filter(p => !p.matriculado);

    return (
        <div className="p-6 md:p-12 bg-background min-h-screen">
            <div className="flex flex-wrap -mx-3 mb-6 justify-between">
                <h1 className="mb-6">Valiente | Gestión de Clases</h1>
            </div>

            {programasNoMatriculados.length > 0 && (
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <Select.Root 
                            value={programaSeleccionado}
                            onValueChange={(details) => setProgramaSeleccionado(details.value)}
                            collection={createListCollection({
                                items: programasNoMatriculados.map(p => ({ label: p.nombre, value: p.id.toString() }))
                            })}
                        >
                            <Select.HiddenSelect />
                            <Select.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Programa
                            </Select.Label>
                            <Select.Control>
                                <Select.Trigger className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <Select.ValueText placeholder="Selecciona un programa" />
                                </Select.Trigger>
                            </Select.Control>
                            <Select.Positioner>
                                <Select.Content>
                                    {programasNoMatriculados.map((programa) => (
                                        <Select.Item key={programa.id} item={{ label: programa.nombre, value: programa.id.toString() }}>
                                            {programa.nombre}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Select.Root>
                        </div>
                    <div className="w-full md:w-auto px-3 mb-6 md:mb-0 flex items-end">
                                    <Button
                            onClick={handleMatricular}
                            className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2"
                        >
                            Matricular
                                    </Button>
                    </div>
                        </div>
            )}

            <div className="mb-8">
                <Tabs.Root defaultValue={programasMatriculados[0]?.id.toString() || "none"} className="w-full">
                    <Tabs.List className="grid w-full grid-cols-3 mb-6 border-b border-gray-200">
                        {programasMatriculados.map((programa) => (
                            <Tabs.Trigger 
                                key={programa.id}
                                value={programa.id.toString()}
                                className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                                onClick={() => cargarFichas(programa.id.toString())}
                            >
                                {programa.nombre === 'MATEMÁTICAS' && <Calculator className="h-4 w-4" />}
                                {programa.nombre === 'LECTURA' && <BookOpen className="h-4 w-4" />}
                                {programa.nombre === 'CIENCIAS' && <Microscope className="h-4 w-4" />}
                                {programa.nombre}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {programasMatriculados.map((programa) => (
                        <Tabs.Content key={programa.id} value={programa.id.toString()} className="mt-4">
                        <div className="space-y-2">
                                {fichas.map((ficha) => (
                                    <div key={ficha.idFicha} className="flex items-center gap-4 p-4 rounded-md bg-gray-50 border border-gray-200">
                                        <span className="text-gray-700 font-medium">Clase {ficha.codigoFicha}:</span>
                                        <span className="text-gray-600">Tema: {ficha.tema}</span>
                                        <span className="text-gray-600">
                                            Fecha: {ficha.fechaRealizada || 'No realizada'}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDescargarArchivo(ficha.idFicha)}
                                            className="text-gray-500 hover:text-red-700 border-gray-300 hover:border-red-700"
                                            disabled={!ficha.urlRecurso}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        {!ficha.fechaRealizada && (
                                            <Input
                                                type="date"
                                                size="sm"
                                                value={fechasFinalizacion[ficha.idFicha] || ''}
                                                onChange={(e) => setFechasFinalizacion((prev) => ({ ...prev, [ficha.idFicha]: e.target.value }))}
                                                className="w-36"
                                            />
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCompletarClase(ficha.idFicha, fechasFinalizacion[ficha.idFicha] || '')}
                                            className="text-gray-500 hover:text-green-700 border-gray-300 hover:border-green-700"
                                            disabled={!!ficha.fechaRealizada || !fechasFinalizacion[ficha.idFicha]}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                        </div>
                        </Tabs.Content>
                    ))}

                    {programasMatriculados.length === 0 && (
                        <Tabs.Content value="none" className="mt-4">
                            <div className="text-center text-gray-500 py-8">
                                No hay programas matriculados
                            </div>
                        </Tabs.Content>
                    )}
                </Tabs.Root>
                    </div>
        </div>
    );
};

export default GestionDeClases;
