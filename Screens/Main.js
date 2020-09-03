import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VideoList from "../Components/VideoList";
import VideoPlayer from "../Components/VideoPlayer";
import Profile from "../Screens/Profile";

const HomeStack = createStackNavigator();

export default function Main() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="video list"
        component={VideoList}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="video player"
        component={VideoPlayer}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
