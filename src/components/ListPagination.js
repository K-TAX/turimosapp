import React, { Component } from 'react'
import { TouchableOpacity, View,StyleSheet,Dimensions,Text,FlatList } from 'react-native'
import _ from 'lodash'
const {width : widthScreen ,height : heightScreen} = Dimensions.get("window")

class ListPagination extends Component {
  state = {
    paginationIndex : 0,
    paginationLimitIndex : 0
  }
  render() {
    const { paginationLimit,renderItem,data,parentState,rowsPerPage } = this.props;
    const {paginationIndex,paginationLimitIndex} = this.state;   
    const paginationPages = [];
    const dataChuck = _.chunk(data,rowsPerPage);
    if(data.length > 0){
      const allPages = dataChuck.map((x,i)=>(
        {text : i+1 ,onClick : ()=>this.setState({paginationIndex : i}),
        active : i === paginationIndex
      }))
      const pageWithLimit = _.chunk(allPages,paginationLimit);
      if(paginationIndex > 0){
        paginationPages.push({ text: "ANTERIOR",isButton : true,onClick : ()=>this.setState({
          paginationIndex : paginationIndex -1 ,
          paginationLimitIndex : paginationIndex + 1 === pageWithLimit[paginationLimitIndex][0].text ?
             (paginationLimitIndex - 1) : paginationLimitIndex
        }) })
      }else {paginationPages.push({ text: "ANTERIOR",isButton : true})}

      paginationPages.push(...pageWithLimit[paginationLimitIndex])
      if(paginationIndex !== dataChuck.length -1){
        paginationPages.push({ text: "SIGUIENTE",isButton : true,onClick : ()=>this.setState({
          paginationIndex : paginationIndex + 1,
          paginationLimitIndex : paginationIndex + 1 === _.last(pageWithLimit[paginationLimitIndex]).text ?
             (paginationLimitIndex + 1) : paginationLimitIndex
        })})
      }else {paginationPages.push({ text: "SIGUIENTE",isButton : true})}
    }
    return (
      <View style={styles.root}>
          <View style={styles.itemsContainer}>
            <FlatList 
              data={_.map(dataChuck[paginationIndex])}
              extraData={parentState}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.Id}
            />
          </View>
          <View style={styles.paginationContainer}>
            <View style={styles.pagination}>
              {paginationPages.map((prop, key) => {
                const paginationLink = [
                  prop.isButton ? styles.buttons : styles.paginationLink,
                  prop.active ? styles.active : {},
                  prop.onClick === undefined ? styles.disabled : {}];
                return (
                  <View style={styles.paginationLinkContainer} key={key}>
                    {prop.onClick !== undefined ? (
                      <TouchableOpacity 
                        onPress={()=>prop.onClick()}
                        style={paginationLink} >
                        <Text style={[styles.text,prop.active ? {color : 'white'} : {}]}>{prop.text}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={()=>{}}
                        disabled
                        style={paginationLink} 
                      >
                        <Text style={styles.text}>{prop.text}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
      </View>
    )
  }
}
ListPagination.defaultProps = {
  data : [],
  rowsPerPage : 4,
  paginationLimit : 3
}

const styles = StyleSheet.create({
  root : {
    flex : 1,
  },
  itemsContainer : {
    flex : 1,
    width : '100%'
  },
  paginationContainer : {
    justifyContent : 'center',
    alignItems : 'center',
    height : heightScreen * 0.10
  },
  pagination : {
    flexDirection: "row"
  },
  paginationLinkContainer : {

  },
  buttons : {
    marginHorizontal : 10
  },
  paginationLink : {
    marginHorizontal : 10,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:30,
    height:30,
    backgroundColor:'#fff',
    borderRadius:15,
  },
  active : {
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor : '#1e88e5'
  },
  disabled : {
    opacity : .4
  },
  text : {
    fontSize : 16
  }
})
export default ListPagination