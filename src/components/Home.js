import React from 'react';
import * as Elements from 'react-native-elements'
import * as NativeBase from 'native-base'
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import LANScanner from "../api/LANScanner"
import { color } from 'react-native-reanimated';

computerIcon = <Elements.Icon
  name='desktop'
  type='font-awesome'
  color='white'
/>

arrowIcon = <Elements.Icon
  name='chevron-right'
  type='font-awesome' 
  color='white'/>

class Home extends React.Component {

  newList = [];

  constructor(props) {
    super(props);

    this.state = {
      serverList: [],
      isOverlayVisible: false,
    };
    this.lanscan = new LANScanner()
    this.sendRequest = this.sendRequest.bind(this);
    this.lookForAvailableNetworks = this.lookForAvailableNetworks.bind(this);
    this.onPressReloadButton = this.onPressReloadButton.bind(this);
    
  }

  componentDidMount(){
    this.lookForAvailableNetworks()
    .then(()=>{
      console.log('lookup successful');
    })
    .catch((err)=>{
      console.warn(err);
    });
  }

  sendRequest = async (ip_address, port_number) => {
    try {
      await fetch("http://" + ip_address + ":" + port_number + "/", {
        method: 'get',
      })
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
          if (resJson) {
            this.newList = this.state.serverList
            var index = this.newList.findIndex(x => x.key == resJson.name)
            index === -1 && this.newList.push({ key: resJson.name, ip: ip_address, port: port_number });
            this.setState(() => ({
              serverList: this.newList,
              isOverlayVisible: false,
            }));
            console.log('FOUND');
          }
        })
    } catch (err) {
      console.warn(err);
    }
  }
  lookForAvailableNetworks = async () => {
    console.log("clicked");
    this.setState({serverList: []})
    try {
      await this.lanscan.scan(this.sendRequest);
    } catch (err) {
      console.log(err);
    }
  }


  onPressReloadButton = () => {
    this.setState((previousState) => ({
      serverList: previousState.serverList,
      isOverlayVisible: true,
    }))
    this.lookForAvailableNetworks()
      .then(() => {
        this.setState((previousState) => ({
          serverList: previousState.serverList,
          isOverlayVisible: false,
        }));
      })
      .catch(() => {
        this.setState((previousState) => ({
          serverList: previousState.serverList,
          isOverlayVisible: false,
        }));
      });

  }
  render() {
    return (
      <>
        <Elements.Overlay fullScreen overlayStyle={{backgroundColor:'black'}} animated isVisible={this.state.isOverlayVisible}>
          <ActivityIndicator style={{ flex: 1, }} size="large" color="white" />
        </Elements.Overlay>
        <Elements.Tile
          imageSrc={require('../img/black.jpg')}
          title="Let's start!"
          activeOpacity={1.0}
          featured
          caption="Select a computer for connection..."
          titleStyle={{ color: 'white'}}
          captionStyle={{ color: 'white', }}
          
        />

        <View style={styles.availableListContainer}>
          <ScrollView>
            {this.state.serverList.map((item) => (
              <Elements.ListItem icon
                key={item.key}
                title={item.key}
                subtitle={item.ip}
                leftIcon={computerIcon}
                rightIcon={arrowIcon}
                onPress={() => this.props.navigation.navigate('Controller', { ip: item.ip, port: item.port })}
                containerStyle={{backgroundColor:'black'}}
                titleStyle={{color:'white'}}
                subtitleStyle={{color:'white'}}
              ></Elements.ListItem>)
            )
            }
          </ScrollView>
        </View>
        <View style={styles.reloadIconContainer}>
          <NativeBase.Button onPress={this.onPressReloadButton} style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'baseline',
            alignContent: 'center',
            borderRadius: 50,
            
          }}  dark>
            <NativeBase.Icon name='redo' style={{ color: 'white' }} type='FontAwesome5' />
          </NativeBase.Button>
        </View>
      </>
    );
  }

}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  availableListContainer: {
    flex: 1,

  },
  body: {
    backgroundColor: Colors.white,
  },
  buttonContainer: {

  },
  button: {
    height: 100,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  reloadIconContainer: {
    justifyContent: "center",
    flex: .5,
    flexDirection: 'row',
    
  }
});

export default Home;
