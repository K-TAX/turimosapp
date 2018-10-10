import React, { Component } from 'react'
import {StyleSheet,View,ScrollView} from 'react-native'
import {Content, Container,Grid,Row,Col,Thumbnail,Icon,Text,Toast} from 'native-base'
import moment from 'moment'
import {CalendarList } from 'react-native-calendars'
import _ from 'lodash'
import {SERVER} from '../../../constants'

export class MultiCalendar extends Component {
  state = {
    reservasPeriods : {},
    firstSelected : '',
    secondSelected : '',
  }
  componentDidMount(){
    const {reservasPeriods} = this.props;
    this.setState({reservasPeriods})
  }
  componentWillReceiveProps(nextProps){
    if(this.props.reservasPeriods != nextProps.reservasPeriods){
      this.setState({reservasPeriods : nextProps.reservasPeriods})
    }
  }
  onDayLongPress = (day)=>{
    this.props.navigation.navigate("DayDetailScreen",{day : day.dateString,isCamping : true})
  }
  onDayPress = async (day)=>{
    const {reservasPeriods,firstSelected,secondSelected} = this.state;
    if(typeof reservasPeriods[day.dateString] !== "object"){
      reservasPeriods[day.dateString] = {selected : false};
    }
    if(firstSelected && !secondSelected){
      if(day.dateString < firstSelected){
        Toast.show({
          type : "danger",
          text : "La fecha de salida no puede ser menor a la de llegada.",
          position : 'top'
        })
        return;
      }
      if(day.dateString === firstSelected){
        reservasPeriods[firstSelected] = {...reservasPeriods[firstSelected],selected : false}
        this.setState({firstSelected : ''})
        return;
      }
      this.setState({secondSelected : day.dateString})
      reservasPeriods[day.dateString] = {...reservasPeriods[day.dateString],selected : true}
      await new Promise(resolve=>{
        setTimeout(()=>{
          reservasPeriods[firstSelected] = {...reservasPeriods[firstSelected],selected : false}
          reservasPeriods[day.dateString] = {...reservasPeriods[day.dateString],selected : false}
          this.setState({firstSelected : '',secondSelected : ''})
          resolve()
        },100)
      })
      this.props.navigation.navigate("NewReservaScreen",{
        dateRange : [firstSelected,day.dateString],
        isCamping : true
      })
    }else{
      this.setState({firstSelected : day.dateString});
      reservasPeriods[day.dateString] = {...reservasPeriods[day.dateString],selected : true}
    }
    this.setState({reservasPeriods : {...reservasPeriods}})
  }
  resetRangeDates = ()=>{
    this.setState({firstSelected : false,secondSelected : false})
  }
  render() {
    const {campings : allCampings,colors} = this.props;
    const {reservasPeriods} = this.state;
    return (
    <Container>
       <Grid style={{maxHeight : 80}}>
        {_.chunk(allCampings,3).map((campings,i)=>(
          <Row style={{height : 40}} key={i}>
            {campings.map((camping,ii)=>(
            <Col style={{alignItems : 'center'}} key={ii}>
              <View style={{ flex : 1 ,flexDirection : 'row',alignItems : 'center'}}>
                <Text style={{fontSize : 9,marginHorizontal : 5}}>{camping.Nombre.toUpperCase()}</Text>
                <Icon name="invert-colors" type="MaterialIcons" 
                    style={{color : colors[camping.Id],fontSize : 15}}/>
              </View>
            </Col>
            ))}
          </Row>
        ))}
      </Grid>
      <Content>
        <CalendarList
        onDayPress={this.onDayPress}
        horizontal
        onDayLongPress={this.onDayLongPress}
        pastScrollRange={0}
        futureScrollRange={50}
        style={{flex : 1}}
        calendarHeight={390}
        minDate={moment(moment.now()).format("YYYY-MM-DD")}
        pagingEnabled
        markingType='multi-period'
        showScrollIndicator
        firstDay={1}
        markedDates={{
          ...reservasPeriods
        }}
        />
      </Content>
    </Container>
    )
  }
}
const styles = StyleSheet.create({
  listItem : {
    maxHeight : 40
  }
})
export default MultiCalendar