import React, { Component } from 'react'
import {View,Dimensions,StyleSheet,ScrollView,TouchableOpacity } from 'react-native'
import {Text,Thumbnail,Icon,Separator} from 'native-base'
import {Title,Appbar} from 'react-native-paper'
import moment from 'moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import {SERVER} from '../../../constants'
import { Table,TableWrapper, Rows,Row,Col,Cols,Cell } from 'react-native-table-component';

const {width : widthScreen,height : heightScreen} = Dimensions.get("window")

const validKeys = 
["Cliente:Cliente","Registro:Fecha de Solicitud","Email:Email",
"Telefono:Telefono","Llegada:Llegada","Salida:Salida","Mensaje:Mensaje"]

const CustomCell = ({detail}) => (
    <View style={{flexDirection : 'row',flex : 1}}>
      {detail.map((val,i)=>(
        <View key={i} style={[{flex : i === 0 ? .4 : 0.6},val === "Mensaje" && {flex : 1} ]}>
          <Text 
          style={[i === 0 ? {color : 'blue',textAlign : val === "Mensaje" ? "center" : "center"} 
          : {textAlign : 'center'}
          ,val === "Mensaje" ? {marginTop : 10} : {marginLeft : 10,fontSize : 12}]} 
          >
          {val}
          </Text>
        </View>
      ))}
    </View> 
)

export class ReservaDetail extends Component {
  render() {
    const {details} = this.props;
    const chipBackgroundColor = details.Estado == 0?"#e0e0e0":details.Estado == 1?"#00C853":details.Estado==2?"#EF5350":"#e0e0e0";
    const chipColor = details.Estado == 0?"#000":details.Estado == 1?"#fff":details.Estado==2?"#fff":"#000";
    const cabana = _.find(this.props.cabanas,c=>c.Id === details.Cabana);
    let keys = Object.keys(details);
    let newKeys = [];
    validKeys.forEach(x=>{
      const splitKeys = x.split(":");
      const key = splitKeys[0];
      const alias = splitKeys[1];
      if(_.isMatch(keys,k=>k==key)){
        if(key === "Mensaje"){
          newKeys.push(...[{ key : alias , value : ''},{key : details[key] , value : ''}])
        }else
        newKeys.push({ key : alias , value : details[key]})
      }
    })
    const dataDetails = newKeys.map(item=>{
      let row = item.value ? [item.key,item.value] : [item.key]; 
      return row;
    })
    return (
      <View style={styles.root}>
        <Appbar style={styles.appbar}>
          <Title>Detalles Reserva</Title>
        </Appbar>
        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.topTitle}>
              <Thumbnail small source={{uri : `${SERVER.server}/${cabana.Main}`}} />
              <Text  style={{marginLeft : 15}}>{cabana.Nombre}</Text>
            </View>
            <Icon name="delete" type="MaterialIcons" />
          </View>
          <ScrollView>
            <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
              <TableWrapper>
                {dataDetails.map((detail,i)=>(
                dataDetails.length -1 === i ?
                (<Row key={i} data={detail} 
                  textStyle={styles.messageText}
                  style={styles.messageRow} />) :
                (<Cell 
                  key={i} 
                  textStyle={[styles.tableText]}
                  data={<CustomCell detail={detail} />}
                  />)
                ))}
              </TableWrapper>
            </Table>
          </ScrollView>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  root : { 
    width: widthScreen - widthScreen * 0.08, 
    height: heightScreen * 0.6
  },
  appbar : {
    width : '100%',
    backgroundColor : 'white',
    paddingHorizontal : 15
  },
  content : {
    flex : 1
  },
  top : {
    padding : 10,
    width : '100%',
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },
  topTitle : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  tableText : {
    textAlign : 'left'
  },
  tableTextTitle : {
    textAlign : 'left'
  },
  messageText : {
    textAlign : 'left',
    marginHorizontal : 10
  },
  messageRow : {
    minHeight : heightScreen * 0.20,
    alignItems : 'flex-start'
  }
})

const mapStateToProps = state => ({
  cabanas : state.cabanas.cabanas
})
export default connect(mapStateToProps)(ReservaDetail)