import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator } from 'react-native'
import tabBarIcon from '../../services/tabBarIcon'
import {Container} from 'native-base';
import {connect} from 'react-redux'
import {fetchCabanas} from '../../redux/actions/cabanas'
import {fetchAndMakeReservasPeriods} from '../../redux/actions/reservas'
import _ from 'lodash'
import AllCabanas from "./components/AllCabanas";


export class HomeScreen extends Component {
  static navigationOptions = {
    title : "Cabañas",
    tabBarColor: '#1c313a',
    tabBarIcon: tabBarIcon('home')
  };
  state = {
    tab : 0,
    isReady : false,
    colors : {alerces : "#bf360c",arrayanes : "#005662",casona : "#00c853"}
  }
  async componentDidMount(){
    await this.props.fetchCabanas()
    await this.props.fetchAndMakeReservasPeriods()
    this.setState({isReady : true});
  }
  onChangeTab = ({from,i})=>{
    this.setState({tab : i})
  }
  render() {
    const {isReady,colors} = this.state;
    const {cabanas,reservasPeriods} = this.props;
    return (
      <Container style={styles.root}>
       {isReady ? (
        <AllCabanas 
        navigation={this.props.navigation}
        reservasPeriods={reservasPeriods}
        cabanas={cabanas}
        colors={colors} />) : (
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
  cabanas  : state.cabanas.cabanas,
  reservasPeriods : state.reservas.reservasPeriods
})
const mapDispatchToProps = dispatch => ({
  fetchCabanas : ()=>dispatch(fetchCabanas()),
  fetchAndMakeReservasPeriods : ()=>dispatch(fetchAndMakeReservasPeriods())
})
export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen)

  