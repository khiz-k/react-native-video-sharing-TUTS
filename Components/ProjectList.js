import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Animated,
  Image,
} from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import DeleteIcon from "../assets/icon-delete.png";

export default class ProjectList extends React.Component {
  state = {
    projectList: null,
    newProject: null,
  };

  static contextType = UserContext;

  addProject = () => {
    this.textInput.clear();
    const output = this.state.newProject;

    // if (this.state.projectList !== null) {}
    const projectKey = firebase.database().ref().child("project").push().key;
    const projectData = {
      id: projectKey,
      project_name: output,
      date_created: Date.now(),
    };
    const updates = {};
    updates[
      `users/${this.context.user.uid}/projects/${projectKey}`
    ] = projectData;
    firebase.database().ref().update(updates);
  };

  componentDidMount() {
    firebase
      .database()
      .ref(`/users/${this.context.user.uid}/projects`)
      .on("value", (suc) => {
        this.setState({
          projectList: suc.val(),
        });
        const input = suc.val();
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

  deleteProject = (id) => {
    firebase
      .database()
      .ref(`users/${this.context.user.uid}/projects/${id}`)
      .update({
        isDeleted: true,
      });
  };

  rightActions = ({ progress, dragX, id }) => {
    const trans = dragX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 0],
    });
    return (
      <RectButton
        style={styles.leftAction}
        onPress={() => this.deleteProject(id)}
      >
        <Animated.Text
          style={[styles.actionText, { transform: [{ translateX: trans }] }]}
        >
          <Image source={DeleteIcon} style={styles.icon} />
        </Animated.Text>
      </RectButton>
    );
  };

  projectProgress = (obj) => {
    let length = 0;
    let completed = 0;
    if (obj.saved) {
      const objKeys = Object.entries(obj.saved);
      objKeys.map((item) => {
        const input = item[1].steps;
        length += input.length;
        input.map((step) => {
          if (step.is_done) {
            completed++;
          }
        });
      });

      const output = Math.round((completed / length) * 100);
      return (
        <View style={styles.progressContainer}>
          <Text style={styles.progressPercent}>{output} %</Text>
          {output === 100 ? (
            <Text style={styles.progressLabel}>COMPLETED! 🎉</Text>
          ) : (
            <Text style={styles.progressLabel}>COMPLETED!</Text>
          )}
        </View>
      );
    }
    // const completed = arr.filter((item) => item.is_done === true);
    // const percent = Math.round((completed.length / arr.length) * 100);
    // if (percent === 100) {
    //   return (
    //     <Text>
    //       {percent}% completed! <Text style={styles.accent}>- Good Job!</Text>{" "}
    //     </Text>
    //   );
    // } else {
    //   return <Text>{percent}% completed</Text>;
    // }
  };

  list = () => {
    if (this.state.projectList !== null) {
      const input = this.state.projectList;
      const keyArr = Object.keys(input);
      const reverseArr = keyArr.reverse();
      return reverseArr.map((id) => {
        let output = input[id];
        if (
          !output.isDeleted ||
          (output.isDeleted && output.isDeleted !== true)
        ) {
          return (
            <View key={output.id} style={styles.projectCard}>
              <Swipeable
                renderRightActions={(progress, dragX) =>
                  this.rightActions({ progress, dragX, id })
                }
              >
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() =>
                    this.props.navigation.navigate("Project Item", {
                      id: output.id,
                    })
                  }
                >
                  <View style={styles.projectList}>
                    <Text style={styles.h3}>{output.project_name}</Text>
                    <Text style={styles.p}>
                      Created {this.dynaDate(output.date_created)}
                    </Text>
                  </View>
                  {this.projectProgress(output)}
                </TouchableOpacity>
              </Swipeable>
            </View>
          );
        }
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ADD A NEW PROJECT"
              onChangeText={(value) => this.setState({ newProject: value })}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              clearTextOnFocus
              textAlign="center"
              placeholderTextColor="#3772FF"
              autoCorrect={false}
              onSubmitEditing={this.addProject}
              ref={(input) => {
                this.textInput = input;
              }}
            />
          </View>
          {this.list()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    height: 48,
    margin: 16,
    borderRadius: 4,
    borderColor: "#3772FF",
    borderWidth: 2,
    paddingHorizontal: 8,
    flex: 1,
  },
  btn: {
    height: 48,
    width: 100,
    marginLeft: 16,
    backgroundColor: "#3772FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    // flexGrow: 1
    // flex: 1
  },
  btnText: {
    color: "white",
  },
  projectList: {
    paddingVertical: 16,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
  },
  p: {
    paddingVertical: 8,
  },
  icon: {
    height: 20,
    width: 20,
  },
  leftAction: {
    // backgroundColor: "red",
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  listItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  projectCard: {
    paddingHorizontal: 16,
    marginBottom: 36,
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
  progressContainer: {
    alignItems: "center",
  },
  progressPercent: {
    color: "#3772FF",
    fontSize: 24,
    fontWeight: "600",
  },
  progressLabel: {
    color: "#3772FF",
  },
});
