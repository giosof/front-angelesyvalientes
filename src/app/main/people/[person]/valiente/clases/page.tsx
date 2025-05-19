'use client'
import React, { useState } from 'react';
import {  Button,
          Select,
          Tabs,
          TabsList,
          TabsRoot,
          Input } from '@chakra-ui/react';
import { Download, X } from 'lucide-react';

interface Clase {
    id: number;
    tema: string;
    fecha: string;
}

const GestionDeClases: React.FC = () => {
    const [programas, setProgramas] = useState(['Matemáticas', 'Lectura', 'Ciencias']);
    const [programaSeleccionado, setProgramaSeleccionado] = useState<string>('Matemáticas');
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
        <div className="p-4 md:p-8 bg-background min-h-screen">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">Valiente | Gestión de Clases</h1>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-6">
                <Select placeholder="Selecciona un programa" onChange={(e) => setProgramaSeleccionado(e.target.value)} value={programaSeleccionado}>
                    {programas.map((programa) => (
                        <option key={programa} value={programa}>
                            {programa}
                        </option>
                    ))}
                </Select>
                <Button onClick={handleMatricular} >
                    Matricular
                </Button>
            </div>

            <TabsRoot defaultValue="matematicas" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                    <TabsTrigger value="matematicas">Matemáticas</TabsTrigger>
                    <TabsTrigger value="lectura">Lectura</TabsTrigger>
                </TabsList>
                <TabsPanel value="matematicas">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Clases</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Input
                                placeholder="Tema"
                                value={nuevoTema}
                                onChange={(e) => setNuevoTema(e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Input
                                placeholder="Fecha"
                                value={nuevaFecha}
                                onChange={(e) => setNuevaFecha(e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Button onClick={agregarClase} >Agregar Clase</Button>
                        </div>
                        <div className="space-y-2">
                            {clases.map((clase) => (
                                <div key={clase.id} className="flex items-center gap-4 p-2 rounded-md bg-muted">
                                    <span className="text-foreground">Clase {clase.id}:</span>
                                    <span className="text-foreground">Tema: {clase.tema}</span>
                                    <span className="text-foreground">Fecha: {clase.fecha}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"

                                        onClick={() => eliminarClase(clase.id)}

                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="ml-2">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsPanel>
                <TabsPanel value="lectura">
                    {/* Contenido para la pestaña de Lectura */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Clases de Lectura</h2>
                        <p className="text-muted-foreground">Aquí puedes agregar y gestionar las clases de lectura.</p>
                        {/* Aquí puedes agregar componentes de entrada y visualización de datos */}
                         <div className="flex flex-col md:flex-row gap-4">
                            <Input
                                placeholder="Tema"
                                value={nuevoTema}
                                onChange={(e) => setNuevoTema(e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Input
                                placeholder="Fecha"
                                value={nuevaFecha}
                                onChange={(e) => setNuevaFecha(e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Button onClick={agregarClase} >Agregar Clase</Button>
                        </div>
                        <div className="space-y-2">
                            {clases.map((clase) => (
                                <div key={clase.id} className="flex items-center gap-4 p-2 rounded-md bg-muted">
                                    <span className="text-foreground">Clase {clase.id}:</span>
                                    <span className="text-foreground">Tema: {clase.tema}</span>
                                    <span className="text-foreground">Fecha: {clase.fecha}</span>
                                     <Button
                                        variant="ghost"
                                        size="icon"

                                        onClick={() => eliminarClase(clase.id)}

                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="ml-2">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsPanel>
            </TabsRoot>
        </div>
    );
};

export default GestionDeClases;