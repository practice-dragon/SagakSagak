import React, {useEffect, useState} from "react";
import styled from "styled-components/native";
import CalendarDay from "./CalendarDay";
import ArrowIcon from "../../../src/assets/icons/ArrowIcon";
import useStore from "@/context";
import {useDateStore} from "@/context/DateStore";
import {TaskType} from "@/types/Profile";
import {useAuthStore} from "@/context/authStore";

const Container = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  width: 100%;
`;

const DateContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  font-size: ${({theme}) => theme.fonts.h2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h2.fontFamily};
  color: ${({theme}) => theme.colors.text};
  text-align: center;
`;

const CalendarDayContainer = styled.View`
  flex-direction: column;
  width: 100%;
`;

const CalendarWeekRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const LeftContainer = styled.View`
  flex-direction: row;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  padding: 8px;
`;

const ChangeViewButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ButtonText = styled.Text`
  font-size: ${({theme}) => theme.fonts.p2.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p2.fontFamily};
  color: ${({theme}) => theme.colors.text};
`;

const WeekdayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
  justify-content: space-around;
`;

const WeekdayText = styled.Text`
  font-size: 12px;
  color: #666;
  box-sizing: border-box;
  padding: 2px;
  width: 30px;
  margin: 0 4px;
  text-align: center;
`;

const Calendar = ({
  viewType,
  setViewType,
}: {
  viewType: "week" | "month";
  setViewType: (type: "week" | "month") => void;
}) => {
  const {fetchAllTasks, tasks} = useStore();
  const {userProfile} = useAuthStore();
  const {selectedDate, setSelectedDate} = useDateStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousPeriod = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewType === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewType === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const weeks = generateCalendarWeeks(currentDate);
  const currentWeek = generateCurrentWeek(currentDate);

  useEffect(() => {
    if (userProfile) {
      fetchAllTasks(userProfile.id.toString());
    }
  }, [userProfile]);

  // useEffect(() => {}, [tasks]);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const calculateTasksForDate = (date: Date) => {
    const formattedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const filteredTasks = tasks.filter(
      (task: TaskType) =>
        task.created_at && isSameDay(new Date(task.created_at), formattedDate),
    );
    const completedTasks = filteredTasks.filter(
      (task: TaskType) => task.completed,
    ).length;
    const totalTasks = filteredTasks.length;
    return {completedTasks, totalTasks};
  };

  return (
    <Container>
      <ButtonContainer>
        <LeftContainer>
          <Button onPress={handlePreviousPeriod}>
            <ArrowIcon width={24} height={24} direction="left" />
          </Button>
          <DateContainer>
            <DateText>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </DateText>
          </DateContainer>
          <Button onPress={handleNextPeriod}>
            <ArrowIcon width={24} height={24} direction="right" />
          </Button>
        </LeftContainer>
        <ChangeViewButton
          onPress={() => setViewType(viewType === "week" ? "month" : "week")}>
          <ButtonText>{viewType === "week" ? "달로" : "일주일로"}</ButtonText>
        </ChangeViewButton>
      </ButtonContainer>

      <WeekdayContainer>
        {["월", "화", "수", "목", "금", "토", "일"].map((weekday, index) => (
          <WeekdayText key={index}>{weekday}</WeekdayText>
        ))}
      </WeekdayContainer>

      <CalendarDayContainer>
        {viewType === "month" ? (
          weeks.map((week, weekIndex) => (
            <CalendarWeekRow key={weekIndex}>
              {week.map((day, dayIndex) => {
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                );
                const {completedTasks, totalTasks} =
                  calculateTasksForDate(date);
                return (
                  <CalendarDayWrapper key={`${weekIndex}-${dayIndex}`}>
                    {day !== 0 ? (
                      <CalendarDay
                        totalTasks={totalTasks}
                        completedTasks={completedTasks}
                        day={day}
                        isSelected={
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === currentDate.getMonth() &&
                          selectedDate.getFullYear() ===
                            currentDate.getFullYear()
                        }
                        onClick={() => handleDateClick(date)}
                      />
                    ) : null}
                  </CalendarDayWrapper>
                );
              })}
            </CalendarWeekRow>
          ))
        ) : (
          <CalendarWeekRow>
            {currentWeek.map((date, dayIndex) => {
              const {completedTasks, totalTasks} = calculateTasksForDate(date);
              return (
                <CalendarDayWrapper key={dayIndex}>
                  <CalendarDay
                    totalTasks={totalTasks}
                    completedTasks={completedTasks}
                    day={date.getDate()}
                    isSelected={
                      selectedDate.getDate() === date.getDate() &&
                      selectedDate.getMonth() === date.getMonth() &&
                      selectedDate.getFullYear() === date.getFullYear()
                    }
                    onClick={() => handleDateClick(date)}
                  />
                </CalendarDayWrapper>
              );
            })}
          </CalendarWeekRow>
        )}
      </CalendarDayContainer>
    </Container>
  );
};

const CalendarDayWrapper = styled.View`
  width: 14.28%; /* 100% / 7  */
  align-items: center;
`;

const generateCalendarWeeks = (currentDate: Date) => {
  const firstDayOfMonth =
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1;
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const weeks: number[][] = [];
  let days: number[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(0);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
    if (days.length === 7) {
      weeks.push([...days]);
      days = [];
    }
  }

  if (days.length > 0) {
    while (days.length < 7) {
      days.push(0);
    }
    weeks.push([...days]);
  }

  return weeks;
};

const generateCurrentWeek = (currentDate: Date) => {
  const dayOfWeek = currentDate.getDay() - 1;
  const firstDayOfWeek = currentDate.getDate() - dayOfWeek;
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      firstDayOfWeek + i,
    );
    week.push(day);
  }
  return week;
};

export default Calendar;
