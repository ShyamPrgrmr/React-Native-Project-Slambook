import React from 'react';
import { ToastAndroid,BackHandler,Alert } from 'react-native';
import {Button, Toast } from 'galio-framework'
import LoginPage from './component/loginPage';
import RegisterPage from './component/registerPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './component/Dashboard';

import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as fs from 'expo-file-system';
import Colors from './assets/styles/color';
const colors = Colors.getColor();
const db = SQLite.openDatabase("local.db");

export default class App extends React.Component{
  Stack = createStackNavigator();

  constructor(props){
    super(props);
    this.state={isLogedIn:true,isRegister:false,url:'http://192.168.43.216:8080/'};
  }
  
  register=()=>{
    this.setState({isRegister:true,isLogedIn:false})
  }

  createLocalDatabase = async () => {
   
  }

  fileCreate= async ()=>{
    try{
      let info  = await fs.getInfoAsync(fs.documentDirectory + 'login/');
    
      if(!info.exists){
        await fs.makeDirectoryAsync(fs.documentDirectory + 'login/');
        console.log('Directory created!');
      }

      info = await fs.getInfoAsync(fs.documentDirectory + 'login/login.json');
      
      if(!info.exists){
        console.log('File created!');
        await fs.writeAsStringAsync(fs.documentDirectory + 'login/login.json','{}');
      }

    }catch(err){
      console.log(err);
    }
  }

   getPermissions= async ()=>{
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    const storageStatus = (await Permissions.askAsync(Permissions.CAMERA_ROLL)).status;
    if(storageStatus!=='granted'){
      ToastAndroid.show('Failed to get storage permissions', ToastAndroid.SHORT);
    }else{
    }
   
  }

  logoutAction = () => {
    Alert.alert("Logout", "do you really wants to logout?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: async () => {
          let filename = fs.documentDirectory + 'login/login.json';
          let content = '{"username":"'+' '+'" , "password":"'+' '+'"}';
          await fs.writeAsStringAsync(filename,content);  
        BackHandler.exitApp()
      
      } }
    ]);
    return true;
  };


  componentDidMount = async ()=>{
    await this.getPermissions();
    await this.createLocalDatabase();
    await this.fileCreate();

    await fetch(this.state.url).then(data=>{
      ToastAndroid.show('Welcome!', ToastAndroid.SHORT);
      }).catch(err=>{
        alert("Please Enable your mobile data or wifi and try to restart the app!");
      });
  }

  render(){
      return( 
      <NavigationContainer>
        <this.Stack.Navigator>
  
          <this.Stack.Screen name="Home" options={{
            headerTitle:"Login",
            headerStyle:{
              backgroundColor:colors.boxBackColor,  
            },
            headerTintColor: colors.primaryColor,
            }} component={LoginPage}/>

            <this.Stack.Screen name="Dasboard" options={{headerTitle:"Slam Book",
            headerStyle:{
              backgroundColor:colors.boxBackColor,  
            },
            headerLeft:null,
            headerRight:() => (
              <Button
                    onlyIcon icon="ios-exit" 
                    iconFamily="ionicon" 
                    iconSize={28} color='#fff' 
                    iconColor={colors.error} 
                
                   onPress={() => this.logoutAction() } style={{marginRight:10,height:10,width:28}}>Logout</Button>
            ),
            
            headerTintColor: colors.primaryColor
            }} component={Dashboard}/>


          <this.Stack.Screen name="Register" options={{
            headerTitle:"Register",
            headerStyle:{
              backgroundColor:colors.boxBackColor,  
            },
            headerTintColor: colors.primaryColor
            }} component={RegisterPage}/>
        
        </this.Stack.Navigator>
      </NavigationContainer>
      )
  }
}

