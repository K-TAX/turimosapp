import React, { Component,Fragment } from 'react'
import { StyleSheet,View,TouchableOpacity,ActivityIndicator} from 'react-native'
import _ from 'lodash'
import {connect} from 'react-redux'
import {NavigationActions} from 'react-navigation'
import { Text,Container, Thumbnail, Content, Icon, Picker, Form, Item,
   Input,Row,Col,DatePicker,Textarea,Grid, Toast } from "native-base";
import {Appbar,Button as ButtonPaper,Portal} from 'react-native-paper'
import {SERVER, ENDPOINTS} from '../../constants'
import {enumerateDaysBetweenDates} from '../../services/dateServices'
import moment from 'moment'
import {numberToClp} from 'chilean-formatter'
import DialogAddAbonos from '../../components/DialogAddAbonos'
import {addTempAbono,cleanTempAbonos} from '../../redux/actions/abonos'
import {fetchAndMakeReservasPeriods,fetchAndMakeReservasPeriodsCampings} from '../../redux/actions/reservas'
import { httpPost } from '../../services/servicesHttp';

class NewReservaScreen extends Component {
  static navigationOptions = {
    title : "Nueva Reserva"
  }
  state = {
    cliente : "" ,
    email : "",
    cabana : null,
    telefono : "",
    mensaje :"",
    llegada : new Date(),
    salida : new Date(),
    isReady : false,
    dialogOpen : false,
    buttonLoadingPendiente : false,
    buttonLoadingReservar : false
  }
  cleanInputs = ()=>{
    this.setState({
      cliente : "" ,
      email : "",
      telefono : "",
      mensaje :""
    })
  }
  componentWillMount(){
    const {dateRange} = this.props.navigation.state.params;
    this.setState({
      llegada : dateRange[0],
      salida : dateRange[1]
    })
  }
  componentDidMount(){
    const {isCamping} = this.props.navigation.state.params;
    const {cabanas,campings} = this.props;
    if(!isCamping){
      this.setState({cabana : cabanas[0].Id},()=>{
        this.setState({isReady : true})
      })
    }else{
      this.setState({cabana : campings[0].Id},()=>{
        this.setState({isReady : true})
      })
    }
  }
  onValueChange(value) {
    this.setState({
      cabana: value
    });
    this.props.cleanTempAbonos()
  }
  setDateLlegada = (newDate)=> {
    let llegada = moment(newDate).format("YYYY-MM-DD").toString()
    if(this.state.salida < llegada){
      Toast.show({
        type : "danger",
        text : "La fecha de llegada no puede ser mayor a la de salida.",
        position : 'top'
      })
      this.setState({ llegada : this.state.llegada});
    }else{
      this.setState({ llegada });
    }
  }
  setDateSalida = (newDate)=> {
    let salida = moment(newDate).format("YYYY-MM-DD").toString()
    if(this.state.llegada > salida){
      Toast.show({
        type : "danger",
        text : "La fecha de salida no puede ser menor a la de llegada.",
        position : 'top'
      })
      this.setState({ salida : this.state.salida});
    }else{
      this.setState({ salida });
    }
  }
  componentWillUnmount(){
    this.props.cleanTempAbonos()
  }
  goBack = ()=>{
    this.props.cleanTempAbonos()
    this.props.navigation.dispatch(NavigationActions.back())
  }
  solicitaReserva = (estado)=>{
    const {accessToken,tempAbonos} = this.props;
    const {isCamping} = this.props.navigation.state.params;
    const payload = {
      cliente : this.state.cliente,
      email : this.state.email,
      cabana : this.state.cabana,
      telefono : this.state.telefono,
      mensaje : this.state.mensaje,
      llegada : moment(this.state.llegada).format("YYYY-MM-DD").toString(),
      salida : moment(this.state.salida).format("YYYY-MM-DD").toString(),
      abonos : tempAbonos.abonos,
      estado : estado,
      isCamping : isCamping? isCamping : false
    }
     this.setState({
     [estado === 1 ? "buttonLoadingReservar" : "buttonLoadingPendiente"] : true
     })
     httpPost(ENDPOINTS.admin_solicita_reserva,payload,accessToken).then(async ({data,status})=>{
       if(status === 200){
         this.cleanInputs();
         if(estado === 1){
           if(isCamping)
           await this.props.fetchAndMakeReservasPeriodsCampings()
           else
           await this.props.fetchAndMakeReservasPeriods()
         }
         this.setState({
         [estado === 1 ? "buttonLoadingReservar" : "buttonLoadingPendiente"] : false
         },()=>{
           this.goBack()
           Toast.show({text : data.message, position : 'top',type : "success"})
         })
       }else{
          this.setState({
            [estado === 1 ? "buttonLoadingReservar" : "buttonLoadingPendiente"] : false
          })
         Toast.show({text : data.message, position : 'top',type : "warning"})
       }
     }) 
  }
  render() {
    const {isReady,dialogOpen,cabana,cliente,email,telefono,mensaje,llegada,salida} = this.state;
    const {isCamping} = this.props.navigation.state.params;
    const {cabanas : allCabanas,campings : allCampings,tempAbonos} = this.props;
    let cabanas = isCamping ? allCampings : allCabanas;
    let cabanasItems = cabanas.map(cabana=>(
      <Picker.Item key={cabana.Id}  label={cabana.Nombre} value={cabana.Id} />
    ));
    let currentCabana = cabanas.find(x=>x.Id == cabana)
    const daysBetween = enumerateDaysBetweenDates(llegada , salida);
    let days;
    if(llegada < salida && daysBetween.length === 0){
      days = 1;
    }else{
      days = daysBetween.length + 1;
    }
    return (
      <Container>
        {!isReady ? <View style={styles.loading}><ActivityIndicator size="large" /></View> :
        <Fragment>
            <Appbar style={styles.appbar}>
              {cabana &&
              <View style={styles.top}>
                {!isCamping &&
                <Thumbnail small source={{uri : `${SERVER.server}/${currentCabana.Main}`}} />
                }
                <Picker
                mode="dialog"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                selectedValue={cabana}
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
                      <Input 
                      value={cliente} 
                      onChangeText={val=>this.setState({cliente : val})}
                      placeholder='Nombre Cliente' />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={[styles.formCol,{marginRight: 2.5}]}>
                    <Item regular>
                      <Icon type={"MaterialIcons"} name='email' style={{fontSize : 16}} />
                      <Input 
                      value={email} 
                      onChangeText={val=>this.setState({email : val})}
                      keyboardType="email-address" 
                      placeholder='Email' />
                    </Item>
                  </Col>
                  <Col style={[styles.formCol,{marginLeft : 2.5}]}>
                    <Item regular>
                      <Icon type={"MaterialIcons"} name='phone' style={{fontSize : 16}} />
                      <Input 
                      value={telefono} 
                      onChangeText={val=>this.setState({telefono : val})}
                      keyboardType="phone-pad" 
                      placeholder='Telefono' />
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={[styles.formCol,{marginRight: 2.5}]}>
                    <Icon name="date-range" type="MaterialIcons" />
                    <DatePickerAutoRefresh
                    initialDate={llegada} 
                    onDateChange={this.setDateLlegada} />
                  </Col>
                  <Col style={[styles.formCol,{marginLeft : 2.5}]}>
                    <Icon name="date-range" type="MaterialIcons" />
                    <DatePickerAutoRefresh
                    initialDate={salida} 
                    onDateChange={this.setDateSalida} />
                  </Col>
                </Row>
                <Textarea 
                value={mensaje}
                onChangeText={val=>this.setState({mensaje : val})} 
                rowSpan={4} 
                bordered placeholder="Mensaje" />
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
                      <Text style={{fontWeight : 'bold'}}>{numberToClp(currentCabana.Precio)}</Text>
                    </Row>
                    <Row>
                      <Text style={{fontSize : 12}}>Valor Diario</Text>
                    </Row>
                  </Col>
                  <Col style={{alignItems : 'center'}}>
                    <Row>
                      <Text style={{fontWeight : 'bold'}}>{numberToClp(currentCabana.Precio * days)}</Text>
                    </Row>
                    <Row>
                      <Text style={{fontSize : 12}}>Total Estadia</Text>
                    </Row>
                  </Col>
                </Row>
                <Row style={{height : 50}}>
                  <Col style={{alignItems : 'center'}}>
                    <Row>
                      <Text style={{fontWeight : 'bold'}}>{numberToClp((currentCabana.Precio * days)*0.30)}</Text>
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
                icon={tempAbonos.montoAbonado.toString() === (currentCabana.Precio * days).toString() ? "check" : "add"}
                mode="outline"
                color="blue"
                disabled={tempAbonos.montoAbonado.toString() === (currentCabana.Precio * days).toString()} 
                onPress={()=>this.setState({dialogOpen : true})} 
                style={{alignSelf : 'center',marginVertical : 10}}>
                  {tempAbonos.montoAbonado.toString() === (currentCabana.Precio * days).toString() ?
                   "Pagado Completamente" : "Agregar Abono"}
                </ButtonPaper>
                <View style={{width : '100%',flexDirection : 'row',justifyContent : 'space-around',marginTop : 25}}>
                  {!isCamping &&
                  <ButtonPaper 
                   loading={this.state.buttonLoadingPendiente}
                   icon="date-range"
                   mode="outline" 
                   onPress={() => this.solicitaReserva(0)}
                   >{"Pendiente"}</ButtonPaper>
                  }
                   <ButtonPaper 
                    loading={this.state.buttonLoadingReservar}
                    icon="date-range"
                    mode="outline" 
                    onPress={() => this.solicitaReserva(1)}
                    >{"Reservar"}</ButtonPaper>
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
              cabana={currentCabana}
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

class DatePickerAutoRefresh extends Component {
  state = {
    isReady : true
  }
  componentWillReceiveProps(nextProps){
    if(this.state.isReady){
      this.setState({isReady : false},()=>{
        this.setState({isReady : true})
      })
    }
  }
  render(){
    const {initialDate,onDateChange} = this.props;
    const {isReady} = this.state;
    return (
      !isReady ?
      <View /> :
      <DatePicker
      defaultDate={moment(initialDate).toDate()}
      minimumDate={moment(moment.now()).toDate()}
      maximumDate={moment(moment.now()).add(4, 'years').toDate()}
      locale={"es"}
      timeZoneOffsetInMinutes={undefined}
      modalTransparent={false}
      animationType={"fade"}
      androidMode={"calendar"}
      placeHolderText={moment(initialDate).format("L")}
      formatChosenDate={date => {return moment(date).format('L')}}
      textStyle={{ color: "black" }}
      placeHolderTextStyle={{ color: "black" }}
      onDateChange={onDateChange}
      />
    )
  }
}


const mapStateToProps = state => ({
  accessToken : state.auth.accessToken,
  cabanas : state.cabanas.cabanas,
  campings : state.campings.campings,
  tempAbonos : state.abonos.tempAbonos
})
const mapDispatchToProps = dispatch => ({
  addTempAbono : (montoAbono)=>dispatch(addTempAbono(montoAbono)),
  cleanTempAbonos : ()=>dispatch(cleanTempAbonos()),
  fetchAndMakeReservasPeriods : ()=>dispatch(fetchAndMakeReservasPeriods()),
  fetchAndMakeReservasPeriodsCampings : ()=>dispatch(fetchAndMakeReservasPeriodsCampings())
})

export default connect(mapStateToProps,mapDispatchToProps)(NewReservaScreen)

