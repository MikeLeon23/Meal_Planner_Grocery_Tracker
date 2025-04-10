import { Flex, Text, Link, Button, Container, HStack, useColorMode } from '@chakra-ui/react'
import { IoMoon } from 'react-icons/io5'
import { LuSun } from 'react-icons/lu'
import { PlusSquareIcon } from '@chakra-ui/icons'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW={"1440px"} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, #22d3ee, #3b82f6)"}
          bgClip={"text"}
        >
          <Link to={"/"}>MPGT</Link>
        </Text>
        <Flex alignItems={'center'}>
          <NavLink to="/">
            <Button variant="link" color={colorMode === "light" ? "blackAlpha.800" : "white"} mr={4}>Home</Button>
          </NavLink>
          <NavLink to="/recipe-select">
            <Button variant="link" color={colorMode === "light" ? "blackAlpha.800" : "white"} mr={4}>Recipes</Button>
          </NavLink>
          <NavLink to="/shopping-list">
            <Button variant="link" color={colorMode === "light" ? "blackAlpha.800" : "white"} mr={4}>Shopping List</Button>
          </NavLink>
          <NavLink to="/user-info">
            <Button variant="link" color={colorMode === "light" ? "blackAlpha.800" : "white"}>User Info</Button>
          </NavLink>
        </Flex>
        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/create"}>
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  )
}

export default Navigation
