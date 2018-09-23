import React, { Component } from 'react'
import { StyleSheet,View,TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper';
import {Icon,Left,Body,Right,Picker} from 'native-base'

export class ReservaToolbar extends Component {
    render() {
    const {selected,filter,handleChangeFilter} = this.props;
    return (
    <Appbar style={styles.appbar}>
        <Picker
          mode="dropdown"
          style={{ width: undefined }}
          selectedValue={filter}
          onValueChange={handleChangeFilter}
        >
          <Picker.Item label="Todas" value={null} />
          <Picker.Item label="Pendientes" value={0} />
          <Picker.Item label="Reservadas" value={1} />
          <Picker.Item label="Anuladas" value={2} />
        </Picker>
        <Right>
            {selected.length > 0 ?
            <View style={styles.iconsContainer}>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="check-circle" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="do-not-disturb" type="MaterialIcons" />
                </TouchableOpacity>
            </View> :
            <View style={styles.iconsContainer}>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="delete" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon style={styles.icon} name="sync" type="MaterialIcons" />
                </TouchableOpacity>
            </View>
            }
        </Right>
    </Appbar>
    )
  }
}

const styles = StyleSheet.create({
    appbar : {
        backgroundColor : 'white',
        paddingHorizontal : 15
    },
    iconsContainer : {
        flexDirection : 'row'
    },
    icon : {
        paddingLeft : 20,
        color : '#282828'
    }
})
export default ReservaToolbar