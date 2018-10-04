import React, { Component,Fragment } from 'react'
import { StyleSheet,View,TouchableOpacity,ActivityIndicator} from 'react-native'
import _ from 'lodash'
import {connect} from 'react-redux'
import { Text,Container, Thumbnail, Content, Icon, Picker, Form, Item,
   Input,Row,Col,DatePicker,Textarea,Grid } from "native-base";
import {Appbar,Button as ButtonPaper,Portal} from 'react-native-paper'
import {SERVER} from '../../constants'
import {enumerateDaysBetweenDates} from '../../services/dateServices'
import moment from 'moment'
import {numberToClp} from 'chilean-formatter'
import DialogAddAbonos from '../../components/DialogAddAbonos'
import {addTempAbono,cleanTempAbonos} from '../../redux/actions/abonos'

class NewReservaScreen extends Component {
  static navigationOptions = {
    title : "Nueva Reserva"
  }
  state = {
    selected: null,
    llegada : new Date(),
    salida : new Date(),
    isReady : false,
    dialogOpen : false
  }
  componentWillMount(){
    const {dateRange} = this.props.navigation.state.params;
    this.setState({
      llegada : dateRange[0],
      salida : dateRange[1]
    })
  }
  componentDidMount(){
    const {cabanas} = this.props;
    this.setState({selected : cabanas[0].Id},()=>{
      this.setState({isReady : true})
    })
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  setDateLlegada = (newDate)=> {
    this.setState({ llegada: newDate });
  }
  setDateSalida = (newDate)=> {
    this.setState({ salida: newDate });
  }
  componentWillUnmount(){
    this.props.cleanTempAbonos()
  }
  render() {
    const {isReady,dialogOpen,selected,llegada,salida} = this.state;
    const {cabanas,tempAbonos} = this.props;
    let cabanasItems = cabanas.map(cabana=>(
      <Picker.Item key={cabana.Id}  label={cabana.Nombre} value={cabana.Id} />
    ));
    let cabana = cabanas.find(x=>x.Id == selected)
    const daysBetween = enumerateDaysBetweenDates(llegada , salida);
    let days;
    if(llegada === salida){
      days = 1;
    }else if(llegada < salida && daysBetween.length === 0){
      days = 2;
    }else{
      days = daysBetween.length + 2;
    }
    return (
      <Container>
        {!isReady ? <View style={styles.loading}><ActivityIndicator size="large" /></View> :
        <Fragment>
            <Appbar style={styles.appbar}>
              {selected &&
              <View style={styles.top}>
                <Thumbnail small source={{uri : `${SERVER.server}/${cabana.Main}`}} />
                <Picker
                mode="dialog"
                iosHeader="Select your SIM"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
                >
                {cabanasItems}
                </Picker>
              </View>
              }
            </Appbar>
            <Content padder>
              <Form>
                <Row>
                  <Col style={styles.formCol}>
                    <Item regular>
                      <Icon type={"MaterialIcons"} name='person' style={{fontSize : 16}} />
                      <Input placeholder='Nombre Cliente' />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={[styles.formCol,{marginRight: 2.5}]}>
                    <Item regular>
                      <Icon type={"MaterialIcons"} name='email' style={{fontSize : 16}} />
                      <Input placeholder='Email' />
                    </Item>
                  </Col>
                  <Col style={[styles.formCol,{marginLeft : 2.5}]}>
                    <Item regular>
                      <Icon type={"MaterialIcons"} name='phone' style={{fontSize : 16}} />
                      <Input placeholder='Telefono' />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={[styles.formCol,{marginRight: 2.5}]}>
                    <Icon name="date-range" type="MaterialIcons" />
                    <DatePicker
                    defaultDate={moment(llegada).toDate()}
                    minimumDate={moment(moment.now()).toDate()}
                    maximumDate={moment(moment.now()).add(4, 'years').toDate()}
                    locale={"es"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"calendar"}
                    placeHolderText={llegada}
                    formatChosenDate={date => {return moment(date).format('YYYY-MM-DD')}}
                    textStyle={{ color: "black" }}
                    placeHolderTextStyle={{ color: "black" }}
                    onDateChange={this.setDateLlegada}
                    />
                  </Col>
                  <Col style={[styles.formCol,{marginLeft : 2.5}]}>
                    <Icon name="date-range" type="MaterialIcons" />
                    <DatePicker
                      defaultDate={moment(salida).toDate()}
                      minimumDate={moment(moment.now()).toDate()}
                      maximumDate={moment(moment.now()).add(4, 'years').toDate()}
                      locale={"es"}
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"calendar"}
                      placeHolderText={salida}
                      formatChosenDate={date => {return moment(date).format('YYYY-MM-DD')}}
                      textStyle={{ color: "black" }}
                      placeHolderTextStyle={{ color: "black" }}
                      onDateChange={this.setDateSalida}
                      />
                  </Col>
                </Row>
                <Textarea rowSpan={4} bordered placeholder="Mensaje" />
              </Form>
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
                    <Row>
                      <Text style={{fontWeight : 'bold'}}>
                        {numberToClp(tempAbonos.montoAbonado)}
                      </Text>
                    </Row>
                    <Row>
                      <Text style={{fontSize : 12}}>Monto Abonado</Text>
                    </Row>
                  </Col>
                  <TouchableOpacity 
                  disabled={!(tempAbonos.abonos.length)}
                  onPress={()=>this.props.navigation.navigate("AbonosScreen",{isTemp : true})}
                  style={{flex : 1}}>
                    <Col style={{alignItems : 'center',justifyContent : 'center'}}>
                      <Row>
                        <Text style={{fontWeight : 'bold',color : tempAbonos.abonos.length ? 'blue' : "gray" }}>
                          {tempAbonos.abonos.length}
                        </Text>
                      </Row>
                      <Row>
                        <Text style={{fontSize : 12,color : tempAbonos.abonos.length ? 'blue' : "gray"}}>Cantidad Abonos</Text>
                      </Row>
                    </Col>
                  </TouchableOpacity>
                </Row>
              </Grid>
              <Row style={{padding : 10}}>
              <View style={{width : '100%'}}>
                <ButtonPaper 
                icon={tempAbonos.montoAbonado.toString() === (cabana.Precio * days).toString() ? "check" : "add"}
                mode="outline"
                color="blue"
                disabled={tempAbonos.montoAbonado.toString() === (cabana.Precio * days).toString()} 
                onPress={()=>this.setState({dialogOpen : true})} 
                style={{alignSelf : 'center',marginVertical : 10}}>
                  {tempAbonos.montoAbonado.toString() === (cabana.Precio * days).toString() ?
                   "Pagado Completamente" : "Agregar Abono"}
                </ButtonPaper>
                <View style={{width : '100%',flexDirection : 'row',justifyContent : 'space-around',marginTop : 25}}>
                  <ButtonPaper 
                  icon="date-range"
                  mode="outline" 
                  // onPress={() => this.handleCambioEstadoReserva(details.Id,1)}
                  >
                    Reservar
                  </ButtonPaper>
                </View>
              </View>
            </Row>
            <Portal>
              <DialogAddAbonos 
              abonarMonto={async monto => {
                  await this.props.addTempAbono(monto);
                  this.setState({dialogOpen : false})
                }
              }
              dialogOpen={dialogOpen}
              onDialogClose={()=>this.setState({dialogOpen : false})}
              cabana={cabana}
              days={days}
              montoAbonado={tempAbonos.montoAbonado}
              />
            </Portal>
          </Content>
        </Fragment>
        }
    </Container>
    )
  }
}

const styles = StyleSheet.create({
  root : {
    flex : 1
  },
  container : {
    flex : 1
  },
  loading : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  },
  appbar : {
    maxHeight : 60, 
    position : 'relative',
    width : '100%',
    backgroundColor : 'white'
  },
  top : {
    padding : 10,
    width : '100%',
    flexDirection : 'row',
    alignItems : 'center'
  },
  formCol : {
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    marginVertical : 5
  }
})

const mapStateToProps = state => ({
  cabanas : state.cabanas.cabanas,
  tempAbonos : state.abonos.tempAbonos
})
const mapDispatchToProps = dispatch => ({
  addTempAbono : (montoAbono)=>dispatch(addTempAbono(montoAbono)),
  cleanTempAbonos : ()=>dispatch(cleanTempAbonos())
})

export default connect(mapStateToProps,mapDispatchToProps)(NewReservaScreen)

