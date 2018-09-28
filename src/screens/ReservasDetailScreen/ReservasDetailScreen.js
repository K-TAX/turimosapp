import React, { Component } from 'react'
import {View,StyleSheet,ScrollView,TouchableOpacity } from 'react-native'
import {Container,Text,Thumbnail,Icon,Row,Col,Grid,Item,Input,Button,Label,Content} from 'native-base'
import {Title,Appbar,Chip,Button as ButtonPaper } from 'react-native-paper'
import moment from 'moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import {SERVER} from '../../constants'
import Expo from 'expo';
import {enumerateDaysBetweenDates} from '../../services/dateServices'
import {numberToClp} from 'chilean-formatter'
import { Dialog, Portal } from 'react-native-paper';

export class ReservasDetailScreen extends Component {
  static navigationOptions = {
    title : "Detalles Reserva"
  }
  state = {
    dialogOpen : false,
    abonoMontoInput : '',
    montoAbonado : 0
  }
  onDialogClose = ()=>{
    this.setState({dialogOpen : false,abonoMontoInput : ''})
  }
  abonarMonto = () => {
    const {abonoMontoInput,montoAbonado} = this.state;
    this.setState({montoAbonado : parseInt(abonoMontoInput) + montoAbonado,abonoMontoInput : '',dialogOpen : false})
  }
  render() {
    const {params : details} = this.props.navigation.state;
    const {abonoMontoInput,montoAbonado} = this.state;
    const chipBackgroundColor = details.Estado == 0?"#e0e0e0":details.Estado == 1?"#00C853":details.Estado==2?"#EF5350":"#e0e0e0";
    const chipColor = details.Estado == 0?"#000":details.Estado == 1?"#fff":details.Estado==2?"#fff":"#000";
    const cabana = _.find(this.props.cabanas,c=>c.Id === details.Cabana);
    // const daysBetween = enumerateDaysBetweenDates(details.Llegada,details.Salida);
    const daysBetween = enumerateDaysBetweenDates(details.Llegada , details.Salida);
    let days;
    if(details.Llegada === details.Salida){
      days = 1;
    }else if(details.Llegada < details.Salida && daysBetween.length === 0){
      days = 2;
    }else{
      days = daysBetween.length + 2;
    }
    let inputAbonoIsError = (parseInt(abonoMontoInput)+ parseInt(montoAbonado ? montoAbonado : 0)) > parseInt(cabana.Precio) * days;
    let inputAbonoIsSuccess = !inputAbonoIsError;
    if(!abonoMontoInput){
      inputAbonoIsError = false;
      inputAbonoIsSuccess = false;
    }
    return (
      <Container style={styles.root}>
        <Appbar style={styles.appbar}>
          <View style={styles.top}>
            <View style={styles.topTitle}>
              <Thumbnail source={{uri : `${SERVER.server}/${cabana.Main}`}} />
              <Title style={{marginLeft : 15,marginBottom : 10}}>{cabana.Nombre}</Title>
            </View>
            <Text style={{position : 'absolute',bottom : 5,right : 0}} note>
            {moment(details["Registro"]).format("lll")}</Text>
          </View>
        </Appbar>
        <Content padder>
          <Grid>
            <Row style={{ height: 35,position : 'relative' }}>
              <View style={{flexDirection : 'row',alignItems : 'center'}}>
                <Icon name="person" type="MaterialIcons" />
                <Title style={{marginLeft : 15}}>{details.Cliente.toUpperCase()}</Title>
              </View>
              <Chip 
              style={{backgroundColor : chipBackgroundColor,
              height : 25,
              position : 'absolute',
              right : 10,
              bottom : 10,
              justifyContent : 'center'}}>
                <Text style={{color : chipColor,fontSize : 10}}>
                {details.Estado == 0?"Pendiente":details.Estado == 1?"Reservado":details.Estado==2?"Anulado":""}
                </Text>
              </Chip>
            </Row>
            <Row style={{ height: 50}}>
              <Col style={{ justifyContent: 'center'}}>
                <View style={{flexDirection : 'row',alignItems : 'center'}}>
                  <Icon name="email" type="MaterialIcons" style={{fontSize : 16}} />
                  <Text note numberOfLines={2} style={{marginLeft : 10,fontSize : 12}}>{details.Email}</Text>
                </View>
              </Col>
              <Col style={{ justifyContent: 'center'}}>
                <View style={{flexDirection : 'row',alignItems : 'center',justifyContent : 'center'}}>
                  <Icon name="phone" type="MaterialIcons" style={{fontSize : 16}}/>
                  <Text note style={{marginLeft : 10}}>{details.Telefono}</Text>
                </View>
              </Col>
            </Row>
            <Row style={{ height: 35 }}>
              <View style={{flexDirection : 'row',alignItems : 'center'}}>
                <Icon name="date-range" type="MaterialIcons" style={{fontSize : 16}} />
                <Text style={{marginLeft : 15}}>{`${details.Llegada} a ${details.Salida}`}</Text>
              </View>
            </Row>
            <Row style={{minHeight : 100,marginTop : 10,padding : 10 ,borderWidth : 1,borderColor : 'lightgray',position : 'relative' }}>
              <Text>
                {details.Mensaje}
              </Text>
              <Icon style={{position : 'absolute',zIndex : -1,opacity: .05,fontSize : 100,top: 0,right : 30}} 
                type="Ionicons" 
                name="ios-mail-outline" />
            </Row>
          </Grid>
          <Grid style={{marginTop : 25}}>
            <Row style={{height : 50}}>
              <Col style={{alignItems : 'center'}}>
                <Row>
                  <Text style={{fontWeight : 'bold'}}>{days + " Días"}</Text>
                </Row>
                <Row>
                  <Text style={{fontSize : 12}}>Estadia</Text>
                </Row>
              </Col>
              <Col style={{alignItems : 'center'}}>
                <Row>
                  <Text style={{fontWeight : 'bold'}}>{numberToClp(cabana.Precio)}</Text>
                </Row>
                <Row>
                  <Text style={{fontSize : 12}}>Valor Diario</Text>
                </Row>
              </Col>
              <Col style={{alignItems : 'center'}}>
                <Row>
                  <Text style={{fontWeight : 'bold'}}>{numberToClp(cabana.Precio * days)}</Text>
                </Row>
                <Row>
                  <Text style={{fontSize : 12}}>Total Estadia</Text>
                </Row>
              </Col>
            </Row>
            <Row style={{height : 50}}>
              <Col style={{alignItems : 'center'}}>
                <Row>
                  <Text style={{fontWeight : 'bold'}}>{numberToClp((cabana.Precio * days)*0.30)}</Text>
                </Row>
                <Row>
                  <Text style={{fontSize : 12}}>30%</Text>
                </Row>
              </Col>
              <Col style={{alignItems : 'center'}}>
                <Row>
                  <Text style={{fontWeight : 'bold'}}>{numberToClp(montoAbonado)}</Text>
                </Row>
                <Row>
                  <Text style={{fontSize : 12}}>Monto Abonado</Text>
                </Row>
              </Col>
              <TouchableOpacity style={{flex : 1}}>
                <Col style={{alignItems : 'center'}}>
                  <Row>
                    <Text style={{fontWeight : 'bold',color : 'blue' }}>0</Text>
                  </Row>
                  <Row>
                    <Text style={{fontSize : 12,color : 'blue'}}>Cantidad Abonos</Text>
                  </Row>
                </Col>
              </TouchableOpacity>
            </Row>
          </Grid>
            <Row style={{padding : 10}}>
              <View style={{width : '100%'}}>
                <ButtonPaper 
                icon="add"
                mode="outline"
                color="blue"
                disabled={montoAbonado === cabana.Precio * days} 
                onPress={()=>this.setState({dialogOpen : true})} 
                style={{alignSelf : 'center',marginVertical : 10}}>
                  Agregar Abono
                </ButtonPaper>
                <View style={{width : '100%',flexDirection : 'row',justifyContent : 'space-around',marginTop : 25}}>
                  <ButtonPaper 
                  icon="do-not-disturb" 
                  mode="outline" 
                  color="red" 
                  onPress={() => console.log('Pressed')}>
                    Anular
                  </ButtonPaper>
                  <ButtonPaper 
                  icon="date-range"
                  mode="outline" 
                  onPress={() => console.log('Pressed')}>
                    Reservar
                  </ButtonPaper>
                </View>
              </View>
            </Row>
            <Portal>
              <Dialog
                visible={this.state.dialogOpen}
                onDismiss={this.onDialogClose}>
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
                    onChangeText={abonoMontoInput=>this.setState({abonoMontoInput})}
                    value={abonoMontoInput} />
                  </Item>
                </Dialog.Content>
                <Dialog.Actions style={{padding : 10}}>
                  <Button style={{marginEnd : 15,maxWidth : 120}} light onPress={this.onDialogClose}>
                    <Text>Cancelar</Text>
                  </Button>
                  <Button primary style={{maxWidth : 120}} onPress={this.abonarMonto}>
                    <Text>Confirmar</Text>
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
        </Content>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  root : { 
    flex : 1
  },
  appbar : {
    minHeight : 75,
    position : 'relative',
    width : '100%',
    backgroundColor : 'white',
    paddingHorizontal : 15
  },
  content : {
    flex : 1
  },
  first : {
    flex : 1,
    padding : 15
  },
  second : {
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
  table : {
    backgroundColor : 'teal'
  },
  tableText : {
    color : 'white',
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 14
  }
})

const mapStateToProps = state => ({
  cabanas : state.cabanas.cabanas
})
export default connect(mapStateToProps)(ReservasDetailScreen)