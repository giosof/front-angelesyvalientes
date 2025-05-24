'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stack,
  Heading,
  ListItem,
  Container,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchValientesBirthdays, fetchValientesByClasificacion } from '@/app/helpers/api';

// Sample data for the chart
const chartData = [
  { month: 'Jan', Lectura: 180, Matemáticas: 80, Braille: 85 },
  { month: 'Feb', Lectura: 165, Matemáticas: 85, Braille: 95 },
  { month: 'Mar', Lectura: 190, Matemáticas: 90, Braille: 90 },
  { month: 'May', Lectura: 195, Matemáticas: 95, Braille: 92 },
  { month: 'Jun', Lectura: 185, Matemáticas: 88, Braille: 98 },
  { month: 'Aug', Lectura: 175, Matemáticas: 85, Braille: 88 },
  { month: 'Oct', Lectura: 170, Matemáticas: 90, Braille: 92 },
  { month: 'Nov', Lectura: 185, Matemáticas: 95, Braille: 94 },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
};

export default function CifrasPage() {
  const [birthdays, setBirthdays] = useState<Array<{
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
  }> | null>(null);
  const [childrenCount, setChildrenCount] = useState<number | null>(null);
  const [adultsCount, setAdultsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [birthdaysData, childrenData, adultsData] = await Promise.all([
          fetchValientesBirthdays(),
          fetchValientesByClasificacion(1),
          fetchValientesByClasificacion(2)
        ]);

        if (birthdaysData) {
          setBirthdays(birthdaysData);
        }
        
        setChildrenCount(childrenData);
        setAdultsCount(adultsData);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Container maxW="7xl" p={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
        {/* Stats Section */}
        <Box bg="gray.100" p={6} borderRadius="lg" shadow="md">
          <Stack direction="row" gap={8} align="start">
            <Heart size={32} color="#E53E3E" />
            <Stack gap={4} flex={1}>
              <Text color="red.500" fontSize="xl">Valientes</Text>
              <SimpleGrid columns={3} gap={8} w="full">
                <Stack>
                  {loading ? (
                    <Center py={2}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color="black">
                        {childrenCount ?? '-'}
                      </Text>
                      <Text color="black">Niños</Text>
                    </>
                  )}
                </Stack>
                <Stack>
                  {loading ? (
                    <Center py={2}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color="black">
                        {adultsCount ?? '-'}
                      </Text>
                      <Text color="black">Adultos</Text>
                    </>
                  )}
                </Stack>
                <Stack>
                  <Text fontSize="4xl" fontWeight="bold" color="black">17</Text>
                  <Text color="black">Familias</Text>
                </Stack>
              </SimpleGrid>
            </Stack>
          </Stack>
        </Box>

        {/* Angels Stats */}
        <Box bg="gray.100" p={6} borderRadius="lg" shadow="md">
          <Stack direction="row" gap={8}>
            <Box>
              <img src="/wings-icon.png" alt="Wings" width={32} height={32} />
            </Box>
            <Stack gap={4} flex={1}>
              <Text color="red.500" fontSize="xl">Fueron Valientes Ahora Ángeles</Text>
              <Text fontSize="4xl" fontWeight="bold" color="black">32</Text>
            </Stack>
          </Stack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Birthdays Section */}
        <Box p={6} borderRadius="lg" shadow="md">
          <Stack gap={4}>
            <Stack direction="row" align="center">
              <Text fontSize="xl">🎂</Text>
              <Heading size="md">Cumpleaños</Heading>
            </Stack>
            {loading ? (
              <Center py={4}>
                <Spinner />
              </Center>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : birthdays && birthdays.length > 0 ? (
              <Stack gap={3} w="full">
                {birthdays.map((birthday, index) => (
                  <Box key={index} py={2} borderBottom="1px" borderColor="gray.200">
                    <Stack direction="row" justify="space-between">
                      <Text color="black">{`${birthday.nombres} ${birthday.apellidos}`}</Text>
                      <Text color="gray.600">{formatDate(birthday.fechaNacimiento)}</Text>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text color="gray.500">No hay cumpleaños próximos</Text>
            )}
          </Stack>
        </Box>

        {/* Chart Section */}
        <Box p={6} borderRadius="lg" shadow="md">
          <Stack gap={4}>
            <Heading size="md">Alcance con Programas de Educación</Heading>
            <Box w="full" h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Lectura" stroke="#38B2AC" />
                  <Line type="monotone" dataKey="Matemáticas" stroke="#805AD5" />
                  <Line type="monotone" dataKey="Braille" stroke="#4299E1" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  );
} 