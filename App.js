import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import Controller from './Controller'
import { Button } from 'native-base';
import { Container, Header, Left, Body, Right, Icon, Title } from 'native-base';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Controller" component={Controller} options={{         
          header: (props) => {
            return (
              <Header>
                <Left>
                  <Button transparent onPress={props.navigation.goBack} >
                    <Icon name='arrow-back' style={{color: 'black'}}/>
                  </Button>
                </Left>
                <Body>
                  <Title>Controller</Title>
                </Body>
                <Right>
                  <Button transparent >
                    <Icon name='settings' style={{color: 'black'}}/>
                  </Button>
                </Right>
              </Header> 
          )
      } }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;