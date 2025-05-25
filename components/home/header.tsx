import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
} from "react";
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
const VISIBLE_DAYS_COUNT = 35;
const TARGET_SELECTED_OFFSET = 2;

interface DayObjectType {
    day: number;
    weekDay: string;
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
}

interface CalendarCarouselProps {
    onDateSelect: (date: DayObjectType) => void;
}

interface CalendarCarouselRef {
    navigateDay: (direction: "next" | "prev") => void;
}

const CalendarCarousel = React.forwardRef<
    CalendarCarouselRef,
    CalendarCarouselProps
>(({ onDateSelect }, ref) => {
    const [currentDateForView, setCurrentDateForView] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [daysInView, setDaysInView] = useState<DayObjectType[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    React.useImperativeHandle(ref, () => ({
        navigateDay: (direction: "next" | "prev") => {
            setCurrentDateForView((prevDate) => {
                const newDate = new Date(prevDate);
                newDate.setDate(
                    prevDate.getDate() + (direction === "next" ? 1 : -1)
                );
                return newDate;
            });
        },
    }));

    useEffect(() => {
        const generateAndSetDays = (pivotDate: Date) => {
            const daysArray: DayObjectType[] = [];
            const firstDayToRender = new Date(pivotDate);
            firstDayToRender.setDate(
                pivotDate.getDate() - TARGET_SELECTED_OFFSET
            );

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < VISIBLE_DAYS_COUNT; i++) {
                const date = new Date(firstDayToRender);
                date.setDate(firstDayToRender.getDate() + i);

                daysArray.push({
                    day: date.getDate(),
                    weekDay: DAYS_OF_WEEK[date.getDay()],
                    date: date,
                    isCurrentMonth: date.getMonth() === pivotDate.getMonth(),
                    isToday: date.getTime() === today.getTime(),
                });
            }
            setDaysInView(daysArray);

            if (onDateSelect && daysArray.length > TARGET_SELECTED_OFFSET) {
                onDateSelect(daysArray[TARGET_SELECTED_OFFSET]);
            }

            setTimeout(() => {
                const scrollXOffset =
                    TARGET_SELECTED_OFFSET > 1 ? TARGET_SELECTED_OFFSET - 1 : 0;
                scrollViewRef.current?.scrollTo({
                    x: DAY_ITEM_WIDTH * scrollXOffset,
                    animated: false,
                });
            }, 0);
        };

        generateAndSetDays(currentDateForView);
    }, [currentDateForView, onDateSelect]);

    const handleDayPress = (itemDate: Date) => {
        const newDate = new Date(itemDate);
        newDate.setHours(0, 0, 0, 0);
        setCurrentDateForView(newDate);
    };

    return (
        <View style={styles.carouselContainer}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysContainer}
                decelerationRate="fast"
                snapToInterval={DAY_ITEM_WIDTH}
            >
                {daysInView.map((item, index) => (
                    <TouchableOpacity
                        key={item.date.getTime()}
                        style={[
                            styles.dayItem,
                            !item.isCurrentMonth && styles.differentMonthDay,
                        ]}
                        onPress={() => handleDayPress(item.date)}
                    >
                        <Text style={styles.dayText}>{item.weekDay}</Text>
                        {index === TARGET_SELECTED_OFFSET && (
                            <View style={styles.selectedCircleContainer}>
                                <View style={styles.selectedDayCircle} />
                            </View>
                        )}
                        <Text
                            style={[
                                styles.dateText,
                                index === TARGET_SELECTED_OFFSET
                                    ? styles.selectedDayText
                                    : styles.emptyStyle,
                                item.isToday &&
                                    index !== TARGET_SELECTED_OFFSET &&
                                    styles.todayTextNotSelected,
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
    const [currentHeaderInfo, setCurrentHeaderInfo] =
        useState<DayObjectType | null>(null);
    const calendarRef = useRef<CalendarCarouselRef>(null);

    const formatDate = (dateInfo: DayObjectType | null) => {
        if (!dateInfo) return "";
        const day = dateInfo.date.getDate();
        const month = MONTHS[dateInfo.date.getMonth()];
        return `${
            DAYS_OF_WEEK_FULL[dateInfo.date.getDay()]
        }, ${day} de ${month}`;
    };

    const getHeaderTitle = (dateInfo: DayObjectType | null) => {
        if (!dateInfo) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = true;
            const day = today.getDate();
            const weekDay = DAYS_OF_WEEK[today.getDay()];
            const tempDateInfo: DayObjectType = {
                day: day,
                weekDay: weekDay,
                date: today,
                isCurrentMonth: true,
                isToday: isToday,
            };
            if (tempDateInfo.isToday) return "Hoje";
        }
        if (dateInfo!.isToday) return "Hoje";

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const selectedDateValue = dateInfo!.date;

        if (selectedDateValue.getTime() === tomorrow.getTime()) return "Amanhã";
        if (selectedDateValue.getTime() === yesterday.getTime()) return "Ontem";

        return DAYS_OF_WEEK_FULL[selectedDateValue.getDay()];
    };

    const handleDateSelectFromCarousel = useCallback(
        (dateInfo: DayObjectType) => {
            setCurrentHeaderInfo(dateInfo);
            onDateSelected(dateInfo.date);
        },
        [onDateSelected]
    );

    const handleNavigate = (direction: "next" | "prev") => {
        calendarRef.current?.navigateDay(direction);
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => handleNavigate("prev")}
                >
                    <Ionicons name="chevron-back" size={24} color="#888888" />
                </TouchableOpacity>

                <View style={styles.titleTextContainer}>
                    <Text style={styles.title}>
                        {getHeaderTitle(currentHeaderInfo)}
                    </Text>
                    <Text style={styles.subtitle}>
                        {formatDate(currentHeaderInfo)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => handleNavigate("next")}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#888888"
                    />
                </TouchableOpacity>
            </View>

            <CalendarCarousel
                ref={calendarRef}
                onDateSelect={handleDateSelectFromCarousel}
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
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
    },
    titleTextContainer: {
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
        color: "#181818",
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: "#666666",
        marginTop: 2,
    },
    arrowButton: {
        padding: 8,
    },
    carouselContainer: {
        width: "100%",
        marginTop: 8,
    },
    daysContainer: {},
    dayItem: {
        width: DAY_ITEM_WIDTH - 4,
        height: 65,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 2,
        borderRadius: 12,
    },
    selectedCircleContainer: {
        position: "absolute",
        top: "55%",
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        transform: [{ translateY: -(36 / 2) }],
    },
    selectedDayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginTop: 10,
        backgroundColor: Colors.primary,
    },
    selectedDayText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        zIndex: 2,
    },
    differentMonthDay: {
        opacity: 0.5,
    },
    dayText: {
        fontSize: 13,
        lineHeight: 18,
        color: "#999999",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
    },
    todayTextNotSelected: {
        color: Colors.primary,
        fontWeight: "bold",
    },
    emptyStyle: {},
});
