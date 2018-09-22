import React, { Component } from 'react'
import { Text, View } from 'react-native'
import tabBarIcon from '../services/tabBarIcon'
import DateRangePicker from '../components/DateRangePicker'

export class CampingScreen extends Component {
  static navigationOptions = {
    tabBarColor: '#377c9d',
    tabBarIcon: tabBarIcon('terrain')
  };
  render() {
    return (
      <View>
         <DateRangePicker
          initialRange={['2018-04-01', '2018-04-10']}
          onSuccess={(s, e) => alert(s + '||' + e)}
          theme={{ markColor: 'red', markTextColor: 'white' }}/>
      </View>
    )
  }
}

export default CampingScreen