'use client'

import Image from "next/image";
import { Button, Menu, useDisclosure } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react/portal";
import { useRouter } from 'next/navigation';
import { FaPowerOff } from "react-icons/fa6";
import { GiHeartWings } from "react-icons/gi";
import { MdDisplaySettings } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Header = () => {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <nav className="flex items-center justify-between bg-red-700 p-4 shadow-md relative">
        {/* Logo y nombre de la app */}
        <div className="flex items-center space-x-2">
          <Image className="rounded-full" src="/logo-corporacion.jpeg" alt="Logo" width={60} height={60} />
          <span className="text-white text-xl font-bold">Coanva</span>
        </div>

        {/* Menú de navegación - Desktop */}
        <div className="hidden md:flex space-x-6 text-amber-100">
          <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" size="sm" onClick={() => router.push('/main/people')}>
                <GiHeartWings size={28} /> Ángeles y Valientes
                </Button>
            </Menu.Trigger>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                <MdDisplaySettings /> Administración <FaChevronDown />
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                <Menu.Content>
                    <Menu.Item value="new-txt" onClick={() => router.push('/main/administracion/programas')}>Programas</Menu.Item>
                    <Menu.Item value="new-file">Usuarios</Menu.Item>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                <TbReportAnalytics /> Reportes <FaChevronDown />
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                <Menu.Content>
                    <Menu.Item value="new-txt" onClick={() => router.push('/main/reportes/clases')}>Reporte de Clases</Menu.Item>
                    <Menu.Item value="new-file" onClick={() => router.push('/main/reportes/cifras')}>Estadísticas</Menu.Item>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>

        {/* Menú móvil y botón de cerrar sesión */}
        <div className="flex items-center space-x-4">
          {/* Botón de menú móvil */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-red-700 p-4 md:hidden z-50 shadow-lg text-amber-100">
              <div className="flex flex-col space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/main/people');
                    setIsMenuOpen(false);
                  }}
                >
                  <GiHeartWings size={28} /> Ángeles y Valientes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/main/administracion/programas');
                    setIsMenuOpen(false);
                  }}
                >
                  <MdDisplaySettings /> Programas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/main/reportes/clases');
                    setIsMenuOpen(false);
                  }}
                >
                  <TbReportAnalytics /> Reporte de Clases
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/main/reportes/cifras');
                    setIsMenuOpen(false);
                  }}
                >
                  <TbReportAnalytics /> Estadísticas
                </Button>
              </div>
            </div>
          )}

          {/* Botón de cerrar sesión */}
          <button
            onClick={() => {
              sessionStorage.removeItem('token');
              router.push('/');
            }}
          >
            <FaPowerOff className="text-white text-xl" />
          </button>
        </div>
      </nav>
    );
}
 
export default Header;