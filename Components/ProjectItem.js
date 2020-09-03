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

class Accordion extends React.Component {
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

  toggleStep = (index) => {
    const userId = this.context.user.uid;
    const projectKey = this.props.projectKey;
    const objKey = this.props.objKey;
    const path = this.props.path;
    const input = this.props.data[index].is_done;
    if (input === false) {
      return firebase
        .database()
        .ref(
          `/users/${userId}/projects/${projectKey}/saved/${objKey}/${path}/${index}`
        )
        .update({ is_done: true });
    } else {
      return firebase
        .database()
        .ref(
          `/users/${userId}/projects/${projectKey}/saved/${objKey}/${path}/${index}`
        )
        .update({ is_done: false });
    }
  };

  handleList = (arr) => {
    return arr.map((item, i) => {
      return (
        <View key={i}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => this.toggleStep(i)}
          >
            <Text style={styles.listText}>{item.item}</Text>
            <Image
              source={item.is_done ? Checked : Unchecked}
              style={styles.arrowIcons}
            />
          </TouchableOpacity>
        </View>
      );
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.toggle} style={styles.dropdownBtn}>
          <Text style={styles.dropdownHeader}>{this.props.title}</Text>
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

export default class ProjectItem extends React.Component {
  state = {
    savedVideos: null,
    userId: this.context.user.uid,
  };
  static contextType = UserContext;

  componentDidMount() {
    const userId = this.state.userId;
    const projectId = this.props.route.params;
    firebase
      .database()
      .ref(`/users/${userId}/projects/${projectId.id}`)
      .on("value", (suc) => {
        this.setState({
          savedVideos: suc.val(),
        });
      });
  }

  projectProgress = (arr) => {
    const completed = arr.filter((item) => item.is_done === true);
    const percent = Math.round((completed.length / arr.length) * 100);
    if (percent === 100) {
      return (
        <Text>
          {percent}% completed! <Text style={styles.accent}>- Good Job!</Text>{" "}
        </Text>
      );
    } else {
      return <Text>{percent}% completed</Text>;
    }
  };

  projectCard = () => {
    if (this.state.savedVideos && this.state.savedVideos.saved) {
      const inputObj = this.state.savedVideos.saved;
      const savedKeys = Object.keys(inputObj);
      return savedKeys.map((key) => {
        const output = inputObj[key];
        return (
          <View key={key} style={styles.projectCard}>
            <Video
              source={{ uri: output.video_url }}
              style={styles.video}
              useNativeControls
            />
            <View style={styles.textConteiner}>
              <Text style={styles.title}>{output.video_title}</Text>
              {this.projectProgress(output.steps)}
              <Accordion
                title="STEPS TO FOLLOW"
                data={output.steps}
                objKey={key}
                projectKey={this.props.route.params.id}
                path="steps"
              />

              <Accordion
                title="REQUIRED MATERIALS"
                data={output.materials}
                objKey={key}
                projectKey={this.props.route.params.id}
                path="materials"
              />
              <View style={styles.spacer}></View>
            </View>
          </View>
        );
      });
    }
  };

  render() {
    if (this.state.savedVideos && !this.state.savedVideos.saved) {
      return (
        <View style={styles.noVideos}>
          <Text style={styles.noVideosText}>No videos saved!</Text>
          <Text style={styles.noVideosSubText}>To save a video to your project, click the 'SAVE TO PROJECT' button while watching a video</Text>
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <View>{this.state.savedVideos && this.projectCard()}</View>
          <View style={styles.bottomSpacer}></View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
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
  hide: {
    display: "none",
  },
  dropdownBtn: {
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
    width: "100%",
  },
  textConteiner: {
    padding: 16,
  },
  spacer: {
    height: 24,
    width: "100%",
  },
  bottomSpacer: {
    height: 100,
    width: "100%",
  },
  listText: {
    width: "90%",
  },
  dropdownHeader: {
    fontWeight: "600",
  },
  accent: {
    color: "#3772FF",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 8,
  },
  projectCard: {
    marginBottom: 56,
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
  noVideos: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideosText: {
    fontSize: 20,
    fontWeight: "600",
  },
  noVideosSubText: {
    textAlign: 'center',
    padding: 16
  },

});
