import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import firebase from "firebase";
import { createStackNavigator } from "@react-navigation/stack";
import ProjectList from "../Components/ProjectList";
import ProjectItem from "../Components/ProjectItem";

const ProjectStack = createStackNavigator();

export default function Projects() {
  return (
    <ProjectStack.Navigator>
      <ProjectStack.Screen
        name="Project list"
        component={ProjectList}
        options={{ headerShown: false }}
      />
      <ProjectStack.Screen
        name="Project Item"
        component={ProjectItem}
        options={{ headerShown: false }}
      />
    </ProjectStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "pink",
    height: 48,
    width: "100%",
  },
});
