import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList,Alert} from 'react-native'
import { Container,Toast } from 'native-base';
import _ from 'lodash'
import {NavigationActions} from 'react-navigation'
import {connect} from 'react-redux'
import AbonosListItem from './components/AbonosListItem'
import {deleteAbono} from '../../redux/actions/abonos'

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

  handleDeleteAbono = (abonoId)=>{
    const {params : reservaId} = this.props.navigation.state;
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
    const {params : reservaId} = this.props.navigation.state;
    const abonos = this.props.abonos[reservaId].data;
    return (
    <Container 
      style={styles.root}>
      {isReady ? 
      <View style={styles.container}>
        {/* <AbonosToolbar /> */}
        <FlatList 
          data={abonos}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.Id}
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
  abonos : state.abonos.abonos
})
const mapDispatchToProps = dispatch => ({
  deleteAbono : (abonoId,reservaId)=>dispatch(deleteAbono(abonoId,reservaId))
})

export default connect(mapStateToProps,mapDispatchToProps)(AbonosScreen)

