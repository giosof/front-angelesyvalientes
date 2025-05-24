'use client'

import { useState } from 'react';
import {
    Button,
    Input,
} from '@chakra-ui/react';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { saveDonacion } from '@/app/helpers/api';
import toast from 'react-hot-toast';

const tiposDonacion = [
    { label: 'Dinero', value: 'dinero' },
    { label: 'Ropa', value: 'ropa' },
    { label: 'Tiempo', value: 'tiempo' },
    { label: 'Alimentos', value: 'alimentos' },
];

const Donaciones = () => {
    const params = useParams();
    const personId = params.person as string;
    const [profesion, setProfesion] = useState('');
    const [donaciones, setDonaciones] = useState<any[]>([]);
    const [donacion, setDonacion] = useState<any>({
        fecha: '',
        tipo: '',
        observacion: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDonacion({ ...donacion, [name]: value });
    };

    const handleAgregar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!donacion.fecha || !donacion.tipo || !donacion.observacion) {
            toast.error('Por favor complete todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            const donacionData = {
                idDonacion: Math.floor(Math.random() * 1073741824), // Generamos un ID temporal
                tipoDonacion: {
                    id: Math.floor(Math.random() * 1073741824),
                    tipoDonacion: donacion.tipo
                },
                fecha: donacion.fecha,
                observacion: donacion.observacion
            };

            const response = await saveDonacion(personId, donacionData);
            
            if (response) {
                toast.success('Donación guardada exitosamente');
                setDonaciones([...donaciones, { ...donacionData, id: donaciones.length + 1 }]);
                setDonacion({ fecha: '', tipo: '', observacion: '' });
            }
        } catch (error) {
            console.error('Error al guardar la donación:', error);
            toast.error('Error al guardar la donación');
        } finally {
            setIsLoading(false);
        }
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
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="border border-red-700 rounded-full bg-red-700 text-white hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2"
                        >
                            {isLoading ? 'Guardando...' : 'Agregar'}
                        </Button>
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
                                        {tiposDonacion.find(t => t.value === d.tipoDonacion.tipoDonacion)?.label || d.tipoDonacion.tipoDonacion}
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


