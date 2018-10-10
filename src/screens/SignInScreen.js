import React, { Component } from 'react'
import {StyleSheet,Dimensions,Image,Keyboard} from 'react-native'
import logo from '../images/logo.png'
import background from '../images/background.jpg'
import { Container, View, Icon, Text,Item, Input } from 'native-base';
import { Button as ButtonPaper } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux'
import {setUserSession} from '../redux/actions/auth'
const {height: screenHeight} = Dimensions.get('screen');
const {width: screenWidth} = Dimensions.get('screen');
const logoSize = {
    width : screenWidth * 0.5,
    height : screenWidth * 0.5
}

class SignInScreen extends Component { 
state = {
    keyboardOpen : false,
    email : '',
    password : '',
    buttonLoading : false
}
componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
}
componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
}
_keyboardDidShow = () => {
   this.setState({keyboardOpen : true})
}

_keyboardDidHide = ()=> {
  this.setState({keyboardOpen : false})
}
onSignIn = async ()=> {
    const {email,password} = this.state;
    this.setState({buttonLoading : true})
    let ok = await this.props.setUserSession(email,password);
    this.setState({buttonLoading : false},()=>{
        if(ok){
            this.props.navigation.navigate("App")
        }
    })
}
render() {
    const {keyboardOpen,email,password} = this.state;
    return (
        <Container>
            <Image source={background} style={styles.backgroundImage} />
            <View style={styles.content}>
                <View style={styles.bodyContent}>
                    {!keyboardOpen &&
                    <View style={styles.logoContainer}>
                        <Image 
                            style={styles.logo}  
                            source={logo} />
                    </View>
                    }
                    <View style={[styles.inputsContainer,keyboardOpen && {flex : 1,justifyContent : 'center'}]}>
                        <Animatable.View animation="slideInLeft">
                            <Item 
                            style={[{backgroundColor : 'white',paddingLeft : 10}
                            ,keyboardOpen && styles.inputMarginVertical]}
                            rounded>
                                <Input
                                keyboardType="email-address"
                                value={email}
                                onChangeText={email => this.setState({email})}
                                placeholder='Email' />
                            </Item>
                        </Animatable.View>
                        <Animatable.View animation="slideInRight">
                            <Item 
                            style={[{backgroundColor : 'white',paddingLeft : 10},keyboardOpen && styles.inputMarginVertical]}
                            rounded>
                                <Input 
                                value={password}
                                onChangeText={password => this.setState({password})}
                                secureTextEntry
                                placeholder='Password' />
                            </Item>
                        </Animatable.View>
                        <ButtonPaper 
                        loading={this.state.buttonLoading}
                        icon="keyboard-arrow-right" 
                        mode="outlined" 
                        color = '#62B1F6'
                        style={[{backgroundColor : '#f5f5f5'},
                        keyboardOpen && styles.inputMarginVertical]}
                        onPress={this.onSignIn}>
                            INICIAR SESIÓN
                        </ButtonPaper>
                    </View>
                </View>
            </View>
        </Container>
    )
  }
}

const styles = StyleSheet.create({
    content : {
        flex : 1,
        width : '100%'
    },
    backgroundImage: {
        opacity : .8,
        position : 'absolute',
        width : null,
        height : null,
        top : 0,
        bottom : 0,
        left:0,
        right : 0,
        resizeMode: 'cover', // or 'stretch'
    },
    logoContainer : {
        flex : .4,
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    logo : {
        width : logoSize.width,
        height : logoSize.height
    },
    inputMarginVertical : {
        marginVertical : 10
    },
    bodyContent : {
        flex : 1,
        width : '100%',
        paddingHorizontal : screenWidth * 0.05,
        height : screenHeight * 0.8
    },
    inputsContainer : {
        flex : .5,
        justifyContent : 'space-around',
        width : '100%'
    }
})

const mapDispatchToProps = dispatch => ({
    setUserSession : (email,password,nav)=>dispatch(setUserSession(email,password,nav))
})
export default connect(null,mapDispatchToProps)(SignInScreen)