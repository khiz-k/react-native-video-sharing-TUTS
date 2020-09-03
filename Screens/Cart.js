import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";


export default function Cart() {
  return (
        <View style={styles.container}>
          <Text>Cart page </Text>
        </View>
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
