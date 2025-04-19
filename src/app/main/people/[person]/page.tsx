'use client'

import { fetchGeneros, fetchPersonInfo, fetchTiposIdentificacion, savePersona } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, Em, Field, Input } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form"

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
  const personId = params.person as string
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any>([]);
  const [generos, setGeneros] = useState<any>([]);
  const [persona, setPersona] = useState<any>();
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>()

  useEffect(() => {
    async function getInfo() {
      if (personId && personId !== "0") {
        const resPersona = await fetchPersonInfo(personId)
        setPersona(resPersona)

        Object.entries(resPersona).forEach(([key, value]) => {
          if (value && typeof value !== 'object') setValue(key as keyof FormValues, String(value))
        })

        setValue("tipoIdentificacion", resPersona.tipoIdentificacion?.nmTipoIdentificacion.toString())
        setValue("genero", resPersona.genero?.nmIdGenero.toString())
      }
    }

    async function getLists() {
      setTiposIdentificacion(await fetchTiposIdentificacion())
      setGeneros(await fetchGeneros())
    }

    getLists();
    getInfo();
  }, [])

  const onSubmit: SubmitHandler<FormValues> = (async (data: FormValues) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    const result = await savePersona(formData)

    if (result && result.nmIdPersona) {
      toaster.create({
        title: "Persona guardada",
        description: "La información fue almacenada exitosamente",
        type: "success"
      })
    } else {
      toaster.create({
        title: "Error",
        description: result.error || "No fue posible guardar la persona.",
        type: "error"
      })
    }
  })

  return (
    <div>
        <Toaster />
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-12 justify-between">
            <p className="mb-6">Datos Básicos</p>
            <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
            type="submit"
            loading={isSubmitting}>
              <BsFillSave2Fill />Guardar
            </Button>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Tipo de Identificación <Em className="text-red-500">*</Em>
              </label>
              <select {...register("tipoIdentificacion")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                defaultValue={persona?.tipoIdentificacion.nmTipoIdentificacion.toString()}
              >
                {tiposIdentificacion.map((tipo: any) => (
                      <option key={tipo.nmTipoIdentificacion} value={tipo.nmTipoIdentificacion.toString()}>{tipo.txTipoIdentificacion.toString()}</option>
                ))}
              </select>
            </div>
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
          <div className="flex flex-wrap -mx-3 mb-6">
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
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Género
              </label>
              <select {...register("genero")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                
              >
                {generos.map((genero: any) => (
                      <option key={genero.nmIdGenero} value={genero.nmIdGenero.toString()}>{genero.txGenero.toString()}</option>
                ))}
              </select>
            </div>
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
