'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  Stack,
  SimpleGrid,
  Text,
  Input,
  Flex,
  Image
} from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { FaHeart } from "react-icons/fa"

const PeopleCardList = ({ peopleList }: { peopleList: any[] }) => {
  const router = useRouter()

  // Estado para almacenar el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Función para filtrar las personas según nombre completo o número de identificación
  const filteredPeople = peopleList.filter((person) => {
    // Si no hay texto ingresado, retornar todos
    if (!searchTerm) return true

    // Concatenar nombre completo
    const fullName = `${person.txPrimerNombre} ${person.txSegundoNombre ?? ""} ${person.txPrimerApellido} ${person.txSegundoApellido ?? ""}`

    // Convertir ambos valores a minúscula y buscar coincidencias
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.txNumeroIdentificacion?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
  })

  return (
    <Box className="p-2">
      {/* Campo de búsqueda */}
      <Box className="flex items-center p-2 rounded-full mt-4 mb-4">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <Input
          className="w-full p-2 focus:outline-none"
          placeholder="Buscar por nombre o identificación"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Contenedor de cards */}
      <Stack gap={2}>
        {filteredPeople.map((person: any) => (
          <Card.Root 
            key={person.id}
            className="bg-white bg-amber-100 border border-transparent rounded-2xl shadow-md hover:shadow-xl transition-all"
            borderRadius="2xl"
            p={2}
            shadow="md"
            _hover={{ shadow: "lg", transform: "scale(1.01)", transition: "0.2s" }}
            onClick={() => router.push(`/main/people/${person.id}`)}
          >
            <Card.Header>
              <Flex justify="space-between" align="center" >
                <Heading className="text-lg font-semibold text-gray-600 dark:text-stone-700">
                  {person.txPrimerNombre} {person.txSegundoNombre} {person.txPrimerApellido} {person.txSegundoApellido}
                </Heading>
                <Flex gap={2}>
                  {person.fechaNacimiento && (
                    <Box color="red.500" title="Valiente">
                      <FaHeart size={20} />
                    </Box>
                  )}
                  {person.donacion && (
                    <Box title="Ángel">
                      <Image src="/wings.png" alt="Ángel" boxSize="20px" />
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={2}>
                <Box>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-stone-700">Identificación:</Text>
                  <Text className="text-md text-gray-800 dark:text-stone-700">{person.txNumeroIdentificacion}</Text>
                </Box>
                <Box>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-stone-700">Teléfono:</Text>
                  <Text className="text-md text-gray-800 dark:text-stone-700">{person.txTelefono || 'No registrado'}</Text>
                </Box>
                <Box>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-stone-700">Correo:</Text>
                  <Text className="text-md text-gray-800 dark:text-stone-700">{person.txCorreo || 'No registrado'}</Text>
                </Box>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        ))}
        
      </Stack>
    </Box>
  )
}

export default PeopleCardList
