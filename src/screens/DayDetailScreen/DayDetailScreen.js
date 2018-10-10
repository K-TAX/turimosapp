import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList} from 'react-native'
import { Container,Toast,Text } from 'native-base';
import _ from 'lodash'
import {connect} from 'react-redux'
import {fetchReservasAdmin,limpiarReservasAnuladas,fetchReservasAdminCampings} from '../../redux/actions/reservas'
import ReservaListItem from './components/ReservaListItem'
import moment from 'moment'
import {enumerateDaysBetweenDates} from '../../services/dateServices'

class DayDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
      title: `Reservas ${moment(navigation.state.params.day).format("L")}`
  });
  state = {
    isReady : false,
    isCamping : false,
    reservas : []
  }
  async componentWillMount(){
    const {day ,isCamping} = this.props.navigation.state.params;
    const {reservas_admin : prev_reservas_admin,reservas_admin_campings : prev_reservas_admin_campings} = this.props;
    if(!prev_reservas_admin_campings){
      await this.props.fetchReservasAdminCampings();
    }
    if(!prev_reservas_admin){
      await this.props.fetchReservasAdmin();
    }
    await this.loadAllReservas(day,isCamping);
    this.setState({isReady : true,isCamping})
  }
  loadAllReservas = async (day,isCamping)=>{
    let {reservas_admin,reservas_admin_campings} = this.props;
    let reservas = await this.matchReservas(day,isCamping ? reservas_admin_campings : reservas_admin);
    this.setState({
      reservas 
    })
  }
  matchReservas = async (day,reservas_admin)=>{
    return new Promise(resolve=>{
      let result = _.filter(reservas_admin,(reserva=>{
            let days = [
              reserva.Llegada,
              ...enumerateDaysBetweenDates(reserva.Llegada,reserva.Salida)
            ].map(x=>moment(x).format("YYYY-MM-DD").toString());
            return !!(_.find(days,d=>d === day))
        }))
        resolve(result)
    })
  }
  handlePressItem = (details)=>{
    const {isCamping} = this.state;
    this.props.navigation.navigate("ReservasDetailScreen",{details,isCamping,refreshPrevScreen : this.loadAllReservas})
  }
  _renderItem = ({item,index})=>{
    return (
      <ReservaListItem 
      item={item} 
      handlePressItem={this.handlePressItem}
       />
    )
  }
  handleUpdateReservas = async ()=>{
    await this.props.fetchReservasAdmin();
    Toast.show({
      type : "success",
      text : "Reservas Actualizadas.",
      position : "top",
      duration : 2000
    })
  }
  handleCleanReservasAnuladas = ()=>{
     this.props.limpiarReservasAnuladas();
  }
  render() {
    const {isReady,reservas} = this.state;
    return (
    <Container 
      style={styles.root}>
      {isReady ? 
      <View style={[styles.container,!reservas.length  && {justifyContent : 'center',
      alignItems : 'center'}]}>
        {reservas.length ?
        <FlatList 
          data={reservas}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.Id.toString()}
        /> :
        <Text style={{textAlign : 'center'}} numberOfLines={2}>
        {`No existen reservas confirmadas para la fecha seleccionada ${moment(this.props.navigation.state.params.day).format("L")}`}
        </Text>
        }
      </View>
      :
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
      }
    </Container>
    )
  }
}

const styles = StyleSheet.create({
  root : {
    flex : 1
  },
  container : {
    flex : 1
  },
  loading : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  }
})

const mapStateToProps = state => ({
  reservas_admin  : state.reservas.reservas_admin,
  reservas_admin_campings  : state.reservas.reservas_admin_campings
})
const mapDispatchToProps = dispatch => ({
  fetchReservasAdmin  :  ()=>dispatch(fetchReservasAdmin()),
  fetchReservasAdminCampings  :  ()=>dispatch(fetchReservasAdminCampings()),
  limpiarReservasAnuladas  :  ()=>dispatch(limpiarReservasAnuladas())
 })

export default connect(mapStateToProps,mapDispatchToProps)(DayDetailScreen)

