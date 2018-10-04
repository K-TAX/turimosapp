import React,{Component} from 'react'
import {View} from 'react-native'
import { Dialog } from 'react-native-paper';
import {Text,Item,Input,Button,Label} from 'native-base'

class DialogAddAbonos extends Component {
    state = {
        abonoMontoInput : ''
    }
    render(){
        const {abonoMontoInput} = this.state;
        const {dialogOpen,onDialogClose,cabana,days,montoAbonado,abonarMonto} = this.props;
        let inputAbonoIsError = (parseInt(abonoMontoInput)+ parseInt(montoAbonado ? montoAbonado : 0)) > parseInt(cabana.Precio) * days;
        let inputAbonoIsSuccess = !inputAbonoIsError;
        if(!abonoMontoInput){
        inputAbonoIsError = false;
        inputAbonoIsSuccess = false;
        }
        return (
            <Dialog
               visible={dialogOpen}
               onDismiss={onDialogClose}>
               <Dialog.Title>
                 Agregar Abono
               </Dialog.Title>
               <Dialog.Content style={{position : 'relative'}}>
                 <View style={{flexDirection : 'row',justifyContent : 'flex-end'}}>
                   <Button 
                   onPress={()=>this.setState({abonoMontoInput : (parseInt(cabana.Precio * 0.30) * days).toString()})}
                   style={{marginRight : 10}}
                   light 
                   rounded>
                     <Text>30%</Text>
                   </Button>
                   <Button 
                   onPress={()=>this.setState({
                       abonoMontoInput : ((parseInt(cabana.Precio) * days) - montoAbonado).toString()}
                       )}
                   light 
                   rounded>
                     <Text>100%</Text>
                   </Button>
                 </View>
                 <Item stackedLabel success={inputAbonoIsSuccess} error={inputAbonoIsError} >
                   <Label>Monto</Label>
                   <Input 
                   renderToHardwareTextureAndroid
                   keyboardType="numeric"
                   onChangeText={val=>
                     this.setState({abonoMontoInput:  /^[0-9]*$/.test(val) ? val : val.slice(0,val.length - 1)})
                   }
                   value={abonoMontoInput} />
                 </Item>
               </Dialog.Content>
               <Dialog.Actions style={{padding : 10}}>
                 <Button style={{marginEnd : 15,maxWidth : 120}} light onPress={onDialogClose}>
                   <Text>Cancelar</Text>
                 </Button>
                 <Button 
                 disabled={!(abonoMontoInput) || inputAbonoIsError} 
                 primary={!!(abonoMontoInput)} 
                 light={!(abonoMontoInput) || inputAbonoIsError} 
                 style={{maxWidth : 120}} 
                 onPress={()=>{
                    this.setState({abonoMontoInput : ''},()=>{
                      abonarMonto(abonoMontoInput)
                    })
                   }}>
                   <Text>Confirmar</Text>
                 </Button>
               </Dialog.Actions>
            </Dialog>
        )
    }
}
export default DialogAddAbonos;