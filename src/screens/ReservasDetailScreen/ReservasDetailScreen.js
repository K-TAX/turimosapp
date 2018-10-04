import React, { Component,Fragment } from 'react'
import {View,StyleSheet,ActivityIndicator,TouchableOpacity,Alert} from 'react-native'
import {Container,Text,Thumbnail,Icon,Row,Col,Grid,Content} from 'native-base'
import {Title,Appbar,Chip,Button as ButtonPaper } from 'react-native-paper'
import moment from 'moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import {SERVER} from '../../constants'
import {fetchAbonos,addAbono} from '../../redux/actions/abonos'
import {cambioEstadoReserva} from '../../redux/actions/reservas'
import {enumerateDaysBetweenDates} from '../../services/dateServices'
import {numberToClp} from 'chilean-formatter'
import { Portal } from 'react-native-paper';
import {utcToLocalDateString} from '../../services/dateServices'
import DialogAddAbonos from '../../components/DialogAddAbonos'

export class ReservasDetailScreen extends Component {
  static navigationOptions = {
    title : "Detalles Reserva"
  }
  state = {
    dialogOpen : false,
    isReadyAbonos : false,
    details : {}
  }
  componentWillMount(){
    const {params : details} = this.props.navigation.state;
    this.setState({details})
  }
  async componentDidMount(){
    const {params : reserva} = this.props.navigation.state;
    await this.props.fetchAbonos(reserva.Id);
    this.setState({isReadyAbonos : true})
  }

  onDialogClose = ()=>{
    this.setState({dialogOpen : false})
  }
  handleCambioEstadoReserva = (reservaId,estado)=>{
    Alert.alert(
      estado === 1 ? "Reservar" : "Anular Reserva",
      `¿Esta seguro que desea ${estado === 1 ? "reservar":"anular"}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Sí',color : 'red', onPress: async () => {
          await this.props.cambioEstadoReserva([reservaId],estado);
           this.setState({
             details : _.find(this.props.reservas_admin,x=>x.Id === reservaId)
           })
        }},
      ],
      { cancelable: true }
    )
  }
  abonarMonto = async (monto) => {
    const {params : reserva} = this.props.navigation.state;
    await this.props.addAbono(monto,reserva.Id)
    this.setState({dialogOpen : false})
  }
  render() {
    const {abonos : abonosObj} = this.props;
    const {isReadyAbonos,dialogOpen,details} = this.state;
    const abonos = abonosObj[details.Id] ? abonosObj[details.Id].data : []
    const montoAbonado = abonosObj[details.Id] ? abonosObj[details.Id].montoAbonado : 0;
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
    return (
      <Container style={styles.root}>
        <Appbar style={styles.appbar}>
          <View style={styles.top}>
            <View style={styles.topTitle}>
              <Thumbnail source={{uri : `${SERVER.server}/${cabana.Main}`}} />
              <Title style={{marginLeft : 15,marginBottom : 10}}>{cabana.Nombre}</Title>
            </View>
            <Text style={{position : 'absolute',bottom : 5,right : 0}} note>
            {moment(utcToLocalDateString(details["Registro"])).format("lll")}</Text>
          </View>
        </Appbar>
        <Content padder>
          <Grid>
            <Row style={{ height: 35,position : 'relative' }}>
              <View style={{flexDirection : 'row',alignItems : 'center'}}>
                <Icon name="person" type="MaterialIcons" />
                <Title style={{marginLeft : 15,fontSize : 18}}>{details.Cliente.toUpperCase()}</Title>
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
              <Col style={{alignItems : 'center',justifyContent : 'center'}}>
              {isReadyAbonos ?
                <Fragment>
                  <Row>
                    <Text style={{fontWeight : 'bold'}}>
                      {numberToClp(montoAbonado)}
                    </Text>
                  </Row>
                  <Row>
                    <Text style={{fontSize : 12}}>Monto Abonado</Text>
                  </Row>
                </Fragment> : <ActivityIndicator size="small" /> }
              </Col>
              <TouchableOpacity 
              disabled={!(abonos.length)}
              onPress={()=>this.props.navigation.navigate("AbonosScreen",{isTemp : false,reservaId : details.Id})}
              style={{flex : 1}}>
                <Col style={{alignItems : 'center',justifyContent : 'center'}}>
                  {isReadyAbonos ?
                  <Fragment>
                    <Row>
                      <Text style={{fontWeight : 'bold',color : abonos.length ? 'blue' : "gray" }}>
                        {abonos.length}
                      </Text>
                    </Row>
                    <Row>
                      <Text style={{fontSize : 12,color : abonos.length ? 'blue' : "gray"}}>Cantidad Abonos</Text>
                    </Row>
                  </Fragment> : <ActivityIndicator size="small" /> }
                </Col>
              </TouchableOpacity>
            </Row>
          </Grid>
            <Row style={{padding : 10}}>
              <View style={{width : '100%'}}>
                <ButtonPaper 
                icon={montoAbonado.toString() === (cabana.Precio * days).toString() ? "check" : "add"}
                mode="outline"
                color="blue"
                disabled={montoAbonado.toString() === (cabana.Precio * days).toString()} 
                onPress={()=>this.setState({dialogOpen : true})} 
                style={{alignSelf : 'center',marginVertical : 10}}>
                  {montoAbonado.toString() === (cabana.Precio * days).toString() ?
                   "Pagado Completamente" : "Agregar Abono"}
                </ButtonPaper>
                <View style={{width : '100%',flexDirection : 'row',justifyContent : 'space-around',marginTop : 25}}>
                  <ButtonPaper 
                  icon="do-not-disturb" 
                  mode="outline" 
                  color="red" 
                  onPress={() => this.handleCambioEstadoReserva(details.Id,2)}>
                    Anular
                  </ButtonPaper>
                  <ButtonPaper 
                  icon="date-range"
                  mode="outline" 
                  onPress={() => this.handleCambioEstadoReserva(details.Id,1)}>
                    Reservar
                  </ButtonPaper>
                </View>
              </View>
            </Row>
            <Portal>
              <DialogAddAbonos 
              abonarMonto={this.abonarMonto}
              dialogOpen={dialogOpen}
              onDialogClose={this.onDialogClose}
              cabana={cabana}
              days={days}
              montoAbonado={montoAbonado}
              />
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
  }
})

const mapStateToProps = state => ({
  cabanas : state.cabanas.cabanas,
  reservas_admin : state.reservas.reservas_admin,
  accessToken : state.auth.accessToken,
  abonos : state.abonos.abonos
})
const mapDispatchToProps = dispatch => ({
  fetchAbonos : (reservaId)=>dispatch(fetchAbonos(reservaId)),
  addAbono : (monto,reservaId)=>dispatch(addAbono(monto,reservaId)),
  cambioEstadoReserva : (reservaId,estado)=>dispatch(cambioEstadoReserva(reservaId,estado))
})
export default connect(mapStateToProps,mapDispatchToProps)(ReservasDetailScreen)