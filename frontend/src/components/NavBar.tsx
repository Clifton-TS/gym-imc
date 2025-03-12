"use client";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Links de navegação com base no perfil do usuário
const links = [
  { name: "Avaliações", href: "/dashboard/evaluations", profiles: ["admin", "professor", "aluno"] },
  { name: "Usuários", href: "/dashboard/users", profiles: ["admin", "professor"] },
];

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useContext(AuthContext);
  const router = useRouter();

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const hoverBgColor = useColorModeValue("gray.200", "gray.700");

  // Função para logout
  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
      router.push("/login");
    }
  };

  const userProfile = auth?.user?.profile;

  // Filtra os links com base no perfil do usuário logado
  const filteredLinks = links.filter((link) => userProfile && link.profiles.includes(userProfile));

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box as={Link} href="/dashboard">
            <img src="/logo.svg" alt="Gym IMC" style={{ height: "40px" }} />
          </Box>
          {/* Navegação para desktop */}
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {filteredLinks.map((link) => (
              <Link key={link.name} href={link.href} passHref>
                <Box
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: hoverBgColor,
                  }}
                >
                  {link.name}
                </Box>
              </Link>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <Box
            onClick={toggleColorMode}
            mr={4}
            px={2}
            py={2}
            rounded={"md"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{
              textDecoration: "none",
              bg: hoverBgColor,
            }}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Box>
          <Menu>
            <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
              <Flex alignItems="center">
                <Box mr={4}>{auth?.user?.username || "Usuário"}</Box>
                <Avatar size={"sm"} src={""} />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>Perfil</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Navegação para mobile */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {filteredLinks.map((link) => (
              <Link key={link.name} href={link.href} passHref>
                <Box
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: hoverBgColor,
                  }}
                >
                  {link.name}
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default NavBar;
