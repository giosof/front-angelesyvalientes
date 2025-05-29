'use client'
import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Tabs,
    Field,
} from '@chakra-ui/react';
import { BsFillSave2Fill } from 'react-icons/bs';
import { Toaster, toast } from 'react-hot-toast';
import { fetchProgramas, savePrograma, saveFicha, fetchFichasByPrograma } from '@/app/helpers/api';

interface Programa {
    id: number;
    nombre: string;
    estado: boolean;
    fecha: string;
    matriculado: boolean;
}

interface FichaForm {
    id: number;
    nombre: string;
    codigo: number;
    descripcion: string;
    archivo: File | null;
}

interface Ficha {
    id: number;
    nombre: string;
    urlRecurso: string;
    codigo: number;
    programa: {
        id: number;
        nombre: string;
        estado: boolean;
        fecha: string;
    };
}

const ProgramasPage: React.FC = () => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState<string>('');
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const [nuevoPrograma, setNuevoPrograma] = useState({
        nombre: '',
        estado: true,
        fecha: Date.now()
    });
    const [nuevaFicha, setNuevaFicha] = useState<FichaForm>({
        id: 0,
        nombre: '',
        codigo: 0,
        descripcion: '',
        archivo: null
    });

    const handleGuardarPrograma = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await savePrograma(nuevoPrograma);
            if (response) {
                toast.success('Programa guardado exitosamente');
               
                // Recargar lista de programas
                const programasActualizados = await fetchProgramas();
                if (programasActualizados) {
                    setProgramas(programasActualizados);
                }
            } else {
                toast.error('Error al guardar el programa');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el programa');
        }
    };

    const handleGuardarFicha = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!programaSeleccionado) {
            toast.error('Por favor seleccione un programa');
            return;
        }
        if (!nuevaFicha.archivo) {
            toast.error('Por favor seleccione un archivo');
            return;
        }

        try {
            const fichaData = {
                nombre: nuevaFicha.nombre,
                codigo: nuevaFicha.codigo,
                descripcion: nuevaFicha.descripcion,
                programa: {
                    id: parseInt(programaSeleccionado)
                }
            };

            const response = await saveFicha(fichaData, nuevaFicha.archivo);
            if (response) {
                toast.success('Ficha guardada exitosamente');
                setNuevaFicha({
                    id: 0,
                    nombre: '',
                    codigo: 0,
                    descripcion: '',
                    archivo: null
                });
                // Recargar las fichas del programa seleccionado
                const fichasData = await fetchFichasByPrograma(programaSeleccionado);
                if (fichasData) {
                    setFichas(fichasData);
                }
            } else {
                toast.error('Error al guardar la ficha');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar la ficha');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNuevaFicha({
                ...nuevaFicha,
                archivo: e.target.files[0]
            });
        }
    };

    const handleProgramaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const programaId = e.target.value;
        setProgramaSeleccionado(programaId);
        if (programaId) {
            const fichasData = await fetchFichasByPrograma(programaId);
            if (fichasData) {
                setFichas(fichasData);
            }
        } else {
            setFichas([]);
        }
    };

    // Cargar programas al iniciar
    useEffect(() => {
        const cargarProgramas = async () => {
            const programasData = await fetchProgramas();
            if (programasData) {
                setProgramas(programasData);
            }
        };
        cargarProgramas();
    }, []);

    return (
        <div className="p-6 md:p-12 bg-background min-h-screen">
            <Toaster />
            <div className="flex flex-wrap -mx-3 mb-6 justify-between">
                <h1 className="mb-6">Administración | Programas</h1>
            </div>

            <Tabs.Root defaultValue="programas" className="w-full">
                <Tabs.List className="grid w-full grid-cols-2 mb-6 border-b border-gray-200">
                    <Tabs.Trigger 
                        value="programas"
                        className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                    >
                        Programas
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                        value="fichas"
                        className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                    >
                        Fichas
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="programas" className="mt-4">
                    <form onSubmit={handleGuardarPrograma} className="w-full">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Nombre del Programa <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        value={nuevoPrograma.nombre}
                                        onChange={(e) => setNuevoPrograma({...nuevoPrograma, nombre: e.target.value})}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </Field.Root>
                            </div>
                            <div className="px-3 mb-5 md:mb-0 flex justify-end">
                                <Button 
                                    type="submit"
                                    className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-3 mb-5"
                                >
                                    <BsFillSave2Fill className="mr-2" /> Guardar Programa
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Tabla de Programas */}
                    <div className="mt-8">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {programas.map((programa) => (
                                        <tr key={programa.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {programa.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {programa.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${programa.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {programa.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(programa.fecha).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tabs.Content>

                <Tabs.Content value="fichas" className="mt-4">
                    <form onSubmit={handleGuardarFicha} className="w-full">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Programa <Field.RequiredIndicator />
                                    </Field.Label>
                                    <select
                                        value={programaSeleccionado}
                                        onChange={handleProgramaChange}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="">Selecciona un programa</option>
                                        {programas.map((programa) => (
                                            <option key={programa.id} value={programa.id.toString()}>
                                                {programa.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </Field.Root>
                            </div>
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Código <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        type="number"
                                        value={nuevaFicha.codigo}
                                        onChange={(e) => setNuevaFicha({...nuevaFicha, codigo: parseInt(e.target.value)})}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </Field.Root>
                            </div>
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Nombre <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        value={nuevaFicha.nombre}
                                        onChange={(e) => setNuevaFicha({...nuevaFicha, nombre: e.target.value})}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </Field.Root>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Descripción <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        value={nuevaFicha.descripcion}
                                        onChange={(e) => setNuevaFicha({...nuevaFicha, descripcion: e.target.value})}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </Field.Root>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3 mb-6 md:mb-0">
                                <Field.Root required>
                                    <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Archivo <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    />
                                </Field.Root>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button 
                                type="submit"
                                className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2"
                            >
                                <BsFillSave2Fill className="mr-2" /> Guardar Ficha
                            </Button>
                        </div>
                    </form>

                    {/* Tabla de Fichas */}
                    {programaSeleccionado && (
                        <div className="mt-8">
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Programa
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Recurso
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {fichas.map((ficha) => (
                                            <tr key={ficha.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ficha.codigo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {ficha.nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ficha.programa.nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ficha.urlRecurso ? (
                                                        <a 
                                                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/documentos/${ficha.urlRecurso}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Ver recurso
                                                        </a>
                                                    ) : (
                                                        'Sin recurso'
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default ProgramasPage;
