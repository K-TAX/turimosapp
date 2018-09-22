import React, { Component } from 'react'
import { TouchableOpacity, View,StyleSheet,Dimensions,Text,FlatList,ActivityIndicator } from 'react-native'
import _ from 'lodash'
const {width : widthScreen ,height : heightScreen} = Dimensions.get("window")

class ListPagination extends Component {
  state = {
    paginationIndex : 0,
    paginationLimitIndex : 0,
    paginationPages : [],
    loading : false,
    dataList : {
      data : [],
      paginationPages : []
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data != this.props.data){
      this.setState({ dataList : this.loadData()})
    } 
  }
  async componentDidMount(){
    await this.loadData()
  }
  async componentDidUpdate(nextProps,nextState){
    if(this.state.paginationIndex != nextState.paginationIndex){
      await this.loadData()
    }
  }
  loadData = async ()=>{
    this.setState({loading : true},()=>{
      setTimeout(()=>{
        return new Promise(resolve=>{
          const { paginationLimit,data,rowsPerPage } = this.props;
          const {paginationIndex,paginationLimitIndex} = this.state;   
          const paginationPages = [];
          const dataChuck = _.chunk(data,rowsPerPage);
          if(data.length > 0){
            const allPages = _.map(dataChuck,(x,i)=>(
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
          this.setState({ dataList : { data : dataChuck , paginationPages}},()=>{
            this.setState({loading : false})
            resolve();
          })
        })
      },500)
    })
  }
  render() {
    const { renderItem,parentState } = this.props;
    const { paginationIndex,loading } = this.state;
    const { data,paginationPages } = this.state.dataList;
    return (
      <View style={styles.root}>
          <View style={styles.itemsContainer}>
            {!loading ? (
              <FlatList 
                data={_.map(data[paginationIndex])}
                extraData={parentState}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.Id}
              /> 
            ):(
              <View style={styles.loading}>
                  <ActivityIndicator size="large" />
              </View>
            )}
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
  loading : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
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