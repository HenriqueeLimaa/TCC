import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";

const DAYS_OF_WEEK = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DAYS_OF_WEEK_FULL = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const { width } = Dimensions.get("window");
const DAY_ITEM_WIDTH = width / 7;

interface CalendarCarouselProps {
  onDateSelect: (date: { day: number; weekDay: string; date: Date; isCurrentMonth: boolean; isToday: boolean }) => void;
  ref?: React.RefObject<{
    navigateDay: (direction: 'next' | 'prev') => void;
  }>;
}

const CalendarCarousel = React.forwardRef<
  { navigateDay: (direction: 'next' | 'prev') => void },
  CalendarCarouselProps
>(({ onDateSelect }, ref) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [daysInMonth, setDaysInMonth] = useState<{ day: number; weekDay: string; date: Date; isCurrentMonth: boolean; isToday: boolean }[]>([]);
  const [todayIndex, setTodayIndex] = useState(0);

  React.useImperativeHandle(ref, () => ({
    navigateDay: (direction: 'next' | 'prev') => {
      const newIndex = direction === 'next' 
        ? Math.min(selectedDayIndex + 1, daysInMonth.length - 1)
        : Math.max(selectedDayIndex - 1, 0);
      
      if (newIndex !== selectedDayIndex) {
        handleDayPress(newIndex);
      }
    }
  }));

  useEffect(() => {
    generateDaysInMonth();
  }, []);

  const generateDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const currentDay = today.getDate();
    const currentDayOfWeek = today.getDay();
    
    const daysToSubtract = currentDayOfWeek;
    const firstDay = new Date(year, month, currentDay - daysToSubtract);

    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      
      days.push({
        day: date.getDate(),
        weekDay: DAYS_OF_WEEK[date.getDay()],
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday
      });

      if (isToday) {
        setTodayIndex(i);
      }
    }
    
    setDaysInMonth(days);
    
    setSelectedDayIndex(daysToSubtract);
    if (onDateSelect && days.length > daysToSubtract) {
      onDateSelect(days[daysToSubtract]);
    }
    
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: DAY_ITEM_WIDTH * (daysToSubtract > 0 ? daysToSubtract - 1 : 0),
        animated: true,
      });
    }, 100);
  };

  const handleDayPress = (index: number) => {
    setSelectedDayIndex(index);
    
    if (onDateSelect && daysInMonth.length > index) {
      onDateSelect(daysInMonth[index]);
    }
    
    scrollViewRef.current?.scrollTo({
      x: DAY_ITEM_WIDTH * (index > 0 ? index - 1 : 0),
      animated: true,
    });
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
        decelerationRate="fast"
        pagingEnabled={false}
        snapToInterval={DAY_ITEM_WIDTH}
      >
        {daysInMonth.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              selectedDayIndex === index && styles.selectedDayItem,
              !item.isCurrentMonth && styles.differentMonthDay
            ]}
            onPress={() => handleDayPress(index)}
          >
            <Text style={[
              styles.dayText
            ]}>
              {item.weekDay}
            </Text>
            <Text style={[
              styles.dateText,
              selectedDayIndex === index && styles.selectedDayText
            ]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
});

export const Header = () => {
  const [selectedDate, setSelectedDate] = useState<{ day: number; weekDay: string; date: Date; isCurrentMonth: boolean; isToday: boolean } | null>(null);
  const calendarRef = useRef<{ navigateDay: (direction: 'next' | 'prev') => void }>(null);
  
  const formatDate = (date: { date: Date }) => {
    if (!date) return '';
    const day = date.date.getDate();
    const month = MONTHS[date.date.getMonth()];
    return `${DAYS_OF_WEEK_FULL[date.date.getDay()]}, ${day} de ${month}`;
  }
  
  const getHeaderTitle = (date: { date: Date; isToday: boolean }) => {
    if (!date) return 'Hoje';
    
    if (date.isToday) {
      return 'Hoje';
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const selectedDate = date.date;
    
    if (selectedDate.getDate() === tomorrow.getDate() && 
        selectedDate.getMonth() === tomorrow.getMonth() && 
        selectedDate.getFullYear() === tomorrow.getFullYear()) {
      return 'Amanhã';
    }
    
    if (selectedDate.getDate() === yesterday.getDate() && 
        selectedDate.getMonth() === yesterday.getMonth() && 
        selectedDate.getFullYear() === yesterday.getFullYear()) {
      return 'Ontem';
    }
    
    return DAYS_OF_WEEK_FULL[selectedDate.getDay()];
  }
  
  const handleDateSelect = (date: { day: number; weekDay: string; date: Date; isCurrentMonth: boolean; isToday: boolean }) => {
    setSelectedDate(date);
  }
  
  const handleNavigate = (direction: 'next' | 'prev') => {
    if (calendarRef.current) {
      calendarRef.current.navigateDay(direction);
    }
  }
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleNavigate('prev')}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>{getHeaderTitle(selectedDate || { date: new Date(), isToday: true })}</Text>
          <Text style={styles.subtitle}>{selectedDate ? formatDate(selectedDate) : ''}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleNavigate('next')}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
      
      <CalendarCarousel 
        ref={calendarRef}
        onDateSelect={handleDateSelect} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  titleTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  arrowButton: {
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00CC66',
  },
  carouselContainer: {
    width: '100%',
  },
  daysContainer: {
    paddingHorizontal: 5,
  },
  dayItem: {
    width: DAY_ITEM_WIDTH - 4,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayItem: {
    backgroundColor: '#FFFFFF',
  },
  differentMonthDay: {
    opacity: 0.6,
  },
  dayText: {
    fontSize: 14,
    color: '#333333',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  selectedDayText: {
    color: '#FFFFFF',
    backgroundColor: '#00CC66',
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
});