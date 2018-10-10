import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList,Alert} from 'react-native'
import { Container,Toast } from 'native-base';
import _ from 'lodash'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'
import AbonosListItem from './components/AbonosListItem'
import {deleteTempAbono,deleteAbono} from '../../redux/actions/abonos'
import moment from 'moment'

class AbonosScreen extends Component {
  static navigationOptions = {
    title : "Abonos"
  }
  state = {
    isReady : false
  }
  componentDidMount(){
    setTimeout(()=>{
      this.setState({isReady : true})
    },200)
  }

  handleDeleteAbono = async (abonoId)=>{
    const {isTemp , reservaId} = this.props.navigation.state.params;
    if(!isTemp){
      Alert.alert(
        'Eliminar Abono',
        '¿Desea eliminar el abono seleccionado?',
        [
          {text: 'Cancelar', style: 'cancel'},
          {text: 'Sí',color : 'red', onPress: async () => {
              await this.props.deleteAbono(abonoId,reservaId);
              if(this.props.abonos[reservaId].data.length === 0){
                this.props.navigation.dispatch(NavigationActions.back())
              }
            }
          },
        ],
        { cancelable: true }
      )
    }else{
      await this.props.deleteTempAbono(abonoId);
      if(this.props.tempAbonos.abonos.length === 0){
        this.props.navigation.dispatch(NavigationActions.back())
      }
    }
  }
  _renderItem = ({item,index})=>{
    return (
      <AbonosListItem 
      item={item} 
      handleDeleteAbono={this.handleDeleteAbono}
       />
    )
  }
  render() {
    const {isReady} = this.state;
    const {isTemp , reservaId} = this.props.navigation.state.params;
    const {tempAbonos} = this.props;
    const abonos = !isTemp ? this.props.abonos[reservaId].data : 
      tempAbonos.abonos.map((x,i)=>({Id : i,Monto : x,Fecha : moment(moment.now())})).reverse()
    return (
    <Container 
      style={styles.root}>
      {isReady ? 
      <View style={styles.container}>
        {/* <AbonosToolbar /> */}
        <FlatList 
          data={abonos}
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
  accessToken : state.auth.accessToken,
  abonos : state.abonos.abonos,
  tempAbonos : state.abonos.tempAbonos
})
const mapDispatchToProps = dispatch => ({
  deleteAbono : (abonoId,reservaId)=>dispatch(deleteAbono(abonoId,reservaId)),
  deleteTempAbono : (abonoIndex)=>dispatch(deleteTempAbono(abonoIndex)),
})

export default connect(mapStateToProps,mapDispatchToProps)(AbonosScreen)

