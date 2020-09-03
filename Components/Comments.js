import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { Video } from "expo-av";
import { List } from "react-native-paper";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Accordion from "./Accordion";
import ViewsIcon from "../assets/icon-view.png";
import LikeIcon from "../assets/icon-heart.png";

export default class Comments extends React.Component {
  state = {
    name: this.context.user.displayName,
    userId: this.context.user.uid,
    avatar: this.context.user.photoURL,
    video_id: this.props.data.video_id,
    input: null,
    comments: null,
    hasComments: false,
  };

  componentDidMount() {
    console.log("the component is mounting");
    firebase
      .database()
      .ref(`public/video_player/${this.state.video_id}/comments`)
      .on("value", (suc) => {
        this.setState({
          comments: suc.val(),
        });
      });
  }

  dynaDate = (datePosted) => {
    let seconds = (Date.now() - datePosted) / 1000;
    let unix = new Date(datePosted);
    let day = unix.getDate();
    let month = unix.getMonth() + 1;
    let year = unix.getFullYear();
    if (seconds < 60) {
      return `${Math.trunc(seconds)}s ago`;
    } else if (seconds < 3600) {
      return `${Math.trunc(seconds / 60)}m ago`;
    } else if (seconds < 86400) {
      return `${Math.trunc(seconds / 60 / 60)}h ago`;
    } else if (seconds < 2592000) {
      return `${Math.trunc(seconds / 30 / 60 / 60)}d ago`;
    } else {
      return `${month}/${day}/${year}`;
    }
  };

  renderComment = () => {
    const input = this.state.comments;
    const objKey = Object.keys(input);
    objKey.reverse()
    return objKey.map((itemKey) => {
      const output = input[itemKey];
      return (
        <View key={output.date_posted} style={styles.commentCard}>
          <Image source={{ uri: output.avatar }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{output.name}</Text>
            <Text style={styles.date}>{this.dynaDate(output.date_posted)}</Text>
            <Text style={styles.commentText}>{output.comment}</Text>
          </View>
        </View>
      );
    });
  };

  addComment = () => {
    const commentKey = firebase.database().ref().child("comments").push().key;

    firebase
      .database()
      .ref(`public/video_player/${this.state.video_id}/comments`)
      .update({
        [commentKey]: {
          comment: this.state.input,
          date_posted: Date.now(),
          uid: this.state.userId,
          avatar: this.state.avatar,
          name: this.state.name,
        },
      });
    this.textInput.clear();
  };

  static contextType = UserContext;
  render() {
    return (
      <View style={styles.commentComponent}>
        <Text style={styles.label}>COMMENTS</Text>
        <View style={styles.commentContainer}>
          <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="ADD A COMMENT"
              placeholderTextColor={"black"}
              onChangeText={(value) => this.setState({ input: value })}
              ref={(input) => {
                this.textInput = input;
              }}
            />
            <TouchableOpacity onPress={this.addComment} style={styles.btn}>
              <Text style={styles.btnText}>ADD COMMENT</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.comments !== null && this.renderComment()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentComponent: {
    zIndex: -1,
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    paddingBottom: 8,
  },
  label: {
    color: "grey",
    fontSize: 12,
    padding: 16,
  },
  date: {
    color: "grey",
    fontSize: 12,
    // paddingVertical: 16,
  },
  inputContainer: {
    flex: 1
  },
  input: {
    height: 80,
    borderRadius: 4,
    borderColor: "#3772FF",
    borderWidth: 2,
    paddingHorizontal: 8,
    flex: 1,
    // justifyContent:
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  commentContainer: {
    flexDirection: "row",
    paddingBottom: 42,
    paddingHorizontal: 16,
  },
  commentCard: {
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingVertical: 16,
    backgroundColor: "pink",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  commentText: {
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  btn: {
    height: 48,
    width: "100%",
    backgroundColor: "#3772FF",
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16
  },
  btnText: {
    color: 'white'
  }
});
