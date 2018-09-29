import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { ListItem,Text,Left,Body,Right,Icon} from 'native-base';
import moment from 'moment'
import {numberToClp} from 'chilean-formatter'
import {utcToLocalDateString} from '../../../services/dateServices'

class AbonosListItem extends PureComponent{
    render(){
    const { item,handleDeleteAbono} = this.props;
    return (<ListItem 
      noIndent
      avatar>
        <Left style={{alignItems : 'center',justifyContent : 'center'}}>
          <Icon name="ios-cash-outline" type="Ionicons" />
        </Left>
        <Body style={{flex : 1}}>
          <Text numberOfLines={1}>{`${numberToClp(item.Monto)}`}</Text>
          <Text note>{moment(utcToLocalDateString(item.Fecha)).format("lll")}</Text>
        </Body>
        <Right style={{alignItems : 'center',justifyContent : 'center'}}>
          <Icon onPress={()=>handleDeleteAbono(item.Id)} name="delete" type="MaterialIcons" />
        </Right>
      </ListItem>)
    }
  }

export default AbonosListItem