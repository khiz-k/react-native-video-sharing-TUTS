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
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Accordion from "./Accordion";
import ViewsIcon from "../assets/icon-view.png";
import LikeIcon from "../assets/icon-heart.png";
import Comments from "./Comments";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

export default class VideoPlayer extends React.Component {
  state = {
    videoUrl: null,
    videoPlayer: null,
    userProjects: null,
    stepIsOpen: false,
    materialIsOpen: false,
  };

  static contextType = UserContext;

  componentDidMount() {
    firebase
      .database()
      .ref(`public/video_player/${this.props.route.params.video_id.id}`)
      .once("value")
      .then((suc) => {
        const output = suc.val();
        this.setState({
          videoPlayer: output,
        });
        this.addView();
      });

    firebase
      .database()
      .ref(`users/${this.context.user.uid}`)
      .on("value", (suc) => {
        const output = suc.val();
        this.setState({
          userProjects: output,
        });
      });
  }

  addView = () => {
    const views = ++this.state.videoPlayer.views;

    firebase
      .database()
      .ref(`public/video_player/${this.props.route.params.video_id.id}`)
      .update({ views: views });

    firebase
      .database()
      .ref(`public/video_list/${this.props.route.params.video_id.id}`)
      .update({ views: views });
  };

  addLike = () => {
    const likes = ++this.state.videoPlayer.likes

    this.setState({
      videoPlayer: {...this.state.videoPlayer, likes: likes}
    })

    firebase
      .database()
      .ref(`public/video_player/${this.props.route.params.video_id.id}`)
      .update({ likes: likes });

    firebase
      .database()
      .ref(`public/video_list/${this.props.route.params.video_id.id}`)
      .update({ likes: likes });
  };

  projectList = () => {
    if (this.state.userProjects !== null) {
      const input = this.state.userProjects.projects;
      const keyArr = Object.keys(input);
      const reversedArr = keyArr.reverse();
      return reversedArr.map((itemKey) => {
        console.log(input[itemKey])
        let output = input[itemKey];
        return { label: output.project_name, value: output.id };
      });
    } else {
      return;
    }
  };

  updateSteps = (stepsArr) => {
    if (this.state.userProjects !== null) {
      const newList = stepsArr.map((step) => {
        return { item: step, is_done: false };
      });
      return newList;
    }
  };

  saveProject = (item) => {
    if (this.state.userProjects !== null) {
      const { videoPlayer } = this.state;
      const steps = this.updateSteps(videoPlayer.steps);
      const materials = this.updateSteps(videoPlayer.materials);
      const videoData = {
        video_id: videoPlayer.video_id,
        video_title: videoPlayer.video_title,
        video_url: videoPlayer.video_url,
        steps: steps,
        materials: materials,
      };

      item.map((projectKey) => {
        firebase
          .database()
          .ref(
            `/users/${this.context.user.uid}/projects/${projectKey}/saved/${videoPlayer.video_id}`
          )

          .update(videoData);
      });
    }
  };

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

  projectDropdown = () => {
    if (this.state.userProjects !== null && this.state.userProjects.projects) {
      return (
        <DropDownPicker
          items={this.projectList()}
          multiple={true}
          style={styles.btn}
          dropDownStyle={styles.dropDownPicker}
          placeholder="SAVE TO PROJECT"
          dropDownMaxHeight={200}
          onChangeItem={(item) => this.saveProject(item)}
          // onChangeItem={(item) =>
          //   this.setState({
          //     savedTo: item.value,
          //   })
          // }
        />
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("projects")}
        >
          <View style={styles.noProjectsContainer}>
            <Text>CREATE A PROJECT TO SAVE THIS VIDEO</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const video = this.state.videoPlayer;
    if (this.state.videoPlayer === null) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Video
            source={{
              uri: video.video_url,
            }}
            useNativeControls
            style={styles.backgroundVideo}
          />

          <KeyboardAwareScrollView>
            <View style={styles.textContainer}>
              <View style={styles.info}>
                <Image
                  source={{ uri: video.channel_avatar }}
                  style={styles.avatar}
                />

                <View style={styles.infoText}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{video.video_title}</Text>
                    <Text style={styles.p}>{video.channel_name}</Text>
                  </View>
                  <View style={styles.dataContainer}>
                    <Text style={styles.p}>
                      {this.dynaDate(Number(video.date_posted))}
                    </Text>
                    <View style={styles.data}>
                      <TouchableOpacity onPress={this.addLike} style={styles.iconContainer}>
                        <Image source={LikeIcon} style={styles.icon} />
                        <Text style={styles.p}>{video.likes}</Text>
                      </TouchableOpacity>
                      <View style={styles.iconContainer}>
                        <Image source={ViewsIcon} style={styles.icon} />
                        <Text style={styles.p}>{video.views}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>DESCRIPTION</Text>
                <Text>{video.description}</Text>
              </View>

              <View style={styles.projectDropdownContainer}>
                {this.projectDropdown()}
              </View>

              <Accordion
                title="STEP BY STEP INSTRUCTIONS"
                subTitle=""
                data={video.steps}
              />
              <Accordion
                title={`MATERIALS`}
                subTitle={`suggested by ${video.channel_name}`}
                data={video.materials}
              />
            </View>
            <Comments data={video} />
            <View style={styles.spacer}></View>
          </KeyboardAwareScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  backgroundVideo: {
    // position: "absolute",
    width: "100%",
    height: 210,
    // top: 0,
  },
  textContainer: {
    padding: 16,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  iconContainer: {
    flexDirection: "row",
  },
  info: {
    flexDirection: "row",
  },
  infoText: {
    flex: 1,
  },
  label: {
    color: "grey",
    fontSize: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  p: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    height: 20,
    width: 20,
    marginHorizontal: 8,
  },
  titleContainer: {
    // width: "60%",
    padding: 8,
  },
  dataContainer: {
    // width: "40%",
    padding: 8,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  data: {
    flexDirection: "row",
  },
  btn: {
    height: 48,
    width: "100%",
    borderColor: "#3772FF",
    borderWidth: 2,
    zIndex: 2,
  },
  dropDownPicker: {
    borderColor: "#3772FF",
    borderWidth: 2,
    zIndex: 2,
  },
  projectDropdownContainer: {
    marginVertical: 16,
    zIndex: 2,
  },
  noProjectsContainer: {
    height: 48,
    width: "100%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3772FF",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionContainer: {
    paddingVertical: 16,
  },
  spacer: {
    height: 100,
  },
});
