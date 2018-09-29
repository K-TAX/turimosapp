import React, { Component } from 'react'
import { StyleSheet,View,TouchableOpacity,Alert } from 'react-native'
import { Appbar } from 'react-native-paper';
import {Icon,Right,Picker, Left} from 'native-base'

export class AbonosToolbar extends Component {
    render() {
    return (
    <Appbar style={styles.appbar}>
        <Left>

        </Left>
        <Right>
           
        </Right>
    </Appbar>
    )
  }
}

const styles = StyleSheet.create({
    appbar : {
        backgroundColor : 'white',
        paddingHorizontal : 15
    },
    iconsContainer : {
        flexDirection : 'row'
    },
    icon : {
        paddingLeft : 20,
        color : '#282828'
    }
})
export default AbonosToolbar