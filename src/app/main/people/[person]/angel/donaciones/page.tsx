'use client'

import { useState, useEffect } from 'react';
import {
    Button,
    Input,
} from '@chakra-ui/react';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { saveDonacion, saveAngel, fetchTiposDonacion, fetchDonacionesByPersona } from '@/app/helpers/api';
import toast from 'react-hot-toast';

interface TipoDonacion {
    id: number;
    tipoDonacion: string;
}

interface Donacion {
    idDonacion: number;
    fecha: string;
    observacion: string;
    idTipoDonacion: number;
    nombreTipoDonacion: string;
    idPersona: number;
    nombrePersona: string;
}

const Donaciones = () => {
    const params = useParams();
    const personId = params.person as string;
    const [profesion, setProfesion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [donaciones, setDonaciones] = useState<Donacion[]>([]);
    const [tiposDonacion, setTiposDonacion] = useState<TipoDonacion[]>([]);
    const [donacion, setDonacion] = useState<any>({
        tipo: '',
        observacion: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            const tipos = await fetchTiposDonacion();
            if (tipos) {
                setTiposDonacion(tipos);
            }
            const donacionesData = await fetchDonacionesByPersona(personId);
            if (donacionesData) {
                setDonaciones(donacionesData);
            }
        };
        cargarDatos();
    }, [personId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDonacion({ ...donacion, [name]: value });
    };

    const handleAgregar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!donacion.tipo || !donacion.observacion) {
            toast.error('Por favor complete todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            const donacionData = {
                idDonacion: 0,
                tipoDonacion: {
                    id: parseInt(donacion.tipo),
                    tipoDonacion: tiposDonacion.find(t => t.id === parseInt(donacion.tipo))?.tipoDonacion || ''
                },
                fecha: new Date().toISOString().split('T')[0],
                observacion: donacion.observacion
            };

            const angelData = {
                idPersona: personId,
                profesion: profesion,
                descripcion: descripcion
            };

            const response = await saveDonacion(personId, donacionData);
            const angelResponse = await saveAngel(angelData);
            
            if (response && angelResponse) {
                toast.success('Donación guardada exitosamente');
                // Recargar las donaciones después de guardar
                const donacionesData = await fetchDonacionesByPersona(personId);
                if (donacionesData) {
                    setDonaciones(donacionesData);
                }
                setDonacion({ tipo: '', observacion: '' });
            }
        } catch (error) {
            console.error('Error al guardar la donación:', error);
            toast.error('Error al guardar la donación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 bg-background min-h-screen">
            <p className="mb-6">Angel  | Donaciones</p>
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
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <Input
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="mb-2 font-bold text-xs uppercase tracking-wide text-gray-700">Donaciones</div>
                <form onSubmit={handleAgregar} className="flex flex-wrap -mx-3 items-end">
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
                                <option key={tipo.id} value={tipo.id}>{tipo.tipoDonacion}</option>
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
                                <div key={d.idDonacion} className="flex flex-wrap items-center py-2">
                                    <div className="w-full md:w-1/4 font-semibold text-gray-800">
                                        {d.nombreTipoDonacion}
                                    </div>
                                    <div className="w-full md:w-1/4 text-gray-600">
                                        {new Date(d.fecha).toLocaleDateString()}
                                    </div>
                                    <div className="w-full md:w-1/3 text-gray-600">
                                        {d.observacion}
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


