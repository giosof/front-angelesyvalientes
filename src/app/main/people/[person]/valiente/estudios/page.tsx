'use client'

import { fetchClasificacionesValiente, fetchGeneros, fetchGruposEtnicos, fetchPersonInfo, fetchTiposIdentificacion, savePersona } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, Checkbox, Em, Field, Input } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form"
import { Text } from "@chakra-ui/layout";

interface FormValues {
  nmIdPersona: number
  fechaNacimiento: string
  tallaCamisa?: string
  tallaPantalon?: string
  tallaCalzado?: string
  nombreResponsable?: string
  parentescoResponsable?: string
  telefonoResponsable?: string
  urlGaleria?: string
  poblacionConflictoArmado: boolean
  poblacionMigrante: boolean
  poblacionJoven: boolean
  poblacionMujer: boolean
  poblacionLgtbiq: boolean
  genero: string
  clasificacionValiente: string
}

const PersonPage = () => {
  const params = useParams()
  const personId = params.person as string
  const [clasificacionesValiente, setClasificaciones] = useState<any>([]);
  const [gruposEtnicos, setGruposEtnicos] = useState<any>([]);
  const [persona, setPersona] = useState<any>();
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>()

  useEffect(() => {
    async function getInfo() {
      if (personId && personId !== "0") {
        const resPersona = await fetchPersonInfo(personId)
        setPersona(resPersona)

        Object.entries(resPersona).forEach(([key, value]) => {
          if (value && typeof value !== 'object') setValue(key as keyof FormValues, String(value))
        })
      }
    }

    async function getLists() {
      setClasificaciones(await fetchClasificacionesValiente())
      setGruposEtnicos(await fetchGruposEtnicos())
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
            <p className="mb-6">Valiente | Estudios</p>
            <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
            type="submit"
            loading={isSubmitting}>
              <BsFillSave2Fill />Guardar
            </Button>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <Field.Root defaultValue={persona?.txNumeroIdentificacion} >
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Direccion<Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("urlGaleria")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text" />
              </Field.Root>
            </div>
          </div>
          
        </form>
    </div>
  );
};

export default PersonPage;
