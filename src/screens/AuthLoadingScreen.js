import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator,AsyncStorage } from 'react-native'

export class AuthLoadingScreen extends Component {

  async componentDidMount() {
    await this.loadConfig()
    this.loadApp()
  }
  loadConfig = async ()=>{
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    await Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  }
  loadApp = async () =>{
    const accessToken = await AsyncStorage.getItem('accessToken');
    // this.props.navigation.navigate(accessToken?'App':'Auth')
    this.props.navigation.navigate(accessToken?'Auth':'App')
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" /> 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AuthLoadingScreen
