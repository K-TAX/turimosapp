import React, { Component } from 'react'
import { StyleSheet,Image,ActivityIndicator,View } from 'react-native'
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import tabBarIcon from '../services/tabBarIcon'
import SwipeableParallaxCarousel from 'react-native-swipeable-parallax-carousel';
import { Table, Rows } from 'react-native-table-component';
import {SERVER} from '../constants'
import _ from 'lodash'

// CabanaDetailScreen : {
//   screen : CabanaDetailScreen,
//   navigationOptions : {
//     headerStyle: { 
//       position: 'absolute',
//       marginTop : Platform.OS === "android" ?  -Expo.Constants.statusBarHeight : 0,
//       backgroundColor: 'transparent',
//       zIndex: 100,
//       top: 0,
//       left: 0,
//       right: 0 
//     }
//   }

class CabanaDetailScreen extends Component {
  state = {
    cabana : null
  }
  componentWillMount(){
    const {params : cabana} = this.props.navigation.state;
    this.setState({cabana})
  }
  render() {
    const {Foto1,Foto2,Foto3,Foto4,Detalles} = this.state.cabana;
    const datacarousel = [Foto1,Foto2,Foto3,Foto4].map((x,i)=>({id : i,imagePath : `${SERVER.server}/${x}`}))
    const detalles = Detalles.map(item=>{
      let row = [item.Nombre]; 
      return row;
    })
    return (
      <Container style={styles.root}>
         <SwipeableParallaxCarousel data={datacarousel} />
         <Content>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Rows data={detalles} textStyle={styles.tableText}/>
            </Table>
         </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  tableText: { 
    margin: 6,
    fontSize : 20,
    textAlign : 'center'
   }
})
export default CabanaDetailScreen