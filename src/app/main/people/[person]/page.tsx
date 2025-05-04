'use client'

// Importación de helpers para consumir APIs y componentes UI necesarios
import { fetchGeneros, fetchPersonInfo, fetchTiposIdentificacion, savePersona } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, Em, Field, Input } from "@chakra-ui/react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form"

// Definición de la interfaz con los campos que tendrá el formulario
interface FormValues {
  tipoIdentificacion: string
  txNumeroIdentificacion: string
  txPrimerNombre: string
  txSegundoNombre?: string
  txPrimerApellido: string
  txSegundoApellido?: string
  genero: string
  txTelefono: string
  txCorreo: string
}

const PersonPage = () => {
  const params = useParams()
  // Obtención del ID de persona desde la URL
  const personId = params.person as string

  // Estados locales para almacenar catálogos y datos de persona
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any>([]);
  const [generos, setGeneros] = useState<any>([]);
  const [persona, setPersona] = useState<any>();
  const [errorMessage, setErrorMessage] = useState('');

  // Configuración del formulario con React Hook Form
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>()

  useEffect(() => {
    // Función para obtener info de la persona si existe
    async function getInfo() {
      if (personId && personId !== "0") {
        const resPersona = await fetchPersonInfo(personId)
        setPersona(resPersona)

        // Asignar valores recibidos al formulario
        Object.entries(resPersona).forEach(([key, value]) => {
          if (value && typeof value !== 'object') setValue(key as keyof FormValues, String(value))
        })

        // Asignar valores especiales de objetos anidados
        setValue("tipoIdentificacion", resPersona.tipoIdentificacion?.nmTipoIdentificacion.toString())
        setValue("genero", resPersona.genero?.nmIdGenero.toString())
      } else {
        // Asignar valor por defecto a objetos especiales
        setValue("tipoIdentificacion", "1")
        setValue("genero", "1")
      }
    }

    // Función para obtener los catálogos de selects
    async function getLists() {
      setTiposIdentificacion(await fetchTiposIdentificacion())
      setGeneros(await fetchGeneros())
    }

    // Ejecutar las funciones al montar el componente
    getLists();
    getInfo();
  }, [])

  // Función que se ejecuta al enviar el formulario
  const onSubmit: SubmitHandler<FormValues> = (async (data: FormValues) => {
    const formData = new FormData()
    // Agregar datos del formulario al FormData para enviarlos al servidor
    if (personId !== "0") {
      formData.append("idPersona", personId)
    }

    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    const result = await savePersona(formData)

    // Mostrar notificación según la respuesta del servidor
    if (result && result.nmIdPersona) {
      toaster.create({
        title: "Persona guardada",
        description: "La información fue almacenada exitosamente",
        type: "success"
      })
      redirect('/main/people/' + result.nmIdPersona)
    } else {
      toaster.create({
        title: "Error",
        description: result?.error || "No fue posible guardar la persona.",
        type: "error"
      })
    }
  })

  return (
    <div>
        <Toaster />
        {/* Formulario de captura de información personal */}
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Header con título y botón de guardar */}
          <div className="flex flex-wrap -mx-3 mb-12 justify-between">
            <p className="mb-6">Datos Básicos</p>
            <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
            type="submit"
            loading={isSubmitting}>
              <BsFillSave2Fill />Guardar
            </Button>
          </div>

          {/* Primera fila de campos */}
          <div className="flex flex-wrap -mx-3 mb-6 ">
            {/* Campo: Tipo de identificación */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Tipo de Identificación <Em className="text-red-500">*</Em>
              </label>
              <Field.Root {...register("tipoIdentificacion")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
              >
                {/* Renderizado dinámico de opciones */}
                {tiposIdentificacion.map((tipo: any) => (
                      <option key={tipo.nmTipoIdentificacion} value={tipo.nmTipoIdentificacion.toString()}>{tipo.txTipoIdentificacion.toString()}</option>
                ))}
              </Field.Root>
            </div>

            {/* Campo: Número de identificación */}
            <div className="w-full md:w-1/2 px-3">
              <Field.Root required defaultValue={persona?.txNumeroIdentificacion} >
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Identificación <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("txNumeroIdentificacion")}
                defaultValue={persona?.txNumeroIdentificacion} 
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text" />
              </Field.Root>
            </div>
          </div>

          {/* Segunda fila de nombres y apellidos */}
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Primer Nombre */}
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <Field.Root required>
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Primer Nombre <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("txPrimerNombre")}
                defaultValue={persona?.txPrimerNombre} 
                className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                type="text" />
              </Field.Root>
            </div>

            {/* Segundo Nombre */}
            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Segundo Nombre 
                </Field.Label>
                <Input {...register("txSegundoNombre")}
                defaultValue={persona?.txSegundoNombre} 
                className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                type="text" />
              </Field.Root>
            </div>

            {/* Primer Apellido */}
            <div className="w-full md:w-1/4 px-3">
              <Field.Root required>
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Primer Apellido <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("txPrimerApellido")}
                defaultValue={persona?.txPrimerApellido} 
                className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text" />
              </Field.Root>
            </div>

            {/* Segundo Apellido */}
            <div className="w-full md:w-1/4 px-3">
              <Field.Root>
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Segundo Apellido 
                </Field.Label>
                <Input {...register("txSegundoApellido")}
                defaultValue={persona?.txSegundoApellido} 
                className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text" />
              </Field.Root>
            </div>
          </div>

          {/* Tercera fila: Género, Teléfono, Correo */}
          <div className="flex flex-wrap -mx-3 mb-2">
            {/* Género */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Género
              </label>
              <select {...register("genero")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
              >
                {/* Opciones dinámicas */}
                {generos.map((genero: any) => (
                      <option key={genero.nmIdGenero} value={genero.nmIdGenero.toString()}>{genero.txGenero.toString()}</option>
                ))}
              </select>
            </div>

            {/* Teléfono */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root required>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Teléfono <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("txTelefono")}
                defaultValue={persona?.txTelefono} 
                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number" 
                placeholder="6045555555" />
                <Field.HelperText>Ej: 6045512345 o 3192345678</Field.HelperText>
              </Field.Root>
            </div>

            {/* Correo */}
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root invalid={!!errors.txCorreo}>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Correo electrónico <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("txCorreo", {
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" }
                })}
                defaultValue={persona?.txCorreo} 
                className="appearance-none lowercase w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="mail" 
                placeholder="correo@mail.com.co" />
                <Field.HelperText>Ej: juan.rodriguez@mimail.org</Field.HelperText>
                <Field.ErrorText>{errors.txCorreo?.message}</Field.ErrorText>
              </Field.Root>
            </div>
          </div>
        </form>
    </div>
  );
};

export default PersonPage;
