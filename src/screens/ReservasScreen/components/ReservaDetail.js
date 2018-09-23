import React, { Component } from 'react'
import { Text, View,Dimensions,StyleSheet } from 'react-native'

const {width : widthScreen,height : heightScreen} = Dimensions.get("window")

export class ReservaDetail extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Text> Aqui van los detalles </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  root : { 
    width: widthScreen - widthScreen * 0.08, 
    height: heightScreen * 0.50
  }
})
export default ReservaDetail