'use client'

import { useState } from 'react';
import {
    Button,
    Input,
} from '@chakra-ui/react';
import { X } from 'lucide-react';

const tiposDonacion = [
    { label: 'Dinero', value: 'dinero' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Tiempo', value: 'tiempo' },
    { label: 'Alimentos', value: 'alimentos' },
];

const Donaciones = () => {
    const [profesion, setProfesion] = useState('');
    const [donaciones, setDonaciones] = useState<any[]>([]);
    const [donacion, setDonacion] = useState<any>({
        fecha: '',
        tipo: '',
        observacion: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDonacion({ ...donacion, [name]: value });
    };

    const handleAgregar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!donacion.fecha || !donacion.tipo || !donacion.observacion) return;
        setDonaciones([...donaciones, { ...donacion, id: donaciones.length + 1 }]);
        setDonacion({ fecha: '', tipo: '', observacion: '' });
    };

    const eliminarDonacion = (id: number) => {
        setDonaciones(donaciones.filter((d) => d.id !== id));
    };

    return (
        <div className="p-6 md:p-12 bg-background min-h-screen">
            <div className="mb-8">
                <div className="mb-2 font-bold text-xs uppercase tracking-wide text-gray-700">Datos de Adicionales</div>
                <div className="flex flex-wrap -mx-3 items-center">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <Input
                            placeholder="Profesión"
                            value={profesion}
                            onChange={e => setProfesion(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="mb-2 font-bold text-xs uppercase tracking-wide text-gray-700">Donaciones</div>
                <form onSubmit={handleAgregar} className="flex flex-wrap -mx-3 items-end">
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Fecha</label>
                        <Input
                            type="date"
                            name="fecha"
                            value={donacion.fecha}
                            onChange={handleChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Tipo de donación</label>
                        <select
                            name="tipo"
                            value={donacion.tipo}
                            onChange={handleChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                            <option value="">Seleccione tipo de donación</option>
                            {tiposDonacion.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Observación</label>
                        <Input
                            name="observacion"
                            placeholder="Observación"
                            value={donacion.observacion}
                            onChange={handleChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                    <div className="w-full md:w-auto px-3 mb-6 md:mb-0 flex items-end">
                        <Button type="submit" 
                         className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2"
                        >Agregar</Button>
                    </div>
                </form>
            </div>

            <div className="mt-8">
                {donaciones.length > 0 && (
                    <div className="rounded-lg bg-purple-50 p-4">
                        <div className="font-bold mb-2 text-xs uppercase tracking-wide text-gray-700">Donaciones realizadas</div>
                        <div className="divide-y divide-purple-100">
                            {donaciones.map((d) => (
                                <div key={d.id} className="flex flex-wrap items-center py-2">
                                    <div className="w-full md:w-1/4 font-semibold text-gray-800">
                                        {tiposDonacion.find(t => t.value === d.tipo)?.label || d.tipo}
                                    </div>
                                    <div className="w-full md:w-1/4 text-gray-600">
                                        {d.fecha}
                                    </div>
                                    <div className="w-full md:w-1/3 text-gray-600">
                                        {d.observacion}
                                    </div>
                                    <div className="w-full md:w-auto ml-auto flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => eliminarDonacion(d.id)} className="text-red-600 hover:underline">Eliminar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Donaciones;


