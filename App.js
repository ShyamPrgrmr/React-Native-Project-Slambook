import React from 'react';
import { Button } from 'react-native';
import LoginPage from './component/loginPage';
import RegisterPage from './component/registerPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './component/Dashboard';
import Colors from './assets/styles/color';
const colors = Colors.getColor();
export default class App extends React.Component{
  Stack = createStackNavigator();

  constructor(props){
    super(props);
    this.state={isLogedIn:true,isRegister:false};
  }
  
  register=()=>{
    this.setState({isRegister:true,isLogedIn:false})
  }

  componentDidMount(){
    fetch('http://192.168.43.216:8080/').then(data=>{
        
      }).catch(err=>{
        console.log(err);
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

