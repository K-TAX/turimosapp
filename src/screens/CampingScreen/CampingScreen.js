import React, { Component } from 'react'
import { StyleSheet, View,ActivityIndicator } from 'react-native'
import tabBarIcon from '../../services/tabBarIcon'
import {Container} from 'native-base';
import {connect} from 'react-redux'
import {fetchCampings} from '../../redux/actions/campings'
import {fetchAndMakeReservasPeriodsCampings} from '../../redux/actions/reservas'
import _ from 'lodash'
import AllCamping from "./components/AllCamping";


export class CampingScreen extends Component {
  static navigationOptions = {
    tabBarColor: '#377c9d',
    tabBarIcon: tabBarIcon('terrain')
  };
  state = {
    tab : 0,
    isReady : false,
    colors : {camping1 : "#bf360c",camping2 : "#005662",camping3 : "#00c853",camping4 : "#ffd600",camping5 : "#8e24aa",camping6 : "#1b5e20"}
  }
  async componentDidMount(){
    await this.props.fetchCampings()
    await this.props.fetchAndMakeReservasPeriodsCampings()
    this.setState({isReady : true});
  }
  render() {
    const {isReady,colors} = this.state;
    const {campings,reservasPeriodsCampings} = this.props;
    return (
      <Container style={styles.root}>
       {isReady ? (
        <AllCamping 
        navigation={this.props.navigation}
        reservasPeriods={reservasPeriodsCampings}
        campings={campings}
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
  campings  : state.campings.campings,
  reservasPeriodsCampings : state.reservas.reservasPeriodsCampings
})
const mapDispatchToProps = dispatch => ({
  fetchCampings : ()=>dispatch(fetchCampings()),
  fetchAndMakeReservasPeriodsCampings : ()=>dispatch(fetchAndMakeReservasPeriodsCampings())
})
export default connect(mapStateToProps,mapDispatchToProps)(CampingScreen)

  