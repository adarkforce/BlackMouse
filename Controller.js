import * as React from 'react';
import { View, KeyboardAvoidingView, TextInput, Keyboard, Dimensions } from 'react-native';
//import {PanGestureHandler} from 
import * as Elements from 'react-native-elements'
import * as NativeBase from 'native-base'
import { PanGestureHandler, TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler'
PORT = 3000
class Controller extends React.Component {
    state = {
        keyboardShowing: false,
    }
    constructor({ ip }) {
        super();
        this.state = {
            ip: ip,
            keyboardShowing: false,
        }
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._handleGesture = this._handleGesture.bind(this);
        this._handleStateChange = this._handleStateChange.bind(this);
        this._callMouseLeftClick = this._callMouseLeftClick.bind(this);
        this._callMouseRightClick = this._callMouseRightClick.bind(this);
        this._sendKeyboardKey = this._sendKeyboardKey.bind(this);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    async _handleStateChange(event) {
        var { nativeEvent } = event;
        console.log(nativeEvent);
        try {
            if(nativeEvent.oldState ==4 && nativeEvent.numberOfPointers==1)
            await this._callMouseLeftClick();
        } catch (err) {
            console.warn(err);
        }

    }

    async _sendKeyboardKey(e) {
        key = e.nativeEvent.key
        try {
            await fetch('http://' + this.props.route.params.ip + ":" + PORT + "/KeyHandler", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: key,
                })
            })
        } catch (err) {
            console.warn(err);
        }
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide() {
        this.setState({
            keyboardShowing: false,
        });
    }

    _keyboardDidShow() {
        this.setState({
            keyboardShowing: true,
        });
    }

    async _callMouseRightClick() {
        try {
            await fetch('http://' + this.props.route.params.ip + ":" + PORT + "/MouseRightClick", {
                method: 'GET',
            })
            console.log('mouse right sent');
        } catch (err) {
            console.warn(err);
        }
    }

    async _callMouseLeftClick() {
        try {
            await fetch('http://' + this.props.route.params.ip + ":" + PORT + "/MouseLeftClick", {
                method: 'GET',
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async _handleGesture(event) {
        let { nativeEvent } = event;
       // console.log(event)
       
        try {
            await fetch('http://' + this.props.route.params.ip + ":" + PORT + "/MousePosition", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body:
                    JSON.stringify({
                        mouseDeltaX: nativeEvent.velocityX,
                        mouseDeltaY: nativeEvent.velocityY,
                        deviceSize: JSON.stringify({
                            'x': Math.round(Dimensions.get('window').width),
                            'y': Math.round(Dimensions.get('window').height)
                        })
                    })
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async _callScroll(event){
        try{
            await fetch('http://' + this.props.route.params.ip + ":" + PORT + "/Scroll",{
                mathod: 'POST'
            })
        }catch(err){
            console.warn(err);
        }
    }

    render() {
        return (
            <>
                <NativeBase.Container>

                <TapGestureHandler
                    onHandlerStateChange={this._handleStateChange}>
                    <PanGestureHandler
                        style={{ flex: 1, backgroundColor: 'black' }}
                        onGestureEvent={this._handleGesture}
                        minDist={0}
                        
                    >
                            <View style={{ flex: 1, backgroundColor: 'black' }} ></View>
                            
                    </PanGestureHandler>
                    </TapGestureHandler>

                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: .4 }}>
                        <View style={{ flex: 1, backgroundColor: 'white' }} >
                            <NativeBase.Card style={{ justifyContent: 'center' }}>
                                <TextInput
                                    style={{ height: 0, width: 0, borderWidth: 0 }}
                                    ref={ref => {
                                        this.textInput = ref;
                                    }}
                                    onKeyPress={this._sendKeyboardKey}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoFocus={false}
                                    onSubmitEditing={async (props) => {
                                        console.log(props);
                                        try {
                                            await this._sendKeyboardKey({ nativeEvent: { key: 'enter' } });
                                        } catch (err) {
                                            console.warn(err);
                                        }
                                    }} />

                                <NativeBase.Button style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }} dark onPress={() => {
                                    if (!this.state.keyboardShowing) {
                                        this.textInput.focus();
                                        console.log('keyboardShowing')
                                    }
                                    else {
                                        this.textInput.clear()
                                        Keyboard.dismiss();
                                        console.log('keyboardNOTShowing')
                                    }
                                }}>
                                    <NativeBase.Icon style={{ justifyContent: 'center' }} name='keyboard' type='Entypo'> </NativeBase.Icon>
                                </NativeBase.Button>
                            </NativeBase.Card>
                            <NativeBase.Container style={{ backgroundColor: 'white', margin: 3, flex: 1, flexDirection: "row" }}>
                                <NativeBase.Button onPress={this._callMouseLeftClick} dark style={{ flex: 1, margin: 5, }}></NativeBase.Button>
                                <NativeBase.Button onPress={this._callMouseRightClick} dark style={{ flex: 1, margin: 5, }}></NativeBase.Button>
                            </NativeBase.Container >
                        </View>
                    </KeyboardAvoidingView >
                </NativeBase.Container>
            </>
        );
    }
}

export default Controller;