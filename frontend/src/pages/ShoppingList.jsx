import { Container, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox, Button, Input, HStack, Select, IconButton, Flex, Tooltip } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';

const units = ['units', 'g', 'kg', 'ml', 'L', 'oz', 'lb'];

const ShoppingList = () => {

    const initialItems = [
        { name: 'Apples', quantity: 5, unit: 'units', checked: false },
        { name: 'Milk', quantity: 1, unit: 'L', checked: false },
        { name: 'Carrots', quantity: 500, unit: 'g', checked: false },
    ];

    // Load items from local storage or use initial items
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('shoppingList');
        return savedItems ? JSON.parse(savedItems) : initialItems;
    });


    // State for adding new item
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [newItemUnit, setNewItemUnit] = useState('units');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValues, setEditValues] = useState({ name: '', quantity: '', unit: '' });
    const [showActions, setShowActions] = useState(false);

    // Save items to local storage when items change
    useEffect(() => {
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }, [items]);

    // Function to handle checking/unchecking an item
    const handleCheck = (index) => {
        const newItems = [...items];
        newItems[index].checked = !newItems[index].checked;
        setItems(newItems);
    };

    // Function to add a new item to the list
    const addItem = () => {
        if (newItemName.trim() === '' || newItemQuantity === '') return;
        const newItem = {
            name: newItemName,
            quantity: parseFloat(newItemQuantity),
            unit: newItemUnit,
            checked: false
        };
        setItems([...items, newItem]);
        setNewItemName('');
        setNewItemQuantity('');
        setNewItemUnit('units');
    };

    // Function to delete an item from the list
    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // Functions to edit an item
    const startEdit = (index) => {
        setEditingIndex(index);
        const item = items[index];
        setEditValues({ name: item.name, quantity: item.quantity, unit: item.unit });
    };

    // Save editing
    const saveEdit = (index) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], ...editValues };
        setItems(updatedItems);
        setEditingIndex(null);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        // Main Container
        <Container maxW="container.sm" py={12}>
            <VStack spacing={8} position="relative">
                {/* Title */}
                <Text
                    fontSize={"30"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                    textAlign={"center"}>
                    Shopping List
                </Text>

                {/* Add Item Form */}
                <HStack spacing={4} w="100%">
                    <Input
                        placeholder="Product"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Quantity"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                    />
                    <Select value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)}>
                        {units.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </Select>
                    <Button
                        onClick={addItem}
                        bgGradient="linear(to-r, cyan.400, blue.500)"
                        color="white"
                        _hover={{ bgGradient: "linear(to-r, cyan.500, blue.600)" }}
                        flexShrink={0}
                    >
                        Add Item
                    </Button>
                </HStack>

                {/* Shopping List Table */}
                <TableContainer
                    w="100%"
                    borderRadius="md"
                    boxShadow="md"
                    p={4}
                    border="1px solid #ddd"
                    position="relative"
                >
                    {/* Floating Settings Icon with Tooltip */}
                    <Flex justify="flex-end" mb={2}>
                        <Tooltip label="Toggle Configuration" hasArrow placement="left">
                            <IconButton
                                aria-label="Configuration"
                                icon={<SettingsIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                onClick={() => setShowActions(!showActions)}
                            />
                        </Tooltip>
                    </Flex>

                    <Table colorScheme="blue">
                        <Thead>
                            <Tr>
                                <Th textAlign="center">Product</Th>
                                <Th textAlign="center">Quantity</Th>
                                <Th textAlign="center">Check</Th>
                                {showActions && <Th textAlign="center">Actions</Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items.map((item, index) => (
                                <Tr key={index}>
                                    {editingIndex === index ? (
                                        // Editing view of the item
                                        <>
                                            <Td textAlign="center">
                                                <Input size="sm" value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                                            </Td>
                                            <Td textAlign="center">
                                                <HStack justify="center">
                                                    <Input size="sm" type="number" value={editValues.quantity} onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })} />
                                                    <Select size="sm" value={editValues.unit} onChange={(e) => setEditValues({ ...editValues, unit: e.target.value })}>
                                                        {units.map((unit) => (
                                                            <option key={unit} value={unit}>{unit}</option>
                                                        ))}
                                                    </Select>
                                                </HStack>
                                            </Td>
                                            <Td textAlign="center">—</Td>
                                            {showActions && (
                                                <Td textAlign="center">
                                                    <IconButton icon={<CheckIcon />} size="sm" colorScheme="green" onClick={() => saveEdit(index)} mr={2} />
                                                    <IconButton icon={<CloseIcon />} size="sm" colorScheme="red" onClick={cancelEdit} />
                                                </Td>
                                            )}
                                        </>
                                    ) : (
                                        // Normal view of the item 
                                        <>
                                            <Td textAlign="center" textDecoration={item.checked ? 'line-through' : 'none'} color={item.checked ? 'gray.500' : 'inherit'}>{item.name}</Td>
                                            <Td textAlign="center" textDecoration={item.checked ? 'line-through' : 'none'} color={item.checked ? 'gray.500' : 'inherit'}>{item.quantity} {item.unit}</Td>
                                            <Td textAlign="center">
                                                <Checkbox
                                                    colorScheme='blue'
                                                    isChecked={item.checked}
                                                    onChange={() => handleCheck(index)}
                                                />
                                            </Td>
                                            {showActions && (
                                                <Td textAlign="center">
                                                    <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => startEdit(index)} />
                                                    <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => deleteItem(index)} />
                                                </Td>
                                            )}
                                        </>
                                    )}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        </Container>
    );
}

export default ShoppingList;
