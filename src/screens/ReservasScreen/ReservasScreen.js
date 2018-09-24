import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList} from 'react-native'
import { Container,Toast } from 'native-base';
import tabBarIcon from '../../services/tabBarIcon'
import _ from 'lodash'
import {connect} from 'react-redux'
import {fetchReservasAdmin,limpiarReservasAnuladas,cambioEstadoReserva} from '../../redux/actions/reservas'
import ModalWrapper from 'react-native-modal-wrapper';
import ReservaListItem from './components/ReservaListItem'
import ReservaDetail from './components/ReservaDetail'
import ReservaToolbar from './components/ReservaToolbar'

class ReservasScreen extends Component {
  static navigationOptions = {
    title : "Reservas",
    tabBarColor: '#004d40',
    tabBarIcon: tabBarIcon('date-range')
  }
  state = {
    selected : [],
    isReady : false,
    isOpenModal : false,
    details : {},
    filter : null
  }
  async componentDidMount(){
    await this.props.fetchReservasAdmin();
    this.setState({isReady : true})
  }
  handleCheckedItem = (id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected });
  }
  isSelected = id => {
    return (this.state.selected.indexOf(id) !== -1) ? "checked" : "unchecked"
  }
  openModal = (details)=>{
    this.setState({ isOpenModal : true,details})
  }
  closeModal = ()=>{
    this.setState({ isOpenModal : false})
  }
  _renderItem = ({item,index})=>{
    const isSelected = this.isSelected(item.Id);
    return (
      <ReservaListItem 
      item={item} 
      openModal={this.openModal}
      isSelected={isSelected}
      handleCheckedItem={this.handleCheckedItem}
       />
    )
  }
  handleChangeFilter = (filter)=>{
    this.setState({filter})
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
  handleCambioEstadoReserva = async (estado)=>{
    const {selected} = this.state;
     await this.props.cambioEstadoReserva(selected,estado);
     this.setState({selected : []})
  }
  render() {
    const {reservas_admin} = this.props;
    const {selected,isReady,isOpenModal,filter,details} = this.state;
    return (
    <Container 
      style={styles.root}>
      {isReady ? 
      <View style={styles.container}>
        <ReservaToolbar
        filter={filter}
        selected={selected}
        handleChangeFilter={this.handleChangeFilter}
        handleUpdateReservas={this.handleUpdateReservas}
        handleCleanReservasAnuladas={this.handleCleanReservasAnuladas}
        handleCambioEstadoReserva={this.handleCambioEstadoReserva}
        />
        <FlatList 
          data={filter === null ? reservas_admin : _.filter(reservas_admin,x=>x.Estado === filter.toString())}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.Id}
        /> 
      </View>
      :
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
      }
      <ModalWrapper
      onRequestClose={this.closeModal}
      visible={isOpenModal}>
        <ReservaDetail details={details} />
      </ModalWrapper>
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
  reservas_admin  : state.reservas.reservas_admin
})
const mapDispatchToProps = dispatch => ({
  fetchReservasAdmin  :  ()=>dispatch(fetchReservasAdmin()),
  limpiarReservasAnuladas  :  ()=>dispatch(limpiarReservasAnuladas()),
  cambioEstadoReserva : (selected,estado)=>dispatch(cambioEstadoReserva(selected,estado))
})

export default connect(mapStateToProps,mapDispatchToProps)(ReservasScreen)

