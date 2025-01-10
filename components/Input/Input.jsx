import { styles } from "./Input.style";
import { View, Text, TextInput } from "react-native";

export function Input({ defaultValue, onChange, unit }) {
  return (
    <View style={styles.root}>
      <TextInput
        style={styles.input}
        placeholder="Type your temperature here"
        maxLength={3}
        defaultValue={defaultValue.toString()}
        onChangeText={(text) => {
          onChange(text);
        }}
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}
