import React, { useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../shared";
import { Colors } from "@/constants/Colors";

const DAYS_OF_WEEK = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DAYS_OF_WEEK_FULL = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
];
const MONTHS = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
];
const { width } = Dimensions.get("window");
const DAY_ITEM_WIDTH = width / 7;

interface CalendarCarouselProps {
    onDateSelect: (date: {
        day: number;
        weekDay: string;
        date: Date;
        isCurrentMonth: boolean;
        isToday: boolean;
    }) => void;
    ref?: React.RefObject<{
        navigateDay: (direction: "next" | "prev") => void;
    }>;
}

const CalendarCarousel = React.forwardRef<
    { navigateDay: (direction: "next" | "prev") => void },
    CalendarCarouselProps
>(({ onDateSelect }, ref) => {
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const [daysInMonth, setDaysInMonth] = useState<
        {
            day: number;
            weekDay: string;
            date: Date;
            isCurrentMonth: boolean;
            isToday: boolean;
        }[]
    >([]);
    const [todayIndex, setTodayIndex] = useState(0);

    React.useImperativeHandle(ref, () => ({
        navigateDay: (direction: "next" | "prev") => {
            const newIndex =
                direction === "next"
                    ? Math.min(selectedDayIndex + 1, daysInMonth.length - 1)
                    : Math.max(selectedDayIndex - 1, 0);

            if (newIndex !== selectedDayIndex) {
                handleDayPress(newIndex);
            }
        },
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

            const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            days.push({
                day: date.getDate(),
                weekDay: DAYS_OF_WEEK[date.getDay()],
                date: date,
                isCurrentMonth: date.getMonth() === month,
                isToday: isToday,
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
                x:
                    DAY_ITEM_WIDTH *
                    (daysToSubtract > 0 ? daysToSubtract - 1 : 0),
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
                            !item.isCurrentMonth && styles.differentMonthDay,
                        ]}
                        onPress={() => handleDayPress(index)}
                    >
                        <Text style={styles.dayText}>{item.weekDay}</Text>
                        {selectedDayIndex === index && (
                            <View style={styles.selectedCircleContainer}>
                                <View style={styles.selectedDayCircle} />
                            </View>
                        )}
                        <Text
                            style={[
                                styles.dateText,
                                ...(selectedDayIndex === index
                                    ? [styles.selectedDayText]
                                    : []),
                            ]}
                        >
                            {item.day}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
});

interface HeaderProps {
    onDateSelected: (newDate: Date) => void;
}

export const Header = ({ onDateSelected }: HeaderProps) => {
    const [selectedDate, setSelectedDate] = useState<{
        day: number;
        weekDay: string;
        date: Date;
        isCurrentMonth: boolean;
        isToday: boolean;
    } | null>(null);
    const calendarRef = useRef<{
        navigateDay: (direction: "next" | "prev") => void;
    }>(null);

    const formatDate = (date: { date: Date }) => {
        if (!date) return "";
        const day = date.date.getDate();
        const month = MONTHS[date.date.getMonth()];
        return `${DAYS_OF_WEEK_FULL[date.date.getDay()]}, ${day} de ${month}`;
    };

    const getHeaderTitle = (date: { date: Date; isToday: boolean }) => {
        if (!date) return "Hoje";

        if (date.isToday) {
            return "Hoje";
        }

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const selectedDate = date.date;

        if (
            selectedDate.getDate() === tomorrow.getDate() &&
            selectedDate.getMonth() === tomorrow.getMonth() &&
            selectedDate.getFullYear() === tomorrow.getFullYear()
        ) {
            return "Amanhã";
        }

        if (
            selectedDate.getDate() === yesterday.getDate() &&
            selectedDate.getMonth() === yesterday.getMonth() &&
            selectedDate.getFullYear() === yesterday.getFullYear()
        ) {
            return "Ontem";
        }

        return DAYS_OF_WEEK_FULL[selectedDate.getDay()];
    };

    const handleDateSelect = (date: {
        day: number;
        weekDay: string;
        date: Date;
        isCurrentMonth: boolean;
        isToday: boolean;
    }) => {
        setSelectedDate(date);
        onDateSelected(date.date);
    };

    const handleNavigate = (direction: "next" | "prev") => {
        if (calendarRef.current) {
            calendarRef.current.navigateDay(direction);
        }
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => handleNavigate("prev")}
                >
                    <Ionicons name="chevron-back" size={24} color="#CCCCCC" />
                </TouchableOpacity>

                <View style={styles.titleTextContainer}>
                    <Text style={styles.title}>
                        {getHeaderTitle(
                            selectedDate || { date: new Date(), isToday: true }
                        )}
                    </Text>
                    <Text style={styles.subtitle}>
                        {selectedDate ? formatDate(selectedDate) : ""}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => handleNavigate("next")}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#CCCCCC"
                    />
                </TouchableOpacity>
            </View>

            <CalendarCarousel
                ref={calendarRef}
                onDateSelect={handleDateSelect}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        width: Dimensions.get("window").width,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingBottom: 16,
        paddingHorizontal: 16,
        zIndex: 10,
        alignSelf: "center",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    titleTextContainer: {
        alignItems: "center",
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
        color: "#666666",
        marginBottom: 10,
    },
    arrowButton: {
        padding: 0,
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    arrowText: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.primary,
    },
    carouselContainer: {
        width: "100%",
    },
    daysContainer: {
        paddingHorizontal: 0,
    },
    dayItem: {
        width: DAY_ITEM_WIDTH - 4,
        height: 65,
        justifyContent: "center",
        alignItems: "center",
    },
    dayItemContent: {
        alignItems: "center",
        justifyContent: "center",
        height: 65,
    },
    selectedCircleContainer: {
        position: "absolute",
        top: 28,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    selectedDayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
    },
    selectedDayText: {
        color: "#FFFFFF",
        zIndex: 2,
    },
    selectedDayItem: {
        backgroundColor: "#FFFFFF",
    },
    differentMonthDay: {
        opacity: 0.6,
    },
    dayText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#999999",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        paddingBottom: 8,
        fontWeight: "600",
        color: "#333333",
    },
});
