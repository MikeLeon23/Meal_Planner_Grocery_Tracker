import React from 'react';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

function WeekNavigation({ onWeekChange, currentWeekStart }) {
  // Calculate the start and end dates of the week
  const startDate = new Date(currentWeekStart);
  const endDate = new Date(currentWeekStart);
  endDate.setDate(startDate.getDate() + 6); // Add 6 days to get the end of the week

  // Format the dates as "Month Day - Day, Year"
  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const year = startDate.getFullYear();
  const weekInfo = `${formatDate(startDate)} - ${formatDate(endDate)}, ${year}`;

  return (
    <Flex
      alignItems="center"
      p={4}
    >
      <IconButton
        aria-label="Previous week"
        icon={<ChevronLeftIcon />}
        variant="ghost"
        onClick={() => onWeekChange(-1)}
        mr={2}
      />
      <IconButton
        aria-label="Next week"
        icon={<ChevronRightIcon />}
        variant="ghost"
        onClick={() => onWeekChange(1)} // Fixed the direction from -1 to 1 for "Next week"
        mr={2}
      />
      <Text fontSize="lg" fontWeight="bold">
        {weekInfo}
      </Text>
    </Flex>
  );
}

export default WeekNavigation;