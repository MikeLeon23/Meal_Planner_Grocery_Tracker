import { Box, Heading, Image, Text, HStack, IconButton, useColorModeValue } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

const RecipeCard = ({recipe}) => {
    const textColor = useColorModeValue("gray.600", "gray.200")
    const bg = useColorModeValue("white", "gray.800")
    console.log(recipe)
    return (
        <Box shadow="lg" rounded="lg" overflow="hidden" transition="all 0.3s" bg={bg} _hover={{ transform: "translateY(-5px)", shadow: "xl" }} >
            <Image src={recipe.image} alt={recipe.name} h={48} w="full" objectFit="cover" />
            <Box p={4}>
                <Heading as='h3' size='md' mb={2}>{recipe.name}</Heading>
                <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
                    ${recipe.price}
                </Text>

                <HStack spacing={2}>
                    <IconButton icon={<EditIcon />} colorScheme="blue" />
                    <IconButton icon={<DeleteIcon />} colorScheme="red" />
                </HStack>
            </Box>
        </Box>
    )
}

export default RecipeCard
