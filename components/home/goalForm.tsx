import { TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export const GoalForm = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TextInput placeholder="Title" />
      <TextInput placeholder="Description" />
      <DateTimePicker
        
        value={new Date()}
        mode="datetime" // Use "time" for time selection or "datetime" for both
        // display={Platform.OS === "ios" ? "inline" : "default"}
        // onChange={onChange}
      />
    </View>
  );
};
