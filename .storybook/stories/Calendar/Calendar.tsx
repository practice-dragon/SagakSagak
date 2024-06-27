import React, {useState} from "react";
import styled from "styled-components/native";
import CalendarDay from "./CalendarDay";
import ArrowIcon from "../../../src/assets/icons/ArrowIcon";

const Container = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  width: 90%;
`;

const DateContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  font-size: ${({theme}) => theme.fonts.h3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.h3.fontFamily};
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

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Button = styled.TouchableOpacity`
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

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

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  const weeks = generateCalendarWeeks(currentDate);
  const currentWeek = generateCurrentWeek(currentDate);

  return (
    <Container>
      <ButtonContainer>
        <Button onPress={handlePreviousPeriod}>
          <ArrowIcon width={24} height={24} direction="left" />
        </Button>
        <DateContainer>
          <DateText>
            {viewType === "month"
              ? `${currentDate.getFullYear()}년 ${currentDate.toLocaleString(
                  "ko-KR",
                  {
                    month: "long",
                  },
                )} `
              : `${currentDate.getFullYear()}년 ${
                  currentDate.getMonth() + 1
                }월`}
          </DateText>
        </DateContainer>
        <Button onPress={handleNextPeriod}>
          <ArrowIcon width={24} height={24} direction="right" />
        </Button>

        <Button
          onPress={() => setViewType(viewType === "week" ? "month" : "week")}>
          <ButtonText>{viewType === "week" ? "달로" : "일주일로"}</ButtonText>
        </Button>
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
              {week.map((day, dayIndex) => (
                <CalendarDayWrapper key={`${weekIndex}-${dayIndex}`}>
                  {day !== 0 ? (
                    <CalendarDay
                      day={day}
                      isSelected={selectedDate === day}
                      onClick={() => handleDateClick(day)}
                    />
                  ) : null}
                </CalendarDayWrapper>
              ))}
            </CalendarWeekRow>
          ))
        ) : (
          <CalendarWeekRow>
            {currentWeek.map((date, dayIndex) => (
              <CalendarDayWrapper key={dayIndex}>
                <CalendarDay
                  day={date.getDate()}
                  isSelected={selectedDate === date.getDate()}
                  onClick={() => handleDateClick(date.getDate())}
                />
              </CalendarDayWrapper>
            ))}
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
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const weeks: number[][] = [];
  let days: number[] = [];

  // 이전 달의 빈 칸
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(0);
  }

  // 현재 달의 날짜
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
    if (days.length === 7) {
      weeks.push([...days]);
      days = [];
    }
  }

  // 마지막 주가 완성되지 않았을 경우 빈 칸으로 채우기
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(0);
    }
    weeks.push([...days]);
  }

  return weeks;
};

const generateCurrentWeek = (currentDate: Date) => {
  const firstDayOfWeek = currentDate.getDate() - currentDate.getDay() + 1;
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
