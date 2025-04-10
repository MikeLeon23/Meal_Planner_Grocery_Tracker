import AddMealModal from './AddMealModal';
import { useState } from 'react';
import { Box, Button, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";

function DayColumn({ dayLabel, bg }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [meals, setMeals] = useState([]);
    const itemWidth = "150px";
    const itemHeight = "100px";

    const handleAddMeal = (meal) => {
        setMeals([...meals, meal]);
    };

    return (
        <Box flex="1" bg={bg} borderRight="1px" borderColor="gray.300">
            <Box
                bg="gray.300"
                p={2}
                borderBottom="1px"
                borderColor="gray.300"
                textAlign="center"
            >
                <Text fontWeight="bold">{dayLabel}</Text>
            </Box>

            <Box minH="650px" p={4}>
                <VStack spacing={4} align="center">
                    {meals.map((meal, index) => (
                        <Box
                            key={index}
                            bgColor="gray.500"
                            color="white"
                            borderColor="gray.500"
                            borderWidth="1px"
                            borderRadius="md"
                            p={2}
                            w={itemWidth}
                            h={itemHeight}
                            textAlign="center"
                        >
                            <Text fontSize="xl">{meal.name}</Text>
                            <Text fontSize="sm" noOfLines={2}>{meal.recipes.join(", ")}</Text>
                        </Box>
                    ))}
                    <Button
                        onClick={onOpen}
                        w={itemWidth}
                        variant="outline"
                        borderColor="gray.400"
                    >
                        <AddIcon fontSize={16} color="gray.600" />
                    </Button>
                </VStack>
            </Box>

            <AddMealModal isOpen={isOpen} onClose={onClose} onAddMeal={handleAddMeal} />
        </Box>
    );
}

export default DayColumn;
