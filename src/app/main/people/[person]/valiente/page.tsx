'use client'

import { fetchClasificacionesValiente, fetchGeneros, fetchGruposEtnicos, fetchPersonInfo, fetchTiposIdentificacion, savePersona, saveValiente, updateValiente } from "@/app/helpers/api";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Button, Checkbox, Em, Field, Group, IconButton, Input } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillSave2Fill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form"
import { Text } from "@chakra-ui/layout";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)

import "react-datepicker/dist/react-datepicker.css";
import { FaExternalLinkAlt } from "react-icons/fa";

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
  grupoEtnico: string
  clasificacionValiente: string
}

const PersonPage = () => {
  const params = useParams()
  const personId = params.person as string
  const [clasificacionesValiente, setClasificaciones] = useState<any>([]);
  const [gruposEtnicos, setGruposEtnicos] = useState<any>([]);
  const [persona, setPersona] = useState<any>();
  const [startDate, setStartDate] = useState<Date>();
  const { register, handleSubmit, setValue, getValues, formState: { errors, isSubmitting }, watch } = useForm<FormValues>()

  useEffect(() => {
    async function getInfo() {
      if (personId && personId !== "0") {
        const resPersona = await fetchPersonInfo(personId)
        setPersona(resPersona)
        if (resPersona.fechaNacimiento) {
          const fecha = new Date(resPersona.fechaNacimiento);
          if (!isNaN(fecha.getTime())) {
            fecha.setDate(fecha.getDate() + 1);
            setStartDate(fecha);
          } else {
            setStartDate(undefined);
          }
        } else {
          setStartDate(undefined);
        }

        Object.entries(resPersona).forEach(([key, value]) => {
          if (value && typeof value !== 'object') setValue(key as keyof FormValues, String(value))
        })

        // Asignar valores especiales de objetos anidados
        setValue("clasificacionValiente", resPersona.clasificacionValiente?.id?.toString() || "1")
        setValue("grupoEtnico", resPersona.grupoEtnico?.id?.toString() || "1")
        setValue("poblacionLgtbiq", resPersona.poblacionLgtbiq || false)
      } else {
        setValue("clasificacionValiente", "1")
        setValue("grupoEtnico", "1")
        setValue("poblacionLgtbiq", false)
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
    
    // Asegurar que el ID de persona se envíe correctamente
    formData.append('nmIdPersona', personId)
    
    // Asegurar que la fecha se envíe en el formato correcto
    if (startDate) {
      const formattedDate = startDate.toISOString().split('T')[0]
      formData.append('fechaNacimiento', formattedDate)
    }

    // Agregar el resto de los campos
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'nmIdPersona' && key !== 'fechaNacimiento') {
        if (key === 'grupoEtnico' || key === 'clasificacionValiente') {
          formData.append(key, value || "1") // Asegurar que siempre haya un valor por defecto
        } else if (['nombreResponsable', 'parentescoResponsable', 'tallaCamisa', 'tallaPantalon'].includes(key)) {
          formData.append(key, String(value).toUpperCase()) // Convertir a mayúsculas
        } else {
          formData.append(key, value)
        }
      }
    })

    const result = persona?.clasificacionValiente 
      ? await updateValiente(personId, formData)
      : await saveValiente(formData)

    if (result && result.id) {
      toaster.create({
        title: "Persona guardada",
        description: "La información fue almacenada exitosamente",
        type: "success"
      })
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
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-12 justify-between">
            <p className="mb-6">Valiente | Datos Personales</p>
            <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" 
            type="submit"
            loading={isSubmitting}>
              <BsFillSave2Fill />Guardar
            </Button>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Clasificación valiente <Em className="text-red-500">*</Em>
              </label>
              <select {...register("clasificacionValiente")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {clasificacionesValiente.map((clasificacion: any) => (
                      <option key={clasificacion.id} value={clasificacion.id.toString()}>{clasificacion.descripcion.toString()}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              
              <Field.Root required>
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Fecha de Nacimiento <Field.RequiredIndicator />
                </Field.Label>
                <DatePicker 
                  {...register("fechaNacimiento")}
                  dateFormat="yyyy-MM-dd"
                  locale="es"
                  className="appearance-none uppercase block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                  selected={startDate} onChange={(date) => setStartDate(date ? date : new Date())} />
              </Field.Root>
            </div>
            <div className="w-full md:w-1/3 px-3">
              <Field.Root defaultValue={persona?.txNumeroIdentificacion} className="flex flex-wrap">
                <Field.Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Galería de Fotos <Field.RequiredIndicator />
                </Field.Label>
                <Group attached w="full" maxW="sm">
                  <Input {...register("urlGaleria")}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  type="text" />
                  {watch("urlGaleria") && (
                    <IconButton
                      variant="ghost"
                      size="xs"
                      onClick={() => window.open(watch("urlGaleria"), '_blank')}
                      aria-label="Abrir galería"
                    >
                      <FaExternalLinkAlt />
                    </IconButton>
                  )}
                </Group>
              </Field.Root>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4 justify-between">
            <Text className="text-xs px-3 mb-2">Grupos poblacionales</Text>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6 items-center">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                Grupo Étnico <Em className="text-red-500">*</Em>
              </label>
              <select {...register("grupoEtnico")}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {gruposEtnicos.map((grupoEtnico: any) => (
                      <option key={grupoEtnico.id} value={grupoEtnico.id.toString()}>{grupoEtnico.descripcion.toString()}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 md:ps-6 pt-4 inline-block">
              <Checkbox.Root
                checked={watch("poblacionLgtbiq")}
                onCheckedChange={(details) => {
                  setValue("poblacionLgtbiq", details.checked === true, { shouldValidate: true });
                }}
                className="flex items-center gap-2"
              >
                <Checkbox.HiddenInput {...register("poblacionLgtbiq")} />
                <Checkbox.Control className="w-5 h-5 border border-gray-300 rounded data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700" />
                <Checkbox.Label className="text-sm">¿Hace parte de la comunidad LGTBIQ+?</Checkbox.Label>
              </Checkbox.Root>
            </div>

          </div>
          <div className="flex flex-wrap -mx-3 mb-4 justify-between">
            <Text className="text-xs px-3 mb-2">Responsable</Text>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Nombre <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("nombreResponsable")}
                className="appearance-none uppercase w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text" 
                style={{ textTransform: 'uppercase' }} />
              </Field.Root>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Parentesco <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("parentescoResponsable")}
                className="appearance-none uppercase w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text" 
                style={{ textTransform: 'uppercase' }} />
                <Field.HelperText>Padre, Madre, Hermano, etc...</Field.HelperText>
              </Field.Root>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root >
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Teléfono <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("telefonoResponsable")}
                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number" 
                placeholder="6045555555" />
                <Field.HelperText>Ej: 6045512345 o 3192345678</Field.HelperText>
              </Field.Root>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4 justify-between">
            <Text className="text-xs px-3 mb-2">Tallas</Text>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Camisa <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("tallaCamisa")}
                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text" 
                style={{ textTransform: 'uppercase' }} />
                <Field.HelperText>Letras o números. Ej: 8, 10, 12,... o XS, S, M,...</Field.HelperText>
              </Field.Root>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Pantalón <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("tallaPantalon")}
                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                style={{ textTransform: 'uppercase' }} />
                <Field.HelperText>Letras o números. Ej: 8, 10, 12,... o XS, S, M,...</Field.HelperText>
              </Field.Root>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Field.Root>
                <Field.Label className="uppercase tracking-wide text-gray-700 text-xs font-bold">
                Zapatos <Field.RequiredIndicator />
                </Field.Label>
                <Input {...register("tallaCalzado")}
                className="appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"  />
                <Field.HelperText>Ej: 30, 32, ... 37</Field.HelperText>
              </Field.Root>
            </div>
          </div>
        </form>
    </div>
  );
};

export default PersonPage;
