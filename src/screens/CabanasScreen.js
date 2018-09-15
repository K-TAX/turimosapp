import React, { Component } from 'react'
import { StyleSheet,Image,ActivityIndicator,View } from 'react-native'
import {createStackNavigator} from 'react-navigation'
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import tabBarIcon from '../services/tabBarIcon'
import {httpGet} from '../services/servicesHttp'
import {ENDPOINTS,SERVER} from '../constants'


class CabanasScreen extends Component {
  static navigationOptions = {
    title : "Cabañas",
    tabBarColor: '#1c313a',
    tabBarIcon: tabBarIcon('home')
  };
  state = {
    cabanas : []
  }
  componentDidMount(){
    httpGet(ENDPOINTS.cabanas).then(({data : cabanas,status})=>{
      if(status === 200){
        this.setState({cabanas})
      }
    })
  }
  render() {
    const {cabanas} = this.state;
    return (
      <Container style={styles.root}>
        {cabanas.length === 0 ? 
        (<View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>) :
        <Content>
          {cabanas.map(cabana=>(
            <Card key={cabana.Id}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: `${SERVER.server}/${cabana.Main}`}} />
                  <Body>
                    <Text>{cabana.Nombre}</Text>
                    <Text note>{`Precio : ${cabana.Precio}`}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={{uri: `${SERVER.server}/${cabana.Main}`}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              <CardItem>
                <Left>
                  <Button 
                  onPress={()=>this.props.navigation.navigate("CabanaDetailScreen",cabana)} 
                  primary 
                  transparent>
                    <Icon active type="MaterialIcons" name="toc" />
                    <Text>Ver Detalles</Text>
                  </Button>
                </Left>
                <Right>
                  <Button 
                  onPress={()=>this.props.navigation.navigate("CabanaReservasScreen",cabana)} 
                  primary 
                  transparent>
                    <Icon active type="MaterialIcons" name="date-range" />
                    <Text>Disponibilidad</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          ))}
        </Content>
        }
    </Container>
    )
  }
}

const styles = StyleSheet.create({
  loading : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  }
})
export default CabanasScreen