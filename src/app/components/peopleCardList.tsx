'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  Stack,
  SimpleGrid,
  Text,
  Input
} from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react/flex"
import { useRouter } from 'next/navigation'
import { useState } from "react"

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
    <Box className="p-4">
      {/* Campo de búsqueda */}
      <Box mb={4}>
        <Input
          placeholder="Buscar por nombre o identificación"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Contenedor de cards */}
      <Stack>
        {filteredPeople.map((person: any) => (
          <Card.Root 
            key={person.nmIdPersona}
            className="bg-white dark:bg-amber-200 border border-transparent rounded-2xl shadow-md hover:shadow-xl transition-all"
            borderRadius="2xl"
            p={1}
            shadow="md"
            _hover={{ shadow: "lg", transform: "scale(1.01)", transition: "0.2s" }}
            onClick={() => router.push(`/main/people/${person.nmIdPersona}`)}
          >
            <Card.Header>
              <Heading className="text-lg font-semibold text-gray-600 dark:text-stone-700">
                {person.txPrimerNombre} {person.txSegundoNombre} {person.txPrimerApellido} {person.txSegundoApellido}
              </Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 3 }}>
                <Box>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-stone-700">Identificación:</Text>
                  <Text className="text-md text-gray-800 dark:text-stone-700">{person.txNumeroIdentificacion}</Text>
                </Box>
                <Box>
                  <Text className="text-sm font-semibold text-gray-600 dark:text-stone-700">Teléfono:</Text>
                  <Text className="text-md text-gray-800 dark:text-stone-700">{person.txTelefono}</Text>
                </Box>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        ))}

        {/* Mostrar mensaje si no hay resultados */}
        {filteredPeople.length === 0 && (
          <Text textAlign="center" color="gray.500">No se encontraron resultados.</Text>
        )}
      </Stack>
    </Box>
  )
}

export default PeopleCardList
