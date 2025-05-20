'use client'

import Image from "next/image";
import { Button, Menu } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react/portal";
import { useRouter } from 'next/navigation';
import { FaPowerOff } from "react-icons/fa6";
import { GiHeartWings } from "react-icons/gi";
import { MdDisplaySettings } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

const Header = () => {
    const router = useRouter()

    return (
      <nav className="flex items-center justify-between bg-red-700 p-4 shadow-md">
        {/* Logo */}
        <div className="flex items-center">
          <Image className = "rounded-full" src="/logo-corporacion.jpeg" alt="Logo" width={60} height={60} />
        </div>

        {/* Menú de navegación */}
        <div className="flex space-x-6 text-amber-100">
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
                    <Menu.Item value="new-txt">Programas</Menu.Item>
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
                    <Menu.Item value="new-txt">Reporte de Clases</Menu.Item>
                    <Menu.Item value="new-file">Estadísticas</Menu.Item>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>

        {/* Íconos de ajustes */}
        <div className="flex space-x-4">
          <button>
            <FaPowerOff className="text-white text-xl" />
          </button>
        </div>
      </nav>
    );
}
 
export default Header;