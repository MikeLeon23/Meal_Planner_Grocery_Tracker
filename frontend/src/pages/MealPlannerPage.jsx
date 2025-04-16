import React, { useState, useEffect } from "react";
import { Box, Flex, Container, Spinner, Text, Divider} from "@chakra-ui/react";
import WeekNavigation from "../components/WeekNavigation";
import DayColumn from "../components/DayColumn";
import axios from "axios";

function MealPlannerPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek; // Adjust to Sunday
    return new Date(today.setDate(diff));
  });
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return {
      label: date.toLocaleString("en-US", { weekday: "short" }),
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };
  });

  // Fetch weekly meal plans when the week changes
  useEffect(() => {
    const fetchWeeklyMeals = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/meal-planner/meal-plans/week", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWeeklyMeals(response.data);
      } catch (err) {
        setError("Failed to fetch weekly meals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyMeals();
  }, [currentWeekStart]); // Re-fetch when the week changes

  const handleWeekChange = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
  };

  return (
    <Container maxW={"1440px"} p={4}>
      <Box boxShadow="md" borderRadius="md" overflow="hidden" bg="gray.300">
        <WeekNavigation onWeekChange={handleWeekChange} currentWeekStart={currentWeekStart} /> {/* Pass currentWeekStart */}
        <Divider size={"10px"} />
        {loading ? (
          <Box p={4} textAlign="center">
            <Spinner />
          </Box>
        ) : error ? (
          <Box p={4} textAlign="center">
            <Text color="red.500">{error}</Text>
          </Box>
        ) : (
          <Flex>
            {days.map((day, index) => (
              <DayColumn
                key={day.date}
                dayLabel={day.label}
                date={day.date}
                bg={index % 2 === 0 ? "gray.200" : "white"}
                weeklyMeals={weeklyMeals} // Pass weekly meals to DayColumn
              />
            ))}
          </Flex>
        )}
      </Box>
    </Container>
  );
}

export default MealPlannerPage;