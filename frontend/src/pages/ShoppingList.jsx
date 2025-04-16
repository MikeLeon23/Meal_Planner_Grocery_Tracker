import { Container, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox, Button, Input, HStack, Select, IconButton, Flex, Tooltip } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import WeekNavigation from '../components/WeekNavigation'; // Import WeekNavigation
import axios from 'axios';

const units = ['units', 'g', 'kg', 'ml', 'L', 'oz', 'lb'];

const ShoppingList = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek; // Adjust to Sunday
    return new Date(today.setDate(diff));
  });

  const [items, setItems] = useState([]); // Combined list (fetched + custom)
  const [fetchedItems, setFetchedItems] = useState([]); // Items from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', quantity: '', unit: '' });
  const [showActions, setShowActions] = useState(false);

  // Load custom items from localStorage for the specific week
  const getCustomItemsKey = (weekStart) => `customShoppingList_${weekStart.toISOString().split('T')[0]}`;
  const loadCustomItems = (weekStart) => {
    const savedItems = localStorage.getItem(getCustomItemsKey(weekStart));
    return savedItems ? JSON.parse(savedItems) : [];
  };

  // Fetch shopping list for the current week
  useEffect(() => {
    const fetchShoppingList = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/meal-planner/shopping-list', {
          params: { weekStart: currentWeekStart.toISOString().split('T')[0] },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetched = response.data.map(item => ({
          ...item,
          checked: false,
          isCustom: false, // Mark as non-custom
        }));
        setFetchedItems(fetched);

        // Load custom items for this week
        const customItems = loadCustomItems(currentWeekStart).map(item => ({
          ...item,
          isCustom: true, // Mark as custom
        }));

        // Merge fetched and custom items
        const mergedItems = [...fetched, ...customItems];
        setItems(mergedItems);
      } catch (err) {
        setError('Failed to fetch shopping list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoppingList();
  }, [currentWeekStart]);

  // Save custom items to localStorage when items change
  useEffect(() => {
    const customItems = items.filter(item => item.isCustom);
    localStorage.setItem(getCustomItemsKey(currentWeekStart), JSON.stringify(customItems));
  }, [items, currentWeekStart]);

  // Handle week change
  const handleWeekChange = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
  };

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
      checked: false,
      isCustom: true, // Mark as custom
      price: 0, // Optional: price not used for custom items
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
    updatedItems[index] = {
      ...updatedItems[index],
      name: editValues.name,
      quantity: parseFloat(editValues.quantity),
      unit: editValues.unit,
    };
    setItems(updatedItems);
    setEditingIndex(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    // Main Container
    <Container maxW="container.xl">
      <VStack spacing={8} position="relative">
        <HStack spacing={4} w="100%" justify="space-between" align="center">
          {/* Week Navigation */}
          <WeekNavigation w="30%" onWeekChange={handleWeekChange} currentWeekStart={currentWeekStart} />

          {/* Add Item Form */}
          <HStack spacing={4} w="70%">
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
        </HStack>

        {/* Shopping List Table */}
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <TableContainer
            w="100%"
            mb={10}
            overflowY="auto"
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
                          <Input
                            size="sm"
                            value={editValues.name}
                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          />
                        </Td>
                        <Td textAlign="center">
                          <HStack justify="center">
                            <Input
                              size="sm"
                              type="number"
                              value={editValues.quantity}
                              onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                            />
                            <Select
                              size="sm"
                              value={editValues.unit}
                              onChange={(e) => setEditValues({ ...editValues, unit: e.target.value })}
                            >
                              {units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </Select>
                          </HStack>
                        </Td>
                        <Td textAlign="center">—</Td>
                        {showActions && (
                          <Td textAlign="center">
                            <IconButton
                              icon={<CheckIcon />}
                              size="sm"
                              colorScheme="green"
                              onClick={() => saveEdit(index)}
                              mr={2}
                            />
                            <IconButton
                              icon={<CloseIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={cancelEdit}
                            />
                          </Td>
                        )}
                      </>
                    ) : (
                      // Normal view of the item
                      <>
                        <Td
                          textAlign="center"
                          textDecoration={item.checked ? 'line-through' : 'none'}
                          color={item.checked ? 'gray.500' : 'inherit'}
                        >
                          {item.name}
                        </Td>
                        <Td
                          textAlign="center"
                          textDecoration={item.checked ? 'line-through' : 'none'}
                          color={item.checked ? 'gray.500' : 'inherit'}
                        >
                          {item.quantity} {item.unit}
                        </Td>
                        <Td textAlign="center">
                          <Checkbox
                            colorScheme="blue"
                            isChecked={item.checked}
                            onChange={() => handleCheck(index)}
                          />
                        </Td>
                        {showActions && (
                          <Td textAlign="center">
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              mr={2}
                              onClick={() => startEdit(index)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => deleteItem(index)}
                            />
                          </Td>
                        )}
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </VStack>
    </Container>
  );
};

export default ShoppingList;