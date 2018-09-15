import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator,AsyncStorage } from 'react-native'
import {connect} from 'react-redux'

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
    const {accessToken} = this.props;
    this.props.navigation.navigate(accessToken?'App':'Auth')
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

const mapStateToProps = state => ({
  accessToken : state.auth.accessToken
})
export default connect(mapStateToProps)(AuthLoadingScreen)
