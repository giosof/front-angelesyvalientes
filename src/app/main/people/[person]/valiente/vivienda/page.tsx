'use client'

import { saveVivienda } from "@/app/helpers/api";
import { Toaster } from "@/components/ui/toaster";
import { Box, Button, Checkbox, Input,Text, Field, CheckboxGroup, CheckboxCard, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm } from "react-hook-form"

const ViviendaForm = () => {
  const params = useParams()
  const personId = params.person as string
  const [message, setMessage] = useState<string | null>(null)

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

  const { register, handleSubmit, reset, watch } = useForm({ defaultValues });

  const watchedFields = watch(['direccion', 'Agua', 'Gas', 'Internet', 'Alcantarillado', 'Luz']);

  const onSubmit = async (data: any) => {
    const viviendaData = {
      id: personId,
      direccion: watchedFields[0],
      agua: watchedFields[1] === "Agua" ? true : false,
      gas: watchedFields[2] === "Gas" ? true : false,
      internet: watchedFields[3] === "Internet" ? true : false,
      alcantarillado: watchedFields[4] === "Alcantarillado" ? true : false,
      luz: watchedFields[5] === "Luz" ? true : false
    };

    console.log(viviendaData);
    try {
      const response = await saveVivienda(viviendaData);
      if (response) {
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

  return (
    <div>
      <Toaster />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-12 justify-between">
          <p className="mb-6">Valiente | Vivienda</p>
        </div>
       

        <Box className="p-4">
          <Text fontSize="xl" mb={4}>Visita Domiciliaria</Text>
          <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <Field.Root defaultValue={""} >
            <Text mb={-2}>Direccion</Text>
              <Input {...register('direccion')} 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
              type="text" />
            </Field.Root>
          </div>
        </div>
          <Text mb={2}>Servicios Básicos</Text>
          <Box mb={4}>
          <CheckboxGroup mb={7} defaultValue={["agua"]}>
            <Flex gap="2">
              {items.map((item) => (
                <CheckboxCard.Root key={item.value} value={item.value}>
                  <CheckboxCard.HiddenInput {...register(item.value)} />
                  <CheckboxCard.Control className="bg-gray-200 border border-gray-200 rounded p-2">
                    <CheckboxCard.Content>
                      <CheckboxCard.Label>{item.title}</CheckboxCard.Label>
                    </CheckboxCard.Content>
                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>
              ))}
            </Flex>
          </CheckboxGroup>

          <Button mb={3} className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
            type="submit">
            <BsFillSave2Fill />Guardar
          </Button>

          </Box>

          <Text fontSize="lg" mb={3}>Grupo Familiar</Text>
          <Box display="flex" alignItems="center" mb={4}>
            <Input placeholder="Nombre" {...register('nombre')} mr={2} />
            <select {...register('trabaja')} >
      <option value="si">Sí</option>
      <option value="no">No</option>
    </select>
            <Checkbox.Root {...register('sabeLeer')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Leer</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root {...register('sabeEscribir')} variant="solid" colorPalette="default" mr={2}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Escribir</Checkbox.Label>
            </Checkbox.Root>
            <Input placeholder="Novedades" {...register('novedades')} mr={2} />
            <Button colorScheme="purple">Agregar</Button>
          </Box>

          
            <table className="min-w-full border-separate border-4 border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 border border-gray-200 bg-red-100" >Nombre</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Trabaja</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Seguridad Social</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Leer</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Escribir</th>
                  <th className="py-2 border border-gray-200 bg-red-100" >Novedades</th>
                </tr>
              </thead>
              <tbody>
                
                  <tr>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                    <td className="py-2 px-4 border border-gray-200 bg-white text-gray-700 text-center">{""}</td>
                  </tr>
                
              </tbody>
            </table>

          <Button colorScheme="yellow" mt={4}>Guardar</Button>
        </Box>
      </form>
    </div>
  );
};

export default ViviendaForm;