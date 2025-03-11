'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Divider,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'

interface NavLinkProps {
  children: React.ReactNode
  href: string
}

const links = [
  { name: 'Avaliações', href: '/avaliacoes' },
  { name: 'Usuários', href: '/usuarios' }
]

const NavLink = (props: NavLinkProps) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={props.href}>
      {children}
    </Box>
  )
}

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>{'logoHere'}</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <NavLink href={link.href} key={link.name}>{link.name}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <Box 
              onClick={toggleColorMode} 
              mr={4}
              px={2}
              py={2}
              rounded={'md'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('gray.200', 'gray.700'),
              }}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Box>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              <Avatar size={'sm'} src={''} />
            </MenuButton>
            <MenuList>
              <MenuItem>Link 1</MenuItem>
              <MenuItem>Link 2</MenuItem>
              <MenuDivider />
              <MenuItem>Link 3</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {links.map((link) => (
              <NavLink href={link.href} key={link.name}>{link.name}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}

export default NavBar
