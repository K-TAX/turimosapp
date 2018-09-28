import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator,Dimensions } from 'react-native'
import tabBarIcon from '../../services/tabBarIcon'
import { 
  Container,
  Tab,
  ScrollableTab,
  Tabs  } from 'native-base';
import moment from 'moment'
import {connect} from 'react-redux'
import {fetchCabanas} from '../../redux/actions/cabanas'
import {ENDPOINTS} from '../../constants'
import {enumerateDaysBetweenDates} from '../../services/dateServices'
import {httpGet} from '../../services/servicesHttp'
import _ from 'lodash'
import AllCabanas from "./components/AllCabanas";
import MultiCalendar from "./components/MultiCalendar";

// const {height : heightScreen} = Dimensions.get("window")

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
    tab : 0,
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
  onChangeTab = ({from,i})=>{
    this.setState({tab : i})
  }
  render() {
    const {tab,isReady,allReservas,colors} = this.state;
    const {cabanas} = this.props;
    let tabs = [];
    if(isReady){
      tabs.push(
      <Tab
      activeTabStyle={{backgroundColor : '#1c313a'}}
      activeTextStyle={{color : 'white'}}
      tabStyle={{backgroundColor : 'white'}} 
      textStyle={{color : "black"}}
      key={"todas"} 
      heading="TODAS">
        <AllCabanas allReservas={allReservas} cabanas={cabanas} colors={colors} />
      </Tab>)
      tabs.push(...cabanas.map(cabana=>{
        const {Id} = cabana;
        return (
        <Tab 
        activeTabStyle={{backgroundColor : '#1c313a'}}
        activeTextStyle={{color : 'white'}}
        tabStyle={{backgroundColor : 'white'}} 
        textStyle={{color : "black"}}  
        key={Id} 
        heading={cabana.Id.toUpperCase()}>
            {Id === "alerces" && <MultiCalendar />}
            {Id === "arrayanes" && <MultiCalendar />}
            {Id === "casona" && <MultiCalendar />}
        </Tab>
      )}))
    }
    return (
      <Container style={styles.root}>
       {isReady ? (
       <Tabs 
       onChangeTab={this.onChangeTab}
       locked
       tabBarUnderlineStyle={{backgroundColor : 'gray'}}
       renderTabBar={()=> <ScrollableTab />}>
        {tabs}
       </Tabs> ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
        )}
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  root : {
    position : 'relative',
    flex : 1
  },
  loading : {
    flex: 1,
    justifyContent : 'center',
    alignItems : 'center'
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

  