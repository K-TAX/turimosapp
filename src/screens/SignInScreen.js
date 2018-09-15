import React, { Component } from 'react'
import {StyleSheet,Dimensions,Image,Keyboard} from 'react-native'
import logo from '../images/logo.png'
import curved_mask from '../images/curved_mask.png'
import curved_mask_inverted from '../images/curved_mask_inverted.png'
import { Container, View, Icon, Button, Text,Footer,Form, Item, Input } from 'native-base';
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
    email : 'arivera@groupbi.cl',
    password : '1313'
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
    this.props.setUserSession(email,password,this.props.navigation);
}
render() {
    const {keyboardOpen,email,password} = this.state;
    return (
        <Container>
            <View style={styles.content}>
                <View style={styles.topContent}>
                    <Image 
                    resizeMode="cover" 
                    style={styles.curvedMask}  
                    source={curved_mask} />
                </View>
                <View style={styles.bodyContent}>
                    {!keyboardOpen &&
                    <View style={styles.logoContainer}>
                        <Image 
                            style={styles.logo}  
                            source={logo} />
                    </View>
                    }
                    <View style={styles.inputsContainer}>
                        <Animatable.View animation="slideInLeft">
                            <Item rounded>
                                <Input
                                value={email}
                                onChangeText={email => this.setState({email})}
                                placeholder='Email' />
                            </Item>
                        </Animatable.View>
                        <Animatable.View animation="slideInRight">
                            <Item rounded>
                                <Input 
                                value={password}
                                onChangeText={password => this.setState({password})}
                                secureTextEntry
                                placeholder='Password' />
                            </Item>
                        </Animatable.View>
                        <Button onPress={this.onSignIn} iconLeft block rounded primary>
                            <Icon name='login' type="Entypo" />
                            <Text>INICIAR SESIÓN</Text>
                        </Button>
                    </View>
                </View>
            </View>
            <View style={styles.bottomContent}>
                <Image 
                resizeMode="cover" 
                style={styles.curvedMaskInverted}  
                source={curved_mask_inverted} />
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
    topContent : {
        position : 'relative',
        width : '100%',
        height : screenHeight * 0.1,
        backgroundColor : 'rgb(128, 127, 0)',
        alignItems : 'center'
    },
    bottomContent : {
        position : 'relative',
        width : '100%',
        height : screenHeight * 0.1,
        backgroundColor : 'rgb(128, 127, 0)',
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    bodyContent : {
        flex : 1,
        width : '100%',
        paddingHorizontal : screenWidth * 0.05,
        height : screenHeight * 0.8
    },
    inputsContainer : {
        flex : .6,
        justifyContent : 'space-around',
        width : '100%'
    },
    curvedMask : {
        width : '100%',
        position : 'absolute',
        bottom : 0,
        left : 0,
        right : 0
    },
    curvedMaskInverted : {
        width : '100%',
        position : 'absolute',
        top : 0,
        left : 0,
        right : 0
    }
})

const mapDispatchToProps = dispatch => ({
    setUserSession : (email,password,nav)=>dispatch(setUserSession(email,password,nav))
})
export default connect(null,mapDispatchToProps)(SignInScreen)