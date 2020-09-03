import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
} from "react-native";
import Logo from "../assets/tuts-logo.jpg";
import Search from "../assets/Icon-search.png";
import { UserContext } from "../Context/UserContext";

import Profile from "../Screens/Profile";

import firebase from "firebase";

// const dbVideoList = firebase.database().ref('/0/')

export default class Header extends React.Component {
  static contextType = UserContext;

  addAvatar = () => {
    if (this.context.user) {
      return (
        <Image
          source={{
            uri: this.context.user.photoURL,
          }}
          style={styles.avatar}
        />
      );
    } else {
      return <View></View>;
    }
  };

  render() {
    return (
      <View style={styles.headerBarContainer}>
        <SafeAreaView style={styles.headerBar}>
          <Image source={Logo} style={styles.logo} />
          <View style={styles.iconContainer}>
            <Image source={Search} style={styles.icon} />
            <Profile />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 38,
    width: 85,
    marginHorizontal: 16,
  },
  icon: {
    height: 30,
    width: 30,
    marginHorizontal: 16,
  },
  headerBarContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // height: 110,
    backgroundColor: "white",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    backgroundColor: "blue",
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
});
