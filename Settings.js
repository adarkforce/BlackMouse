import * as React from 'react';
import { StyleSheet } from 'react-native'
import { exp } from 'react-native-reanimated';
import * as NativeBase from 'native-base'
import { Slider } from 'react-native-elements';
import WebServiceClient from './api/WebServiceClient';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        console.log()
        this.webServiceCaller = new WebServiceClient(props.route.params.ip, props.route.params.port)
        this.state = {
            pointerValue: 0,
            scrollValue: 0,
        }


    }

    componentDidMount() {
        this.getScrollValue();
        this.getPointerValue();
    }

    getScrollValue = () => {
        this.webServiceCaller.getScrollSensitivity()
            .then((res) => res.json())
            .then((resJson) => {
                console.log(resJson);
                this.setState({scrollValue: resJson.scrollValue / 2});
            })
            .catch((err) => {
                console.warn(err);
            })
    }

    getPointerValue = () => {
        this.webServiceCaller.getPointerSensitivity()
            .then((res) => res.json())
            .then((resJson) => {
                console.log(resJson);
                this.setState({pointerValue: resJson.pointerValue * 4});
            })
            .catch((err) => {
                console.warn(err);
            })
    }

    postMousePointerSensitivity = async (value) => {
        try {
            await this.webServiceCaller.postPointerSensitivity(value / 4)
        } catch (err) {
            console.warn(err)
        }
    }

    postMouseScrollSensitivity = async (value) => {
        try{
            await this.webServiceCaller.postScrollSensitivity(value*2);
        }catch(err){
            console.warn(err);
        }
    }

    render() {
        return (
            <NativeBase.Container>
                <NativeBase.Content>
                    <NativeBase.Card>
                        <NativeBase.CardItem header>
                            <NativeBase.Text>Mouse Pointer Sensitivity</NativeBase.Text>
                        </NativeBase.CardItem>
                        <NativeBase.CardItem>
                            <NativeBase.Body style={styles.slider} >
                                <Slider
                                    thumbTintColor={'black'}
                                    orientation="horizontal"
                                    value={this.state.pointerValue}
                                    onSlidingComplete={this.postMousePointerSensitivity}></Slider>
                            </NativeBase.Body>
                        </NativeBase.CardItem>
                    </NativeBase.Card>
                    <NativeBase.Card>
                        <NativeBase.CardItem header>
                            <NativeBase.Text>Scroll Sensitivity</NativeBase.Text>
                        </NativeBase.CardItem>
                        <NativeBase.CardItem>
                            <NativeBase.Body style={styles.slider} >
                                <Slider
                                    thumbTintColor={'black'}
                                    orientation="horizontal"
                                    value={this.state.scrollValue}
                                    onSlidingComplete={this.postMouseScrollSensitivity}></Slider>
                            </NativeBase.Body>
                        </NativeBase.CardItem>
                    </NativeBase.Card>
                </NativeBase.Content>
            </NativeBase.Container>)
    }
}

styles = StyleSheet.create({
    slider: {
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center',
        color: 'black'
    }
})

export default Settings;