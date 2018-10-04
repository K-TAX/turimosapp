import React, { Component } from 'react'
import {StyleSheet,View} from 'react-native'
import {Content, Container,Grid,Row,Col,Thumbnail,Icon,Text} from 'native-base'
import moment from 'moment'
import {CalendarList } from 'react-native-calendars'
import _ from 'lodash'
import {SERVER} from '../../../constants'

export class MultiCalendar extends Component {
  state = {
    allReservas : {},
    firstSelected : '',
    secondSelected : '',
  }
  componentDidMount(){
    const {allReservas} = this.props;
    this.setState({allReservas})
  }
  onDayPress = async (day)=>{
    const {allReservas,firstSelected,secondSelected} = this.state;
    if(typeof allReservas[day.dateString] !== "object"){
      allReservas[day.dateString] = {selected : false};
    }
    if(firstSelected && !secondSelected){
      this.setState({secondSelected : day.dateString})
      allReservas[day.dateString] = {...allReservas[day.dateString],selected : true}
      await new Promise(resolve=>{
        setTimeout(()=>{
          allReservas[firstSelected] = {...allReservas[firstSelected],selected : false}
          allReservas[day.dateString] = {...allReservas[secondSelected],selected : false}
          this.setState({firstSelected : '',secondSelected : ''})
          resolve()
        },100)
      })
      this.props.navigation.navigate("NewReservaScreen",{dateRange : [firstSelected,day.dateString]})
    }else{
      this.setState({firstSelected : day.dateString});
      allReservas[day.dateString] = {...allReservas[day.dateString],selected : true}
    }
    this.setState({allReservas : {...allReservas}})
  }
  resetRangeDates = ()=>{
    this.setState({firstSelected : false,secondSelected : false})
  }
  render() {
    const {cabanas,colors} = this.props;
    const {allReservas} = this.state;
    return (
    <Container>
       <Grid style={{maxHeight : 40}}>
        <Row>
          {cabanas.map((cabana,i)=>(
          <Col style={{alignItems : 'center'}} key={i}>
            <View style={{ flex : 1 ,flexDirection : 'row',alignItems : 'center'}}>
                <Thumbnail 
                small
                style={{width : 20,height : 20}}
                source={{uri: `${SERVER.server}/${cabana.Main}`}} />
                <Text style={{fontSize : 9,marginHorizontal : 5}}>{cabana.Id.toUpperCase()}</Text>
                <Icon name="invert-colors" type="MaterialIcons" 
                    style={{color : colors[cabana.Id],fontSize : 15}}/>
            </View>
          </Col>
          ))}
        </Row>
      </Grid>
      <Content>
        <CalendarList
        onDayPress={this.onDayPress}
        horizontal
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
          ...allReservas
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