import React from 'react';
import { StyleSheet, View,Platform,StatusBar } from 'react-native';
import { Root,StyleProvider,Icon,Thumbnail,Text } from 'native-base';
import { Portal } from 'react-native-paper';
import storeConfig from './src/redux/storeConfig'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import getTheme from './native-base-theme/components';  
import commonColor from './native-base-theme/variables/commonColor';
import { 
  createSwitchNavigator,
  createStackNavigator,
   } from 'react-navigation';
import Expo from 'expo'
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {cleanUserSession} from './src/redux/actions/auth'
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import SignInScreen from './src/screens/SignInScreen';
import NewReservaScreen from './src/screens/NewReservaScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReservasScreen from './src/screens/ReservasScreen';
import ReservasDetailScreen from './src/screens/ReservasDetailScreen';
import AbonosScreen from './src/screens/AbonosScreen';
import 'moment/locale/es';

moment.locale('es');

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Mar','Abr','May','Jun','Jul.','Ago','Sep.','Oct.','Nov.','Dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.']
};

LocaleConfig.defaultLocale = 'es';

const AppTabNavigator = createMaterialBottomTabNavigator({
  Principal : {screen : HomeScreen},
  Reservas : {screen : ReservasScreen}
},
{
  initialRouteName: 'Principal',
  shifting: true,
  activeColor: 'white',
})
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];

  let headerTitle = routeName;
  if(routeName === "Principal") headerTitle = "Turismo El Encuentro";
  return {
    headerTitle : (<Text style={{color : 'white'}}>{headerTitle}</Text>),
  };
};
const AppStackNavigator = createStackNavigator({
  AppTabNavigator : {
    screen : AppTabNavigator,
    navigationOptions : ({navigation})=>({
      headerLeft : (
        <Thumbnail 
        source={require("./assets/icons/icon.png")} 
        style={{height : 40,width : 40}} />
      ),
      headerRight : (
        <Menu >
          <MenuTrigger>
            <Icon style={{color : 'white'}} type="MaterialIcons" name="more-vert" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() =>{
              storeConfig.store.dispatch(cleanUserSession());
              navigation.navigate("Auth");
              }} >
              <View style={{flexDirection : 'row',alignItems : 'center'}}>
                <Icon type="MaterialIcons" name="exit-to-app" />
                <Text>Salir</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )
    })
  },
  NewReservaScreen : {
    screen : NewReservaScreen
  },
  ReservasDetailScreen : {
    screen : ReservasDetailScreen
  },
  AbonosScreen : {
    screen : AbonosScreen
  }
},{
  mode : "modal",
  navigationOptions : {
    headerStyle : {
      paddingHorizontal : 12,
      marginTop : Platform.OS === "android" ?  -Expo.Constants.statusBarHeight : 0,
      backgroundColor : '#282828'
    },
    gesturesEnabled : true,
    headerTintColor: 'white'
  }
})

const AppNavigator = createSwitchNavigator({
  AuthLoading : AuthLoadingScreen,
  Auth : SignInScreen,
  App : AppStackNavigator
})

export default ()=> (
      <Provider store={storeConfig.store}>
        <PersistGate persistor={storeConfig.persistor}>
            <StyleProvider style={getTheme(commonColor)}> 
              <MenuProvider>
                <View style={styles.container}>
                  <StatusBar backgroundColor="#000000" />
                  <Root>
                    <Portal.Host>
                      <AppNavigator />
                    </Portal.Host>
                  </Root>
                </View>
              </MenuProvider>
            </StyleProvider>
        </PersistGate>
      </Provider>
)
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
