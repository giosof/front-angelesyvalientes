import React from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Button } from "@chakra-ui/react";
import { Settings, User } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-yellow-500 p-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>

      {/* Menú de navegación */}
      <div className="flex space-x-6">
        <Menu>
          <MenuButton as={Button} colorScheme="yellow" variant="ghost">
            Ángeles y Valientes
          </MenuButton>
          <MenuList>
            <MenuItem>Opción 1</MenuItem>
            <MenuItem>Opción 2</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} colorScheme="yellow" variant="ghost">
            Administración
          </MenuButton>
          <MenuList>
            <MenuItem>Usuarios</MenuItem>
            <MenuItem>Roles</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} colorScheme="yellow" variant="ghost">
            Reportes
          </MenuButton>
          <MenuList>
            <MenuItem>Reporte 1</MenuItem>
            <MenuItem>Reporte 2</MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* Íconos de ajustes */}
      <div className="flex space-x-4">
        <button>
          <Settings className="text-black" />
        </button>
        <button>
          <User className="text-black" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
