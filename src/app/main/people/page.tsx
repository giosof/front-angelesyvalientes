'use client'

import { useEffect, useState } from 'react';
import { fetchPeopleList } from "@/app/helpers/api";
import {
  Box,
  Button,
  Heading
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import PeopleCardList from '@/app/components/peopleCardList';
import { BsPersonFillAdd } from 'react-icons/bs';
import { Flex } from "@chakra-ui/react/flex"

const People = () => {
  const router = useRouter();
  const [peopleList, setPeopleList] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchPeopleList();
        setPeopleList(result || []);
      } catch (error) {
        console.error('Error cargando personas:', error);
      }
    };

    loadData();
  }, []);

  return (
    <Box
      bg="white"
      p={5}
      boxShadow="lg"
      overflowX="auto"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading className="text-xl font-semibold">Personas</Heading>
        <Button className="border border-red-700 rounded-full bg-red-700 text-white  hover:bg-red-600 hover:border-transparent active:bg-red-700 p-2" onClick={() => router.push('/main/people/0')}>
          <BsPersonFillAdd/>Crear Persona
        </Button>
      </Flex>

      <PeopleCardList peopleList={peopleList} />
    </Box>
  );
};

export default People;
