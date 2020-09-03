import React from "react";
import { StyleSheet, Text, View, Button, Modal, TouchableOpacity, Image } from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { SafeAreaView } from "react-navigation";

export default class Profile extends React.Component {
  state = {
    modalIsOpen: false,
  };

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

  toggleModal = () => {
    if (this.state.modalIsOpen === false) {
      this.setState({
        modalIsOpen: true,
      });
    } else {
      this.setState({
        modalIsOpen: false,
      });
    }
  };

  render() {
    return (
      <View>
        <Modal visible={this.state.modalIsOpen}>
          <SafeAreaView>
            <View style={styles.content}>
              <Button title='sign out' onPress={() => firebase.auth().signOut()} />
              <Button title="close" onPress={() => this.toggleModal()} />
            </View>
          </SafeAreaView>
        </Modal>
        <TouchableOpacity onPress={() => this.toggleModal()}>
          <View style={styles.avatarContainer}>{this.addAvatar()}</View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: "blue",
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatar: {
    height: 48,
    width: 48,
  },
  content: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
