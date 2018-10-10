import React, { Component } from 'react'
import { StyleSheet,View,TouchableOpacity,Alert } from 'react-native'
import { Appbar } from 'react-native-paper';
import {Icon,Right,Picker} from 'native-base'

export class ReservaToolbar extends Component {
    onConfirmCleanReservasAnuladas = ()=>{
        const {handleCleanReservasAnuladas} = this.props;
        Alert.alert(
          'Limpiar Reservas Anuladas',
          '¿Desea limpiar todas las reservas anuladas?',
          [
            {text: 'Cancelar', style: 'cancel'},
            {text: 'Sí, Limpiar todas',color : 'red', onPress: () => handleCleanReservasAnuladas()},
          ],
          { cancelable: true }
        )
    }
    render() {
    const {filter,handleChangeFilter,handleUpdateReservas} = this.props;
    return (
    <Appbar style={styles.appbar}>
        <Picker
          mode="dropdown"
          style={{ width: undefined }}
          selectedValue={filter}
          onValueChange={handleChangeFilter}
        >
          <Picker.Item label="Cabañas" value={0} />
          <Picker.Item label="Campings" value={1} />
        </Picker>
        <Right>
         <View style={styles.iconsContainer}>
             <TouchableOpacity onPress={this.onConfirmCleanReservasAnuladas}>
                 <Icon style={styles.icon} name="delete" type="MaterialIcons" />
             </TouchableOpacity>
             <TouchableOpacity onPress={()=>handleUpdateReservas()}>
                 <Icon style={styles.icon} name="sync" type="MaterialIcons" />
             </TouchableOpacity>
         </View>
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