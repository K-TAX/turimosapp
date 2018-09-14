import React, { Component } from 'react'
import { Text, View } from 'react-native'
import tabBarIcon from '../services/tabBarIcon'

class CabanasScreen extends Component {
  static navigationOptions = {
    title : "Cabañas",
    tabBarColor: 'teal',
    tabBarIcon: tabBarIcon('home')
  };
  render() {
    return (
      <View>
        <Text> CabanasScreen </Text>
      </View>
    )
  }
}

export default CabanasScreen