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
import { Download, X, BookOpen, Calculator, Microscope } from 'lucide-react';

interface Clase {
    id: number;
    tema: string;
    fecha: string;
}

const programas = createListCollection({
    items: [
        { label: "Matemáticas", value: "matematicas" },
        { label: "Lectura", value: "lectura" },
        { label: "Ciencias", value: "ciencias" },
    ],
});

const GestionDeClases: React.FC = () => {
    const [programaSeleccionado, setProgramaSeleccionado] = useState<string[]>(['matematicas']);
    const [clases, setClases] = useState<Clase[]>([{ id: 1, tema: 'Sumas', fecha: 'Fecha' }]);
    const [nuevoTema, setNuevoTema] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState('');

    const handleMatricular = () => {
        console.log(`Matricular en: ${programaSeleccionado}`);
    };

    const agregarClase = () => {
        if (nuevoTema.trim() && nuevaFecha.trim()) {
            const nuevaClase: Clase = {
                id: clases.length + 1,
                tema: nuevoTema,
                fecha: nuevaFecha,
            };
            setClases([...clases, nuevaClase]);
            setNuevoTema('');
            setNuevaFecha('');
        }
    };

    const eliminarClase = (id: number) => {
        setClases(clases.filter((clase) => clase.id !== id));
    };

    return (
        <div className="p-6 md:p-12 bg-background min-h-screen">
            <div className="flex flex-wrap -mx-3 mb-6 justify-between">
                <h1 className="mb-6">Valiente | Gestión de Clases</h1>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <Select.Root 
                        value={programaSeleccionado}
                        onValueChange={(details) => setProgramaSeleccionado(details.value)}
                        collection={programas}
                    >
                        <Select.HiddenSelect />
                        <Select.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Programa
                        </Select.Label>
                        <Select.Control>
                            <Select.Trigger className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                <Select.ValueText placeholder="Selecciona un programa" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                            <Select.Content>
                                {programas.items.map((programa) => (
                                    <Select.Item key={programa.value} item={programa}>
                                        {programa.label}
                                        <Select.ItemIndicator />
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

            <div className="mb-8">
                <Tabs.Root defaultValue="matematicas" className="w-full">
                    <Tabs.List className="grid w-full grid-cols-3 mb-6 border-b border-gray-200">
                        <Tabs.Trigger 
                            value="matematicas"
                            className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                        >
                            <Calculator className="h-4 w-4" />
                            Matemáticas
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value="lectura"
                            className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                        >
                            <BookOpen className="h-4 w-4" />
                            Lectura
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value="ciencias"
                            className="flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-red-700 data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700"
                        >
                            <Microscope className="h-4 w-4" />
                            Ciencias
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="matematicas" className="mt-4">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Tema
                                </label>
                                <Input
                                    placeholder="Ingrese el tema"
                                    value={nuevoTema}
                                    onChange={(e) => setNuevoTema(e.target.value)}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Fecha
                                </label>
                                <Input
                                    placeholder="Ingrese la fecha"
                                    value={nuevaFecha}
                                    onChange={(e) => setNuevaFecha(e.target.value)}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                />
                            </div>
                            <div className="w-full md:w-auto px-3 mb-6 md:mb-0 flex items-end">
                                <Button 
                                    onClick={agregarClase}
                                    className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2"
                                >
                                    Agregar Clase
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {clases.map((clase) => (
                                <div key={clase.id} className="flex items-center gap-4 p-4 rounded-md bg-gray-50 border border-gray-200">
                                    <span className="text-gray-700 font-medium">Clase {clase.id}:</span>
                                    <span className="text-gray-600">Tema: {clase.tema}</span>
                                    <span className="text-gray-600">Fecha: {clase.fecha}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => eliminarClase(clase.id)}
                                        className="ml-auto text-gray-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-gray-500 hover:text-red-700 border-gray-300 hover:border-red-700"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="lectura" className="mt-4">
                        <div className="text-center text-gray-500 py-8">
                            Contenido de las clases de lectura
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="ciencias" className="mt-4">
                        <div className="text-center text-gray-500 py-8">
                            Contenido de las clases de ciencias
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};

export default GestionDeClases;
