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
    onCambioEstadoReserva = (estado)=>{
        const {handleCambioEstadoReserva,selected} = this.props;
        const alertContent = estado === 1 ? 
        ["Confirmar Reservas", `¿Desea confirmar reservas (${selected.length})?`] :
        ["Anular Reservas", `¿Desea anular reservas (${selected.length})?`];
        Alert.alert(
            ...alertContent,
            [
              {text: 'Cancelar', style: 'cancel'},
              {text: 'Sí',color : 'red', 
              onPress: () => handleCambioEstadoReserva(estado)},
            ],
            { cancelable: true }
          )
    }
    render() {
    const {selected,filter,handleChangeFilter,handleUpdateReservas} = this.props;
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
                <TouchableOpacity onPress={()=>this.onCambioEstadoReserva(1)}>
                    <Icon style={styles.icon} name="check-circle" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.onCambioEstadoReserva(2)}>
                    <Icon style={styles.icon} name="do-not-disturb" type="MaterialIcons" />
                </TouchableOpacity>
            </View> :
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={this.onConfirmCleanReservasAnuladas}>
                    <Icon style={styles.icon} name="delete" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleUpdateReservas()}>
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