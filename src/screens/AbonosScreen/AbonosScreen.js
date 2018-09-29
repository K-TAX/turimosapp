import React, { Component } from 'react'
import { StyleSheet,View,ActivityIndicator,FlatList} from 'react-native'
import { Container,Toast } from 'native-base';
import _ from 'lodash'
import {connect} from 'react-redux'
import AbonosListItem from './components/AbonosListItem'
import AbonosToolbar from './components/AbonosToolbar'
import {ENDPOINTS} from '../../constants'
import {httpGet} from '../../services/servicesHttp'
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
    alert(abonoId)
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
    const {params : abonos} = this.props.navigation.state;
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
  accessToken : state.auth.accessToken
})

export default connect(mapStateToProps)(AbonosScreen)

