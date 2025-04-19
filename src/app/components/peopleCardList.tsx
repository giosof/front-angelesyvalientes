"use client"

import {
  Box,
  Button,
  Card,
  Heading,
  Stack,
  SimpleGrid,
  Text
} from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react/flex"
import { useRouter } from 'next/navigation'

const PeopleCardList = ({ peopleList }: { peopleList: any[] }) => {
  const router = useRouter()

  return (
    <Box className="p-4">
      <Stack>
        {peopleList.map((person: any) => (
          <Card.Root 
            key={person.nmIdPersona}
            className="bg-white dark:bg-amber-200 border border-transparent rounded-2xl shadow-md hover:shadow-xl transition-all"
            borderRadius="2xl"
            p={1}
            shadow="md"
            _hover={{ shadow: "lg", transform: "scale(1.01)", transition: "0.2s" }}
            onClick={() => router.push(`/main/people/${person.nmIdPersona}`)}
          >
            <Card.Header >
              <Heading className="text-lg font-semibold text-gray-600 dark:text-stone-700">{person.txPrimerNombre} {person.txSegundoNombre} {person.txPrimerApellido} {person.txSegundoApellido}</Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 3 }}>
                <Box>
                  <Text  className="text-sm font-semibold text-gray-600 dark:text-stone-700">Identificación:</Text>
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
      </Stack>
    </Box>
  )
}

export default PeopleCardList
