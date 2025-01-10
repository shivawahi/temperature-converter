import { styles } from "./ButtonConverter.style";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export function ButtonConverter({ unit, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View>
        <Text style={styles.buttonTxt}>Convert to {unit}</Text>
      </View>
    </TouchableOpacity>
  );
}
