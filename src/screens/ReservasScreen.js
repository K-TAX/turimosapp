import React, { Component } from 'react'
import { StyleSheet,Dimensions,View,ActivityIndicator} from 'react-native'
import { Container,Text,Left,Body,Right} from 'native-base';
import { Checkbox,Chip } from 'react-native-paper';
import tabBarIcon from '../services/tabBarIcon'
import _ from 'lodash'
import {connect} from 'react-redux'
import ListPagination from '../components/ListPagination'
import {fetchReservasAdmin} from '../redux/actions/reservas'
import {ListItem} from 'native-base'
import moment from 'moment'

const reservaItemHeight = 57;

class ReservasScreen extends Component {
  static navigationOptions = {
    title : "Reservas",
    tabBarColor: '#004d40',
    tabBarIcon: tabBarIcon('date-range')
  }
  state = {
    selected : [],
    rootDimension : 0,
    itemDimension : {},
    rowsPerPage : 4,
    isReady : false
  }
  async componentDidMount(){
    await this.props.fetchReservasAdmin();
    setTimeout(()=>{
      this.setState({isReady : true})
    },1000)
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
  findRootDimension(layout){
    const {height} = layout;
    this.setState({rootDimension : {height}})
  }
  render() {
    const {reservas_admin} = this.props;
    const {rootDimension,isReady} = this.state;
    const rowsPerPage =  rootDimension.height / 75;
    return (
    <Container 
    onLayout={(event) => { this.findRootDimension(event.nativeEvent.layout) }} 
    style={styles.root}>
      {isReady ? 
      <ListPagination 
        data={rowsPerPage > 0 ?reservas_admin : []}
        rowsPerPage={rowsPerPage}
        parentState={this.state}
        renderItem={({item,index})=>{
          const isSelected = this.isSelected(item.Id);
          const chipBackgroundColor = item.Estado == 0?"#e0e0e0":item.Estado == 1?"#00C853":item.Estado==2?"#EF5350":"#e0e0e0";
          const chipColor = item.Estado == 0?"#000":item.Estado == 1?"#fff":item.Estado==2?"#fff":"#000";
          return (
          <ListItem 
          noIndent
          avatar>
            <Left>
              <Checkbox
              status={isSelected}
              onPress={() =>this.handleCheckedItem(item.Id)} />
            </Left>
            <Body style={{flex : 1}}>
              <Text numberOfLines={1}>{item.Cliente.toUpperCase()}</Text>
              <Text numberOfLines={1} style={{fontSize : 11}} note>
              {`${item.Llegada} | ${item.Salida}`}
              </Text>
            </Body>
            <Right style={{position : 'relative'}}>
              <Text note>{moment(item.Registro).format("lll")}</Text>
              <Chip 
                style={{backgroundColor : chipBackgroundColor,
                height : 25,
                position : 'absolute',
                right : 10,
                bottom : 5,
                justifyContent : 'center'}}>
                <Text style={{color : chipColor,fontSize : 10}}>
                {item.Estado == 0?"Pendiente":item.Estado == 1?"Reservado":item.Estado==2?"Anulado":""}
                </Text>
              </Chip>
            </Right>
          </ListItem>)
        }}
      /> :
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
      }
    </Container>
    )
  }
}

const styles = StyleSheet.create({
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
  fetchReservasAdmin  :  ()=>dispatch(fetchReservasAdmin())
})

export default connect(mapStateToProps,mapDispatchToProps)(ReservasScreen)

