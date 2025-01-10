import { styles } from "./DisplayTemperature.style";
import { View, Text, TextInput } from "react-native";

export function DisplayTemperature({ temperature, unit }) {
  return (
    <View>
      <Text style={styles.temperature}>
        {temperature} {unit}
      </Text>
    </View>
  );
}
