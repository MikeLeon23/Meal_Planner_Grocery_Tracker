import React from 'react';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

function WeekNavigation() {
  return (
    <Flex
      alignItems="center"
      p={4}
      borderBottom="2px"
      borderColor="gray.200"
    >
      <IconButton
        aria-label="Previous week"
        icon={<ChevronLeftIcon />}
        variant="ghost"
        onClick={() => console.log('Go to previous week')}
        mr={2}
      />
      <IconButton
        aria-label="Next week"
        icon={<ChevronRightIcon />}
        variant="ghost"
        onClick={() => console.log('Go to next week')}
        mr={2}
      />
      <Text fontSize="lg" fontWeight="bold">
        March 9 - 15, 2025
      </Text>
    </Flex>
  );
}

export default WeekNavigation;
