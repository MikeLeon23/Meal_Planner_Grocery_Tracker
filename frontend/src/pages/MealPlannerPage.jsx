import React from 'react';
import { Box, Flex, Container } from '@chakra-ui/react';
import WeekNavigation from '../components/WeekNavigation';
import DayColumn from '../components/DayColumn';

const days = [
  { label: 'Sun' },
  { label: 'Mon' },
  { label: 'Tue' },
  { label: 'Wed' },
  { label: 'Thu' },
  { label: 'Fri' },
  { label: 'Sat' },
];

function MealPlannerPage() {
  return (
    <Container maxW={"1440px"} p={4}>
      <Box boxShadow="md" borderRadius="md" overflow="hidden" bg="gray.300">
        {/* Week Navigation */}
        <WeekNavigation />

        <Flex>
          {days.map((day, index) => (
            <DayColumn
              key={day.label}
              dayLabel={day.label}
              bg={index % 2 === 0 ? 'gray.200' : 'white'}
            />
          ))}
        </Flex>
      </Box>
    </Container>
  );
}

export default MealPlannerPage;

