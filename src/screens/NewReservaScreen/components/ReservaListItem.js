import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { ListItem,Text,Left,Body,Right,Icon} from 'native-base';
import { Checkbox,Chip } from 'react-native-paper';
import moment from 'moment'
import {utcToLocalDateString} from '../../../services/dateServices'

class ReservaListItem extends PureComponent{
    render(){
    const { item,isSelected,handleCheckedItem,handlePressItem} = this.props;
    const chipBackgroundColor = item.Estado == 0?"#e0e0e0":item.Estado == 1?"#00C853":item.Estado==2?"#EF5350":"#e0e0e0";
    const chipColor = item.Estado == 0?"#000":item.Estado == 1?"#fff":item.Estado==2?"#fff":"#000";
    return (<ListItem 
      noIndent
      onPress={()=>handlePressItem(item)}
      avatar>
        <Left>
          <Checkbox
          status={isSelected}
          onPress={() =>handleCheckedItem(item.Id)} />
        </Left>
        <Body style={{flex : 1}}>
          <Text numberOfLines={1}>{`${item.Cliente.toUpperCase()}`}</Text>
          <Text numberOfLines={1} note>{`${item.Cabana.toUpperCase()}`}</Text>
          <View style={{flexDirection : 'row',alignItems : 'center'}}>
            <Icon name="date-range" type="MaterialIcons" style={{fontSize : 12,color : 'gray'}} />
            <Text numberOfLines={1} style={{fontSize : 11}} note> {`${item.Llegada} | ${item.Salida}`}</Text>
          </View>
        </Body>
        <Right style={{position : 'relative'}}>
          <Text note>{moment(utcToLocalDateString(item.Registro)).format("lll")}</Text>
          <Chip 
            style={{backgroundColor : chipBackgroundColor,
            height : 25,
            position : 'absolute',
            right : 10,
            bottom : 10,
            justifyContent : 'center'}}>
            <Text style={{color : chipColor,fontSize : 10}}>
            {item.Estado == 0?"Pendiente":item.Estado == 1?"Reservado":item.Estado==2?"Anulado":""}
            </Text>
          </Chip>
        </Right>
      </ListItem>)
    }
  }

export default ReservaListItem