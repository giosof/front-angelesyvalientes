'use client';

import React from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stack,
  Heading,
  ListItem,
  Container,
} from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const birthdays = [
  { name: 'Cristobal Arenas', date: '23 Marzo' },
  { name: 'Anderson Plata', date: '27 Marzo' },
  { name: 'Alejandra Vidal', date: '2 Abril' },
  { name: 'Alejandro Barrera', date: '13 Junio' },
  { name: 'Valentina Arias', date: '7 Septiembre' },
  { name: 'Luis Alberto Perez', date: '18 Septiembre' },
];

export default function CifrasPage() {
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
                  <Text fontSize="4xl" fontWeight="bold">56</Text>
                  <Text>Niños</Text>
                </Stack>
                <Stack>
                  <Text fontSize="4xl" fontWeight="bold">27</Text>
                  <Text>Adultos</Text>
                </Stack>
                <Stack>
                  <Text fontSize="4xl" fontWeight="bold">17</Text>
                  <Text>Familias</Text>
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
              <Text color="red.500" fontSize="xl">Fueron Valientes, Ahora Ángeles</Text>
              <Text fontSize="4xl" fontWeight="bold">32</Text>
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
            <Stack gap={3} w="full">
              {birthdays.map((birthday, index) => (
                <Box key={index} py={2} borderBottom="1px" borderColor="gray.200">
                  <Stack direction="row" justify="space-between">
                    <Text>{birthday.name}</Text>
                    <Text color="gray.600">{birthday.date}</Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
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