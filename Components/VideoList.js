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
  ActivityIndicator
} from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import ViewsIcon from "../assets/icon-view.png";
import LikeIcon from "../assets/icon-heart.png";

export default class VideoList extends React.Component {
  state = {
    videoList: [],
    user: {},
  };


  componentDidMount() {
    const id = this.state.userId;
    firebase
      .database()
      .ref("/public/video_list/")
      .on("value", (suc) => {
        this.setState({
          videoList: suc.val(),
        });
      });
  }

  getPoster = (id) => {
    firebase
      .storage()
      .ref(`/videos_poster/${id}`)
      .getDownloadURL()
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.log(3663, err);
      });
  };

  list = () => {
    if (this.state.videoList && this.state.videoList.length !== 0) {
      const array = this.state.videoList;
      const keyArr = Object.keys(array);
      const reversed = keyArr.reverse()
      return reversed.map((id) => {
        let output = array[id];
        // let imgUrl = this.getPoster(output.id); //get rid of this
        return (
          <TouchableOpacity
            key={id}
            onPress={() =>
              this.props.navigation.navigate("video player", {
                video_id: output,
              })
            }
          >
            <View>
              <Image
                style={styles.poster}
                source={{ uri: output.poster_path }}
              />
              <View style={styles.info}>
                <Image style={styles.avatar} source={{ uri: output.avatar }} />

                <View style={styles.infoText}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{output.title}</Text>
                    <Text style={styles.p}>{output.channel}</Text>
                  </View>

                  <View style={styles.dataContainer}>
                    <Text style={styles.p}>
                      {this.dynaDate(Number(output.date_posted))}
                    </Text>
                    <View style={styles.data}>
                      <View style={styles.iconContainer}>
                        <Image source={LikeIcon} style={styles.icon} />
                        <Text style={styles.p}>{output.likes}</Text>
                      </View>

                      <View style={styles.iconContainer}>
                        <Image source={ViewsIcon} style={styles.icon} />
                        <Text style={styles.p}>{output.views}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      return (
        <View style={styles.loading}>
          <ActivityIndicator/>
        </View>
      )
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

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <View>{this.list()}</View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    height: '100%',
    // alignItems: "center",
    justifyContent: "center",
  },
  poster: {
    height: 210,
    width: 375,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  white: {
    backgroundColor: "white",
  },
  info: {
    flexDirection: "row",
    padding: 16,
  },
  infoText: {
    flex: 1,
  },
  label: {
    color: "grey",
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
  loading: {
    // height: '100%',
    // width: '100%',
    // // alignItems: 'center',
    // // justifyContent: 'center',
    // backgroundColor: 'pink'
  }
});
