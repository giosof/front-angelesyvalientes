'use client'

import { saveVivienda, fetchPersonInfo, fetchPeopleList, saveFamiliar, 
  fetchFamiliaresByVivienda, asignarVivienda } from "@/app/helpers/api";
import { Toaster } from "@/components/ui/toaster";
import { Box, Button, Input, Text, Field, CheckboxGroup, CheckboxCard, Flex, Stack } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from '@chakra-ui/alert';

interface Vivienda {
    id: number;
    direccion: string;
    agua: boolean;
    luz: boolean;
    gas: boolean;
    internet: boolean;
    alcantarillado: boolean;
}

interface Persona {
    id: number;
    txPrimerNombre: string;
    txSegundoNombre: string;
    txPrimerApellido: string;
    txSegundoApellido: string;
    vivienda?: Vivienda;
}

const ViviendaForm = () => {
    const params = useParams();
    const personId = params.person as string;
    const [message, setMessage] = useState<string | null>(null);
    const [persona, setPersona] = useState<Persona | null>(null);
    const [personasConVivienda, setPersonasConVivienda] = useState<Persona[]>([]);
    const [tipoVivienda, setTipoVivienda] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
    const [familiares, setFamiliares] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [familiar, setFamiliar] = useState({
        nombre: '',
        tipoIdentificacionId: 1,
        numeroIdentificacion: '',
        trabajo: false,
        seguridadSocial: false,
        lee: false,
        escribe: false,
        observaciones: ''
    });

    const items = [
        { value: "Agua", title: "Agua" },
        { value: "Gas", title: "Gas" },
        { value: "Internet", title: "Internet" },
        { value: "Alcantarillado", title: "Alcantarillado" },
        { value: "Luz", title: "Luz" },
    ];

    const defaultValues = {
        Agua: false,
        Gas: false,
        Internet: false,
        Alcantarillado: false,
        Luz: false,
        direccion: ""
    };

    const { register, handleSubmit, reset, watch, setValue } = useForm({ defaultValues });

    const watchedFields = watch(['direccion', 'Agua', 'Gas', 'Internet', 'Alcantarillado', 'Luz']);

    useEffect(() => {
        const cargarDatos = async () => {
            const data = await fetchPersonInfo(personId);
            if (data) {
                setPersona(data);
                if (data.vivienda) {
                    setValue('direccion', data.vivienda.direccion);
                    setValue('Agua', data.vivienda.agua);
                    setValue('Gas', data.vivienda.gas);
                    setValue('Internet', data.vivienda.internet);
                    setValue('Alcantarillado', data.vivienda.alcantarillado);
                    setValue('Luz', data.vivienda.luz);
                }
            }
        };
        cargarDatos();
    }, [personId, setValue]);

    useEffect(() => {
        const cargarFamiliares = async () => {
            let idVivienda = persona?.vivienda?.id;
            if (idVivienda) {
                const familiaresData = await fetchFamiliaresByVivienda(idVivienda);
                if (familiaresData) setFamiliares(familiaresData);
            } else {
                setFamiliares([]);
            }
        };
        cargarFamiliares();
    }, [persona?.vivienda?.id]);

    const cargarPersonasConVivienda = async () => {
        const personas = await fetchPeopleList();
        if (personas) {
            const personasConVivienda = personas.filter((p: Persona) => p.vivienda);
            setPersonasConVivienda(personasConVivienda);
        }
    };

    const handleSeleccionarPersona = async (persona: Persona) => {
        setPersonaSeleccionada(persona);
        if (persona.vivienda) {
            
            await asignarVivienda(personId, persona.vivienda.id);

            setValue('direccion', persona.vivienda.direccion);
            setValue('Agua', persona.vivienda.agua);
            setValue('Gas', persona.vivienda.gas);
            setValue('Internet', persona.vivienda.internet);
            setValue('Alcantarillado', persona.vivienda.alcantarillado);
            setValue('Luz', persona.vivienda.luz);

            // Cargar familiares de la vivienda seleccionada
            const familiaresData = await fetchFamiliaresByVivienda(persona.vivienda.id);
            if (familiaresData) setFamiliares(familiaresData);
        }
        setModalOpen(false);
    };

    const onSubmit = async (data: any) => {
        const viviendaData = {
            id: personId,
            direccion: watchedFields[0],
            agua: !!watchedFields[1],
            gas: !!watchedFields[2],
            internet: !!watchedFields[3],
            alcantarillado: !!watchedFields[4],
            luz: !!watchedFields[5]
        };

        try {
            const response = await saveVivienda(viviendaData);
            const response2 = await asignarVivienda(personId, response.id);
            if (response && response2) {
                setMessage('Vivienda guardada exitosamente');
                reset();
                return;
            } else {
                setMessage('Error al guardar la vivienda');
            }
        } catch (error) {
            setMessage('Error al guardar la vivienda');
        }
    };

    const handleFamiliarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFamiliar(prev => ({
            ...prev,
            [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value
        }));
    };

    const agregarFamiliar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!familiar.nombre) return;
        let idVivienda = persona?.vivienda?.id;
        if (!idVivienda) return;
        const familiarData = {
            ...familiar,
            trabajo: Boolean(familiar.trabajo),
            seguridadSocial: Boolean(familiar.seguridadSocial),
            lee: Boolean(familiar.lee),
            escribe: Boolean(familiar.escribe),
            idVivienda: idVivienda
        };
        const response = await saveFamiliar(familiarData);
        if (response) {
            const familiaresData = await fetchFamiliaresByVivienda(idVivienda);
            if (familiaresData) setFamiliares(familiaresData);
            setFamiliar({ nombre: '', tipoIdentificacionId: 1, numeroIdentificacion: '', trabajo: false, seguridadSocial: false, lee: false, escribe: false, observaciones: '' });
        }
    };

    const personasFiltradas = personasConVivienda.filter(persona =>
        `${persona.txPrimerNombre} ${persona.txSegundoNombre} ${persona.txPrimerApellido} ${persona.txSegundoApellido}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen py-11 p-6">
          <div className="flex flex-wrap -mx-3 mb-6 justify-between">
                <h1 className="mb-6">Valiente | Vivienda</h1>
            </div>
            <Toaster />
            <Box>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    {!persona?.vivienda && (
                        <Box className="p-4 mb-8 bg-red-50 rounded-xl border border-red-100">
                            <Text fontSize="xl" fontWeight="semibold" mb={4} color="red.700">Seleccione el tipo de vivienda</Text>
                            <RadioGroup value={tipoVivienda} onChange={setTipoVivienda}>
                                <Stack direction="row" gap={8}>
                                    <Radio value="existente" colorScheme="red">Seleccionar vivienda existente</Radio>
                                    <Radio value="nueva" colorScheme="red">Vivienda nueva</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                    )}

                    {(persona?.vivienda || tipoVivienda === "nueva") && (
                        <Box className="p-6 mb-8 bg-gray-100 rounded-xl border border-gray-200">
                            <Text fontSize="xl" fontWeight="semibold" mb={4} color="red.700">Visita Domiciliaria</Text>
                            <Divider mb={4} />
                            <Flex direction={{ base: "column", md: "row" }} gap={6} mb={6}>
                                <Box flex={1}>
                                    <Field.Root defaultValue={""}>
                                        <Text mb={1} fontWeight="medium">Dirección</Text>
                                        <Input {...register('direccion')}
                                            className="bg-gray-200 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:bg-white focus:border-blue-400 text-black"
                                            type="text"
                                            placeholder="Dirección de la vivienda"
                                        />
                                    </Field.Root>
                                </Box>
                            </Flex>
                            <Text mb={2} fontWeight="medium">Servicios Básicos</Text>
                            <Box mb={4}>
                                <CheckboxGroup mb={7}>
                                    <Flex gap={4} wrap="wrap">
                                        {items.map((item) => (
                                            <CheckboxCard.Root key={item.value} value={item.value}>
                                                <CheckboxCard.HiddenInput {...register(item.value as "Agua" | "Gas" | "Internet" | "Alcantarillado" | "Luz")} />
                                                <CheckboxCard.Control className="bg-gray-200 border border-gray-300 rounded-lg p-3 hover:bg-purple-50">
                                                    <CheckboxCard.Content>
                                                        <CheckboxCard.Label className="font-semibold text-gray-700">{item.title}</CheckboxCard.Label>
                                                    </CheckboxCard.Content>
                                                    <CheckboxCard.Indicator />
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        ))}
                                    </Flex>
                                </CheckboxGroup>
                                <Button mb={3} colorScheme="red" borderRadius="full" px={8} py={2} fontWeight="bold" type="submit" className="shadow-md hover:bg-red-600">
                                <BsFillSave2Fill className="mr-2" />Guardar
                            </Button>
                            </Box>
                            <Box className="mt-8 mb-8 bg-white rounded-xl border border-gray-200 p-6">
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.700">Grupo Familiar</Text>
                                <Box as="section" className="flex flex-wrap gap-4 items-end mb-4">
                                    <Input
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={familiar.nombre}
                                        onChange={handleFamiliarChange}
                                        className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                                        w="auto"
                                        maxW="200px"
                                    />
                                    <Input
                                        placeholder="N° Identificación"
                                        name="numeroIdentificacion"
                                        value={familiar.numeroIdentificacion}
                                        onChange={handleFamiliarChange}
                                        className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                                        w="auto"
                                        maxW="160px"
                                    />
                                    <Box>
                                        <Text fontSize="sm" mb={1}>¿Trabaja?</Text>
                                        <input
                                            type="checkbox"
                                            name="trabajo"
                                            checked={familiar.trabajo}
                                            onChange={handleFamiliarChange}
                                            className="mr-2"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" mb={1}>¿Seguridad Social?</Text>
                                        <input
                                            type="checkbox"
                                            name="seguridadSocial"
                                            checked={familiar.seguridadSocial}
                                            onChange={handleFamiliarChange}
                                            className="mr-2"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" mb={1}>¿Lee?</Text>
                                        <input
                                            type="checkbox"
                                            name="lee"
                                            checked={familiar.lee}
                                            onChange={handleFamiliarChange}
                                            className="mr-2"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" mb={1}>¿Escribe?</Text>
                                        <input
                                            type="checkbox"
                                            name="escribe"
                                            checked={familiar.escribe}
                                            onChange={handleFamiliarChange}
                                            className="mr-2"
                                        />
                                    </Box>
                                    <Input
                                        placeholder="Observaciones"
                                        name="observaciones"
                                        value={familiar.observaciones}
                                        onChange={handleFamiliarChange}
                                        className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                                        w="auto"
                                        maxW="200px"
                                    />
                                    <Button type="button" colorScheme="red" borderRadius="full" px={6} fontWeight="bold" onClick={agregarFamiliar}
                                     className="bg-red-700 text-white hover:bg-red-600 rounded-full">Agregar</Button>
                                </Box>
                                <Box overflowX="auto">
                                    <table className="min-w-full border-separate border-2 border-gray-200 rounded-lg">
                                        <thead>
                                            <tr>
                                                <th className="py-2 border border-gray-200 bg-red-100">Nombre</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">N° Identificación</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">Trabaja</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">Seguridad Social</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">Lee</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">Escribe</th>
                                                <th className="py-2 border border-gray-200 bg-red-100">Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {familiares.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="py-2 px-4 border border-gray-200 bg-white text-gray-500 text-center">Sin familiares agregados</td>
                                                </tr>
                                            ) : (
                                                familiares.map((f, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.nombre}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.numeroIdentificacion}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.trabajo ? 'Sí' : 'No'}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.seguridadSocial ? 'Sí' : 'No'}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.lee ? 'Sí' : 'No'}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.escribe ? 'Sí' : 'No'}</td>
                                                        <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{f.observaciones}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </Box>
                            </Box>
                            
                        </Box>
                    )}

                    {tipoVivienda === "existente" && (
                        <Button onClick={() => {
                            cargarPersonasConVivienda();
                            setModalOpen(true);
                        }} colorScheme="red" borderRadius="full" px={8} py={2} fontWeight="bold" className="shadow-md mb-8">
                            Seleccionar Vivienda Existente
                        </Button>
                    )}

                    {/* Modal propio */}
                    {modalOpen && (
                        <Box position="fixed" top={0} left={0} width="100vw" height="100vh" bg="blackAlpha.600" zIndex={1000} display="flex" alignItems="center" justifyContent="center">
                            <Box bg="white" borderRadius="xl" p={8} maxW="2xl" w="full" boxShadow="2xl" maxHeight="80vh" overflowY="auto">
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Text fontWeight="bold" fontSize="lg" color="red.700">Seleccionar Vivienda Existente</Text>
                                    <Button onClick={() => setModalOpen(false)} size="sm" colorScheme="red" borderRadius="full">Cerrar</Button>
                                </Flex>
                                <Divider mb={4} />
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre"
                                    className="w-full mb-4 p-2 focus:outline-none text-black"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <div className="max-h-96 overflow-y-auto">
                                    {personasFiltradas.map((persona) => (
                                        <div
                                            key={persona.id}
                                            className="p-4 border-b flex items-center justify-between hover:bg-purple-50 rounded-lg transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {persona.txPrimerNombre} {persona.txSegundoNombre} {persona.txPrimerApellido} {persona.txSegundoApellido}
                                                </p>
                                                {persona.vivienda && (
                                                    <p className="text-sm text-gray-600">
                                                        Dirección: {persona.vivienda.direccion}
                                                    </p>
                                                )}
                                            </div>
                                            <Button size="sm" colorScheme="red" borderRadius="full" onClick={() => handleSeleccionarPersona(persona)}>
                                                Seleccionar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Box>
                        </Box>
                    )}

                    {message && (
                        <Alert status={message.includes('exitosamente') ? 'success' : 'error'} mt={4} borderRadius="md">
                            <AlertTitle>{message}</AlertTitle>
                        </Alert>
                    )}
                </form>
            </Box>
        </div>
    );
};

export default ViviendaForm;