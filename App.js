import React from 'react';
import { StyleSheet, View,StatusBar,TouchableOpacity } from 'react-native';
import { Root,StyleProvider,Icon } from 'native-base';
import storeConfig from './src/redux/storeConfig'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import getTheme from './native-base-theme/components';  
import commonColor from './native-base-theme/variables/commonColor';
import { 
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
  SafeAreaView } from 'react-navigation/'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import SignInScreen from './src/screens/SignInScreen';
import CabanasScreen from './src/screens/CabanasScreen';
import CampingScreen from './src/screens/CampingScreen';

const AppTabNavigator = createMaterialBottomTabNavigator({
  Cabanas : {screen : CabanasScreen},
  Camping : {screen : CampingScreen}
},
{
  initialRouteName: 'Cabanas',
  shifting: true,
  activeColor: 'white',
})
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];

  let headerTitle = routeName;
  if(routeName === "Cabanas") headerTitle = "Cabañas";

  return {
    headerTitle,
  };
};
const AppStackNavigator = createStackNavigator({
  AppTabNavigator : {
    screen : AppTabNavigator,
    navigationOptions : ({navigation})=>({
      title : "Turismo El Encuentro",
      headerLeft : (
        <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
          <View style={{paddingHorizontal : 10}}>
            <Icon name="menu" fontSize={24} style={{color : 'white'}} />
          </View>
        </TouchableOpacity>
      ),
      headerStyle : {
        backgroundColor : 'rgb(139, 14, 19)'
      },
      headerTitleStyle : {
        color : 'white'
      }
    })
  }
})

const AppDrawerNavigator = createDrawerNavigator({
  Home : AppStackNavigator
})

const AppNavigator = createSwitchNavigator({
  AuthLoading : AuthLoadingScreen,
  Auth : SignInScreen,
  App : AppDrawerNavigator
})

export default ()=> (
      <Provider store={storeConfig.store}>
        <PersistGate persistor={storeConfig.persistor}>
          <Root>
            <StyleProvider  style={getTheme(commonColor)}> 
              <View style={styles.container}>
                <AppNavigator />
              </View>
            </StyleProvider>
          </Root>
        </PersistGate>
      </Provider>
)
 
const styles = StyleSheet.create({
  root : {
    flex : 1
  },
  container: {
    flex: 1
  },
});
