import * as React from 'react';
import { View, KeyboardAvoidingView, TextInput, Keyboard, StyleSheet, Dimensions } from 'react-native';
//import {PanGestureHandler} from 
import * as Elements from 'react-native-elements'
import * as NativeBase from 'native-base'
import { PanGestureHandler, TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler'
import WebServiceClient from './api/WebServiceClient';
PORT = 3000
STATE_IN_WHICH_USER_CLICKS = 4;
class Controller extends React.Component {



    state = {
        keyboardShowing: false,
    }
    constructor(props) {
        super(props);
        console.log(props.route.params.port)
        this.ip = props.route.params.ip
        this.port = props.route.params.port
        this.state = {
            ip: props.route.params.ip,
            port: props.route.params.port,
            keyboardShowing: false,
        }
        this.webServiceCaller = new WebServiceClient(props.route.params.ip, props.route.params.port);
        console.log(this.webServiceCaller.ip);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._handlePanGesture = this._handlePanGesture.bind(this);
        this._handleTap = this._handleTap.bind(this);
        this._callMouseLeftClick = this._callMouseLeftClick.bind(this);
        this._callMouseRightClick = this._callMouseRightClick.bind(this);
        this._sendKeyboardKey = this._sendKeyboardKey.bind(this);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    async _handleTap(event) {
        var { nativeEvent } = event;
        console.log(nativeEvent);
        try {
            if (nativeEvent.oldState == STATE_IN_WHICH_USER_CLICKS && nativeEvent.numberOfPointers == 1)
                await this.webServiceCaller.callMouseLeftClick();
        } catch (err) {
            console.warn(err);
        }
    }

    async _sendKeyboardKey(e) {
        key = e.nativeEvent.key
        try {
            await this.webServiceCaller.sendKeyboardKey(key);
        } catch (err) {
            console.warn(err);
        }
    }

    componentDidMount() {
        //this.webServiceCaller = new WebServiceClient(this.state.ip,this.state.port);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
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
            await this.webServiceCaller.callMouseRightClick();
        } catch (err) {
            console.warn(err);
        }
    }

    async _callMouseLeftClick() {
        try {
            await this.webServiceCaller.callMouseLeftClick();
        } catch (err) {
            console.warn(err);
        }
    }

    async _handlePanGesture(event) {
        var { nativeEvent } = event;
        if (nativeEvent.numberOfPointers == 2) {
            this._callScroll(nativeEvent);
        } else if (nativeEvent.numberOfPointers == 1){
            try {
                await this.webServiceCaller.moveMouse(event);
            } catch (err) {
                console.warn(err);
            }
        }
    }

    async _callScroll(event) {
        try {
            await this.webServiceCaller.callScroll(event);
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        return (
            <>
                <NativeBase.Container>
                    <TapGestureHandler
                        onHandlerStateChange={this._handleTap}>
                        <PanGestureHandler
                            style={{ flex: 1, backgroundColor: 'black' }}
                            onGestureEvent={this._handlePanGesture}
                            minDist={0}                            
                        >
                            <View style={{ flex: 1, backgroundColor: 'black' }} ></View>
                        </PanGestureHandler>
                    </TapGestureHandler>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: .4 }}>
                        <View style={{ flex: 1, backgroundColor: 'white' }} >
                            <NativeBase.Card style={{ justifyContent: 'center', flex: 1 }}>
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
                                        try {
                                            await this._sendKeyboardKey({ nativeEvent: { key: 'enter' } });
                                        } catch (err) {
                                            console.warn(err);
                                        }
                                    }} />

                                <NativeBase.Button style={{ justifyContent: 'center', alignItems: 'center', margin: 2 }} dark
                                    onPress={() => {
                                        if (!this.state.keyboardShowing) {
                                            this.textInput.focus();
                                        }
                                        else {
                                            this.textInput.clear()
                                            Keyboard.dismiss();
                                        }
                                    }}>
                                    <NativeBase.Icon style={{ justifyContent: 'center' }} name='keyboard' type='Entypo'> </NativeBase.Icon>
                                </NativeBase.Button>
                            </NativeBase.Card>
                            <NativeBase.Container style={{ backgroundColor: 'white', margin: 2, flex: 2, flexDirection: "row" }}>
                                <NativeBase.Button onPress={this._callMouseLeftClick} dark style={styles.mouseButton}></NativeBase.Button>
                                <NativeBase.Button onPress={this._callMouseRightClick} dark style={styles.mouseButton}></NativeBase.Button>
                            </NativeBase.Container >
                        </View>
                    </KeyboardAvoidingView >
                </NativeBase.Container>
            </>
        );
    }
}
const styles = StyleSheet.create({
    mouseButton: {
        flex: 1, margin: 3,
    }
})
export default Controller;