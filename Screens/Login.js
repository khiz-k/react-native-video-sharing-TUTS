import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import Logo from "../assets/tuts-logo.jpg";

export default class Login extends React.Component {
  state = {
    user: {},
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          // googleUser.getAuthResponse().id_token
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            this.props.setUser(result);
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  create_at: Date.now(),
                });
            } else {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .update({
                  last_logged_in: Date.now(),
                });
            }
          })

          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId:
          "726591548795-5855jsiic7kdfrc42d89bj60p0u1tm1s.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcome}>
          Welcome to<Text style={styles.accent}> Tuts</Text>!
        </Text>
        {/* <Text style={styles.tagLine}>- your go to for all projects</Text> */}
        <Text style={styles.text}>Sign in:</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            this.signInWithGoogleAsync();
          }}
        >
          <Text style={styles.btnText}>Google</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  btn: {
    height: 48,
    width: "100%",
    backgroundColor: "#3772FF",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 4,
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
  },
  logo: {
    height: 50,
    margin: 24,
  },
  text: {
    paddingTop: 24,
    paddingBottom: 8,
    fontStyle: "italic",
  },
  accent: {
    color: "#3772FF",
    fontStyle: "italic",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    padding: 8,
  },
  tagLine: {
    fontStyle: "italic",
    paddingBottom: 20,
  },
});
