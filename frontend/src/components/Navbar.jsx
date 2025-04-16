import { Container, Flex, Text, HStack, Button, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW={"1440px"} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"} flexDir={{ base: "column", md: "row" }}>
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, #22d3ee, #3b82f6)"}
          bgClip={"text"}
        >
          <Link to={"/"}>Recipe List 🛒</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/create"}>
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>

          //added shopping list button
          <Link to={"/shopping-list"}>
            <Button>
              <FaShoppingCart fontSize={20} />
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

export default Navbar
