import React, { Component } from 'react'
import { Text, View } from 'react-native'
import tabBarIcon from '../services/tabBarIcon'

export class CampingScreen extends Component {
  static navigationOptions = {
    tabBarColor: '#377c9d',
    tabBarIcon: tabBarIcon('terrain')
  };
  render() {
    return (
      <View>
        <Text> CampingScreen </Text>
      </View>
    )
  }
}

export default CampingScreen