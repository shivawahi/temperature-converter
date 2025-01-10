import { styles } from "./App.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ImageBackground } from "react-native";
import hotBackground from "./assets/hot.png";
import coldBackground from "./assets/cold.png";
import { Input } from "./components/Input/Input";
import { DisplayTemperature } from "./components/DisplayTemperature/DisplayTemperature";
import { useEffect, useState } from "react";
import {
  convertTemperatureTo,
  getOppositeUnit,
  isColdTemperature,
} from "./utils/temperature";
import { ButtonConverter } from "./components/ButtonConverter/ButtonConverter";

export default function App() {
  const [inputValue, SetInputValue] = useState(34);
  const [currentUnit, SetCurrentUnit] = useState("*C");
  const [currentBackground, SetCurrentBackground] = useState(hotBackground);
  const oppositeUnit = getOppositeUnit(currentUnit);

  useEffect(() => {
    return isColdTemperature(inputValue, currentUnit)
      ? SetCurrentBackground(coldBackground)
      : SetCurrentBackground(hotBackground);
  }, [inputValue, currentUnit]);

  function getConvertedTemperature() {
    if (isNaN(inputValue)) {
      return "";
    } else {
      return convertTemperatureTo(inputValue, oppositeUnit).toFixed(2);
    }
  }

  function changeBackgroundImage() {
    return isColdTemperature(inputValue, currentUnit)
      ? coldBackground
      : hotBackground;
  }

  return (
    <ImageBackground source={currentBackground} style={styles.backgroundImg}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.root}>
          <View style={styles.workspace}>
            <DisplayTemperature
              unit={oppositeUnit}
              temperature={getConvertedTemperature()}
            ></DisplayTemperature>
            <Input
              unit={currentUnit}
              onChange={SetInputValue}
              defaultValue={inputValue}
            ></Input>
            <ButtonConverter
              onPress={() => {
                SetCurrentUnit(oppositeUnit);
              }}
              unit={currentUnit}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
