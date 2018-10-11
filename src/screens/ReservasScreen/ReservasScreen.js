import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList} from 'react-native'
import { Container,Toast } from 'native-base';
import tabBarIcon from '../../services/tabBarIcon'
import _ from 'lodash'
import {connect} from 'react-redux'
import {fetchReservasAdmin,fetchReservasAdminCampings,limpiarReservasAnuladas} from '../../redux/actions/reservas'
import ReservaListItem from './components/ReservaListItem'
import ReservaToolbar from './components/ReservaToolbar'

class ReservasScreen extends Component {
  static navigationOptions = {
    title : "Reservas",
    tabBarColor: '#004d40',
    tabBarIcon: tabBarIcon('date-range')
  }
  state = {
    isReady : false,
    filter : 0
  }
  async componentDidMount(){
    await this.props.fetchReservasAdmin();
    await this.props.fetchReservasAdminCampings();
    this.setState({isReady : true})
  }
  handlePressItem = (details)=>{
    const {filter} = this.state;
    let isCamping = !!(filter === 1)
    this.props.navigation.navigate("ReservasDetailScreen",{details,isCamping })
  }
  _renderItem = ({item,index})=>{
    return (
      <ReservaListItem 
      item={item} 
      handlePressItem={this.handlePressItem}
       />
    )
  }
  handleChangeFilter = (filter)=>{
    this.setState({filter})
  }
  handleUpdateReservas = async ()=>{
    await this.props.fetchReservasAdmin();
    await this.props.fetchReservasAdminCampings();
    Toast.show({
      type : "success",
      text : "Reservas Actualizadas.",
      position : "top",
      duration : 2000
    })
  }
  handleCleanReservasAnuladas = ()=>{
    this.props.limpiarReservasAnuladas(this.state.filter);
  }
  render() {
    const {reservas_admin,reservas_admin_campings} = this.props;
    const {isReady,filter} = this.state;
    return (
    <Container 
      style={styles.root}>
      {isReady ? 
      <View style={styles.container}>
        <ReservaToolbar
        filter={filter}
        handleChangeFilter={this.handleChangeFilter}
        handleUpdateReservas={this.handleUpdateReservas}
        handleCleanReservasAnuladas={this.handleCleanReservasAnuladas}
        />
        <FlatList 
          data={filter === 0 ? reservas_admin : reservas_admin_campings}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.Id.toString()}
        /> 
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
  limpiarReservasAnuladas  :  (isCamping)=>dispatch(limpiarReservasAnuladas(isCamping))
 })

export default connect(mapStateToProps,mapDispatchToProps)(ReservasScreen)

