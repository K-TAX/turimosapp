import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator,Dimensions } from 'react-native'
import tabBarIcon from '../services/tabBarIcon'
import { Container,Thumbnail, List, ListItem, Body,Left, Right,Text,Icon,Row,Col,Separator  } from 'native-base';
import {CalendarList } from 'react-native-calendars'
import moment from 'moment'
import {connect} from 'react-redux'
import {fetchCabanas} from '../redux/actions/cabanas'
import {SERVER, ENDPOINTS} from '../constants'
import {enumerateDaysBetweenDates} from '../services/dateServices'
import {httpGet} from '../services/servicesHttp'
import _ from 'lodash'

const {height : heightScreen} = Dimensions.get("window")

async function getReservasFromCabanas(cabanaId,reservasRef){
  return await new Promise(resolve=>{
    httpGet(ENDPOINTS.reservas_reservadas,cabanaId).then(({data,status})=>{
      if(status === 200){
        reservasRef.reservas.push(...data);
        resolve();
      }
    })
  })
}

export class HomeScreen extends Component {
  static navigationOptions = {
    tabBarColor: '#1c313a',
    tabBarIcon: tabBarIcon('apps')
  };
  state = {
    isReady : false,
    allReservas : [],
    colors : {alerces : "#bf360c",arrayanes : "#005662",casona : "#00c853"}
  }
  async componentDidMount(){
    await this.props.fetchCabanas()
    const {cabanas} = this.props;
    if(cabanas.length > 0){
      let reservasRef = { reservas : []};
      let promises = []
      cabanas.forEach(cabana=>{
        promises.push(getReservasFromCabanas(cabana.Id,reservasRef))
      })
      await Promise.all(promises)
      this.setState({allReservas : this.mapReservas(reservasRef.reservas)},()=>{
        setTimeout(()=>{
          this.setState({isReady : true});
        },1000)
      })
    }
    setTimeout(()=>{
      this.props.navigation.navigate("ModalScreen")
    },2000)
  }
  mapReservas = (allReservas)=>{
    const obj = {};
    const {colors} = this.state;
    allReservas.forEach(reserva=>{
      let index = reserva.Cabana === "alerces" ? 0 :reserva.Cabana === "arrayanes" ? 1 : 2;
      if(typeof obj[reserva.Llegada] !== "object"){
        obj[reserva.Llegada] = {};
      }
      if(typeof obj[reserva.Salida] !== "object"){
        obj[reserva.Salida] = {};
      }
      if(!Array.isArray(obj[reserva.Llegada].periods)){
        obj[reserva.Llegada].periods = [
          { color: 'transparent' },
          { color: 'transparent' },
          { color: 'transparent' }
        ]
      }
      if(!Array.isArray(obj[reserva.Salida].periods)){
        obj[reserva.Salida].periods = [
          { color: 'transparent' },
          { color: 'transparent' },
          { color: 'transparent' }
        ]
      }
      if(reserva.Salida === reserva.Llegada){
        obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: true, color: colors[reserva.Cabana]}
      }else{
        obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: false,color: colors[reserva.Cabana]}
        obj[reserva.Salida].periods[index] = {startingDay: false,endingDay: true,color: colors[reserva.Cabana]}
      }
      if(reserva.Salida > reserva.Llegada){
        let betweenDates = enumerateDaysBetweenDates(reserva.Llegada,reserva.Salida);
        betweenDates.forEach(date=>{
          let strDate = moment(date).format("YYYY-MM-DD").toString();
          if(typeof obj[strDate] !== "object"){
            obj[strDate] = {};
          }
          if(!Array.isArray(obj[strDate].periods)){
            obj[strDate].periods = [
              { color: 'transparent' },
              { color: 'transparent' },
              { color: 'transparent' }
            ]
          }
          obj[strDate].periods[index] = {startingDay: false,endingDay: false,color: colors[reserva.Cabana]}
        })
      }
    })
    return obj;
  }
  
  render() {
    const {isReady,allReservas,colors} = this.state;
    const {cabanas} = this.props;
    return (
      <Container style={styles.root}>
        {isReady ?
          <View style={{flex : 1}}>
            <View style={styles.calendarContainer}>
              <CalendarList
              onDayPress={(day)=>alert(JSON.stringify(day))}
              horizontal
              pastScrollRange={0}
              futureScrollRange={50}
              calendarHeight={heightScreen * 0.80}
              minDate={moment(moment.now()).format("YYYY-MM-DD")}
              pagingEnabled
              markingType='multi-period'
              showScrollIndicator
              markedDates={{
                ...allReservas
              }}
              />
            </View>
            <View style={styles.listContainer}>
            <Separator style={{maxHeight : 1}} />
              <Row>
                {_.chunk(cabanas,2).map((item,i)=>(
                <Col style={{}} key={i}>
                  <List>
                    {item.map(cabana=>(
                      <ListItem 
                        button 
                        avatar
                        noBorder
                        key={cabana.Id} 
                        onPress={()=>this.props.navigation.navigate("CabanaReservasScreen",cabana)}
                        style={styles.listItem}
                        >
                        <Left style={{position : 'relative'}}>
                          <Thumbnail 
                          style={{width : 30,height : 30,position : 'absolute',top : 6}} 
                          source={{uri: `${SERVER.server}/${cabana.Main}`}} />
                        </Left>
                        <Body>
                          <Text style={{fontSize : 10,marginLeft : 18}}>{cabana.Nombre}</Text>
                        </Body>
                        <Right style={{justifyContent : 'center'}}>
                          <Icon name="invert-colors" type="MaterialIcons" 
                          style={{color : colors[cabana.Id],fontSize : 15}}/>
                        </Right>
                      </ListItem>
                    ))}
                  </List> 
                </Col>
                ))}
              </Row>
            </View>
          </View>
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
  root : {
    position : 'relative',
    flex : 1,
    minHeight : heightScreen 
  },
  loading : {
    minHeight : heightScreen - heightScreen * 0.20,
    justifyContent : 'center',
    alignItems : 'center'
  },
  calendarContainer : {
   flex : 1,
  },
  listContainer : {
    justifyContent : 'flex-end',
    position : 'absolute',
    bottom : 55,
    left : 0,
    right : 0,
    height : heightScreen * 0.25
  },
  listItem : {
    maxHeight : 40
  }
})
const mapStateToProps = state => ({
  cabanas  : state.cabanas.cabanas
})
const mapDispatchToProps = dispatch => ({
  fetchCabanas : ()=>dispatch(fetchCabanas())
})
export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen)
