import { styles } from "./App.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ImageBackground, Alert, Platform } from "react-native";
import hotBackground from "./assets/hot.png";
import coldBackground from "./assets/cold.png";
import { Input } from "./components/Input/Input";
import { DisplayTemperature } from "./components/DisplayTemperature/DisplayTemperature";
import { useEffect, useState, useRef } from "react";
import {
  convertTemperatureTo,
  getOppositeUnit,
  isColdTemperature,
} from "./utils/temperature";
import { ButtonConverter } from "./components/ButtonConverter/ButtonConverter";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

// ******* PART OF EXPO CODE STARTS **********

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ******* PART OF EXPO CODE ENDS **********

export default function App() {
  const [inputValue, SetInputValue] = useState(34);
  const [currentUnit, SetCurrentUnit] = useState("*C");
  const [currentBackground, SetCurrentBackground] = useState(hotBackground);
  const oppositeUnit = getOppositeUnit(currentUnit);

  // *********** EXPO Notification code starts ***********

  const [expoPushToken, setExpoPushToken] = useState("");

  const [notification, setNotification] = useState(undefined);
  const [channels, setChannels] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  // const [notification, setNotification] = (useState < Notifications.Notification) | (undefined > undefined);
  // const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  // const notificationListener = useRef<Notifications.EventSubscription>();
  // const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    subscribeToNotifications().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) => {
        console.log("Channel Value: ", value);
        setChannels(value ?? []);
      });
    }

    // App is in background or killed and then the notification is pressed
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("App is in background");

      console.log(
        "addNotificationResponseReceivedListener: ",
        response.notification.request.content
      );
    });

    // App is opened and notification is received
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("App is active");

      console.log(
        "addNotificationReceivedListener: ",
        notification.request.content
      );
      setNotification(notification);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function subscribeToNotifications() {
    let token;
    console.log("Inside subscribeToNotifications");

    if (Platform.OS === "android") {
      console.log("Inside Android");
      // myNotificationChannel
      await Notifications.setNotificationChannelAsync("default", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    console.log("Outside Android");

    if (Device.isDevice) {
      console.log("Inside Device");

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync(); // Asking for Permission again
        finalStatus = status;
      }

      console.log("finalStatus: ", finalStatus);

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      console.log("final finalStatus: ", finalStatus);

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;

        console.log("projectId: ", projectId);

        if (!projectId) {
          throw new Error("Project ID not found");
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

        // Alert.alert(token);
        console.log(token);
      } catch (e) {
        console.log("Error: ", e);
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // *********** EXPO Notification code ENDS ***********

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
