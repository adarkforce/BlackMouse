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

const PORT = 3000;


class Home extends React.Component {

  newList = [];
  computerIcon = <Elements.Icon
    //reverse
    name='desktop'
    type='font-awesome'
    color='black'
  />


  reloadIcon = <Elements.Icon
    name='cached'
    type='material'
    color='white'
  />

  arrowIcon = <Elements.Icon
    name='chevron-right'
    type='font-awesome' />
  constructor(props) {
    super(props);

    this.state = {
      serverList: [],
      isOverlayVisible: false,
    };
    this.sendRequest = this.sendRequest.bind(this);
    this.lookForAvailableNetworks = this.lookForAvailableNetworks.bind(this);
    this.onPressReloadButton = this.onPressReloadButton.bind(this);
    //
  }
  sendRequest = async (ip_address) => {
    try {
      await fetch("http://" + ip_address + ":" + PORT + "/", {
        method: 'get',
      })
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
          if (resJson) {
            this.newList = this.state.serverList
            var index = this.newList.findIndex(x => x.key == resJson.name)
            index === -1 && this.newList.push({ key: resJson.name,ip:ip_address });
            console.log(this.newList);
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
    devices=["192.168.1.26",]   
      for (var i = 0; i < devices.length; i++) { 
        console.log(devices[i]);
        try {
          await this.sendRequest(devices[i]);
        } catch (err) {
          this.setState((previousState) => ({
            serverList: previousState.serverList,
            isOverlayVisible: false,
          }));
          console.warn('lookfor av', err);
        }
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


  activeOpacity = 1.0
  render() {
    return (
      <>
        <Elements.Overlay animated isVisible={this.state.isOverlayVisible}>
          <ActivityIndicator style={{ flex: 1, }} size="large" color="#000000" />
        </Elements.Overlay>
        <Elements.Tile
          imageSrc={require('./2.jpg')}
          title="Iniziamo!"
          activeOpacity={this.activeOpacity}
          featured
          caption="Seleziona un computer sul quale connetterti..."
          titleStyle={{ color: 'black', }}
          captionStyle={{ color: 'black', }}
        />

        <View style={styles.availableListContainer}>
          <ScrollView>
            {this.state.serverList.map((item) => (
              <Elements.ListItem icon
                key={item.key}
                title={item.key}
                leftIcon={this.computerIcon}
                rightIcon={this.arrowIcon}
                onPress={() => this.props.navigation.navigate('Controller', {ip: item.ip})}
              ></Elements.ListItem>)
            )
            }
          </ScrollView>
        </View>
        <View style={styles.reloadIconContainer}>
          <NativeBase.Button transparent onPress={this.onPressReloadButton} style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf:'flex-start',
            alignContent: 'center'

          }} light>
            <NativeBase.Icon name='redo' style={{color: 'black'}} type='FontAwesome5' />
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
    flex: 1,
    flexDirection: 'row'
  }
});

export default Home;
