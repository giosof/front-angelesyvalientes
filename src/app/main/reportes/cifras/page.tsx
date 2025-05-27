'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stack,
  Heading,
  Container,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { fetchValientesBirthdays, fetchValientesByClasificacion, fetchViviendasCount, fetchAngelesCount, fetchEstadisticasMensuales } from '@/app/helpers/api';
import { FaHeart } from 'react-icons/fa6';
import { BiHappy } from "react-icons/bi";

// Función para generar un color hexadecimal aleatorio
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Función para generar colores únicos para cada programa
const generateProgramColors = (programs: string[]) => {
  const colors: { [key: string]: string } = {};
  programs.forEach(program => {
    colors[program] = generateRandomColor();
  });
  return colors;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export default function CifrasPage() {
  const [birthdays, setBirthdays] = useState<Array<{
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
  }> | null>(null);
  const [childrenCount, setChildrenCount] = useState<number | null>(null);
  const [adultsCount, setAdultsCount] = useState<number | null>(null);
  const [familiesCount, setFamiliesCount] = useState<number | null>(null);
  const [angelesCount, setAngelesCount] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [programColors, setProgramColors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [birthdaysData, childrenData, adultsData, familiesData, angelesData, estadisticasData] = await Promise.all([
          fetchValientesBirthdays(),
          fetchValientesByClasificacion(1),
          fetchValientesByClasificacion(2),
          fetchViviendasCount(),
          fetchAngelesCount(),
          fetchEstadisticasMensuales()
        ]);

        if (birthdaysData) {
          setBirthdays(birthdaysData);
        }
        
        setChildrenCount(childrenData);
        setAdultsCount(adultsData);
        setFamiliesCount(familiesData);
        setAngelesCount(angelesData);
        setChartData(estadisticasData);

        // Generar colores para los programas
        if (estadisticasData && estadisticasData.length > 0) {
          const programs = Object.keys(estadisticasData[0].programas);
          setProgramColors(generateProgramColors(programs));
        }
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
          <Stack direction="row" gap={5} align="start">
            <FaHeart size={32} color="#E53E3E" />
            <Stack gap={4} flex={1}>
              <Text color="red.500" fontSize="xl">Valientes</Text>
              <SimpleGrid columns={3} gap={5} w="full">
                <Stack className='text-center'>
                  {loading ? (
                    <Center py={2}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color="black">
                        {childrenCount ?? '-'}
                      </Text>
                      <Text color="black">Niño{childrenCount !== 1 ? 's' : ''}</Text>
                    </>
                  )}
                </Stack>
                <Stack className='text-center'>
                  {loading ? (
                    <Center py={2}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color="black">
                        {adultsCount ?? '-'}
                      </Text>
                      <Text color="black">Adulto{adultsCount !== 1 ? 's' : ''}</Text>
                    </>
                  )}
                </Stack>
                <Stack className='text-center'>
                  {loading ? (
                    <Center py={2}>
                      <Spinner size="lg" />
                    </Center>
                  ) : (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color="black">
                        {familiesCount ?? '-'}
                      </Text>
                      <Text color="black">Familia{familiesCount !== 1 ? 's' : ''}</Text>
                    </>
                  )}
                </Stack>
              </SimpleGrid>
            </Stack>
          </Stack>
        </Box>

        {/* Angels Stats */}
        <Box bg="gray.100" p={6} borderRadius="lg" shadow="md">
          <Stack direction="row" gap={8}>
            <Box>
              <img src="/wings.png" alt="Wings" width={48} height={52} />
            </Box>
            <Stack gap={4} flex={1}>
              <Text color="red.500" fontSize="xl">Ángeles</Text>
              {loading ? (
                <Center py={2}>
                  <Spinner size="lg" />
                </Center>
              ) : (
                <Text fontSize="4xl" fontWeight="bold" color="black">
                  {angelesCount ?? '-'}
                </Text>
              )}
            </Stack>
          </Stack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Birthdays Section */}
        <Box bg="gray.100" p={6} borderRadius="lg" shadow="md">
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
                {birthdays.slice(0, 8).map((birthday, index) => (
                  <Box key={index} py={2} borderBottom="1px" borderColor="gray.200">
                    <Stack direction="row" justify="space-between" align="center">
                      <Stack direction="row" align="center" gap={2}>
                        <Text color="black">{`${birthday.nombres} ${birthday.apellidos}`}</Text>
                        <Text color="gray.500" fontSize="sm">({calculateAge(birthday.fechaNacimiento)} años)</Text>
                      </Stack>
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
        <Box bg="gray.100" p={6} borderRadius="lg" shadow="md">
          <Stack gap={4}>
            <Heading size="md">Alcance con Programas de Educación</Heading>
            {loading ? (
              <Center py={4}>
                <Spinner />
              </Center>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Box w="full" h="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis>
                      <Label
                        value="Fichas aprobadas"
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: 'middle' }}
                      />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    {Object.keys(programColors).map((programa) => (
                      <Line
                        key={programa}
                        type="monotone"
                        dataKey={`programas.${programa}`}
                        name={programa}
                        stroke={programColors[programa]}
                        dot={< BiHappy />}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  );
} 