import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import Controller from './Controller'
import { Button, Icon } from 'native-base';
import Settings from './Settings'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MyHeader from './Header';
const Stack = createStackNavigator();

function GoBackIcon(props) {
  return (
    <Button transparent onPress={props.navigation.goBack} >
      <Icon name='arrow-back' style={{ color: 'black' }} />
    </Button>)
}



SettingsIcon = (props) => {
  return (
    <Button transparent onPress={() => {
      props.navigation.navigate("Settings",props.scene.route.params)
    }}>
      <Icon name='settings' style={{ color: 'black' }} />
    </Button>
  )
}


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator   >
        <Stack.Screen name="Home" component={Home}
          options={{
            header: (props) => {
              return (<MyHeader title="Home"></MyHeader>)
            }
          }} />
        <Stack.Screen name="Controller" component={Controller} options={{
          header: (props) => {
            return (
              <MyHeader
                leftIcon={GoBackIcon(props)}
                rightIcon={SettingsIcon(props)}
                title="Controller"
              ></MyHeader>
            )
          }
        }} />
        <Stack.Screen  name="Settings" component={Settings} options={{
          header: (props) => {
            return(
            <MyHeader title='Settings' leftIcon={GoBackIcon(props)}></MyHeader>)
          },
          gestureEnabled: false,
        }}></Stack.Screen>
      </Stack.Navigator >
    </NavigationContainer>
  );
}

export default App;