import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";

import firebase from "firebase";

export default class Loading extends React.Component {
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // take user to main
        // this.props.navigation.navigate('Main')
      } else {
        // user login
        this.props.navigation.navigate("Login");
      }
    });
  };

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
