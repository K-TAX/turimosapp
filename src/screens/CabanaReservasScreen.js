import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator} from 'react-native'
import { Container, View,Text,} from 'native-base';
import {httpGet} from '../services/servicesHttp'
import {ENDPOINTS} from '../constants'
import _ from 'lodash'
import {enumerateDaysBetweenDates} from '../services/dateServices'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment'



class CabanaReservasScreen extends Component {
  static navigationOptions = {
    title : "Disponibilidad"
  };
  state = {
    isReady : false,
    colors :[],
    reservas : []
  }
  componentWillMount(){
    const {params : cabana} = this.props.navigation.state;
    httpGet(ENDPOINTS.reservas_reservadas,cabana.Id).then(({data : reservas,status})=>{
      if(status === 200){
        this.setState({reservas : this.mapReservas(reservas)},()=>{
          this.setState({isReady : true})
        })
      }
    })
  }
  mapReservas = (reservas)=>{
    const obj = {};
    reservas.forEach(x=>{
      if(x.Salida === x.Llegada){
        obj[x.Llegada] = {startingDay: true,endingDay: true,marked: true, dotColor: 'white', color: '#1e88e5',textColor : 'white'}
      }else{
        obj[x.Llegada] = {startingDay: true,endingDay: false,marked: true, dotColor: 'white', color: '#1e88e5',textColor : 'white'}
        obj[x.Salida] = {startingDay: false,endingDay: true,marked: true, dotColor: 'white', color: '#1e88e5',textColor : 'white'}
      }
      if(x.Salida > x.Llegada){
        let betweenDates = enumerateDaysBetweenDates(x.Llegada,x.Salida);
        betweenDates.forEach(date=>{
          obj[moment(date).format("YYYY-MM-DD").toString()] = {startingDay: false,endingDay: false,marked: true, dotColor: 'white',color: '#1e88e5',textColor : 'white'}
        })
      }
    });
    return obj;
  }
  render() {
    const {reservas,isReady} = this.state;
    return (
      <Container style={styles.root}>
        {isReady ?
        <CalendarList
         markedDates={{...reservas}}
        onVisibleMonthsChange={(months) => {
          // console.log('now these months are visible', months)
        }}
        onDayPress={()=>{}}
        minDate={moment(moment.now()).format("YYYY-MM-DD")}
        pastScrollRange={0}
        futureScrollRange={50}
        scrollEnabled
        markingType={'period'}
        showScrollIndicator
        />
        : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
        ) 
      }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  loading : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  }
})
export default CabanaReservasScreen