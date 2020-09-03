import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";
import { List } from "react-native-paper";
import ArrowUp from "../assets/arrow-up.png";
import ArrowDown from "../assets/arrow-down.png";
import Unchecked from "../assets/check-box.png";
import Checked from "../assets/check-box-checked.png";

export default class Accordion extends React.Component {
  state = {
    isOpen: false,
    isChecked: false,
  };

  static contextType = UserContext;

  toggle = () => {
    this.state.isOpen
      ? this.setState({ isOpen: false })
      : this.setState({ isOpen: true });
  };

  handleList = (arr) => {
    return arr.map((item, i) => {
      return (
        <Text key={i} style={styles.listItem}>
          <Text style={styles.accentColor}>{i + 1}. </Text>
          {item}
        </Text>
      );
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.toggle} style={styles.dropdownBtn}>
          <Text style={styles.header}>{this.props.title}</Text>
          <Image
            source={this.state.isOpen ? ArrowUp : ArrowDown}
            style={styles.arrowIcons}
          />
        </TouchableOpacity>
        <View style={this.state.isOpen ? styles.show : styles.hide}>
          {this.handleList(this.props.data)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  video: {
    height: 210,
    width: "100%",
  },
  done: {
    color: "red",
    backgroundColor: "red",
  },
  notDone: {
    color: "pink",
    backgroundColor: "pink",
  },
  show: {
    // backgroundColor: "pink",
  },
  hide: {
    display: "none",
  },
  dropdownBtn: {
    // backgroundColor: "pink",
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcons: {
    height: 20,
    width: 20,
  },
  listItem: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontWeight: "600",
  },
  accentColor: {
    color: "#3772FF",
  },
});
