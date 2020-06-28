import 'react-native-gesture-handler';
import React from 'react';
import { View,ScrollView,StyleSheet } from 'react-native';
import { Text } from 'galio-framework';
import { StackActions,NavigationActions } from 'react-navigation';
import CreateSlam from './CreateSlam';
import ShowSlamAnswer from './ShowSlamAnswer';
import AnswerQuestion from './AnswerQuestion';
import Profile from './profile';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Colors from './../assets/styles/color';
import { color } from 'react-native-reanimated';
const colors = Colors.getColor();

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.resetNavigation();
        this.state={token:this.props.route.params.token}
    }

    resetNavigation(){
        
    }
    
    Tab = createMaterialBottomTabNavigator();

    //<ion-icon name="book-outline"></ion-icon>
    render(){
        return(
        <NavigationContainer independent={true} >
            <this.Tab.Navigator 

                screenOptions={({ route }) => ({tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let backgroundColor;
                    let Icocolor;

                    if (route.name === 'CreateSlam') {
                        iconName = focused ? 'ios-add' : 'ios-add';
                        backgroundColor = focused ? colors.secondaryColor : '#fff';
                        Icocolor = focused ? colors.fontColor : colors.grey;
                    } else if (route.name === 'AnswerList') {
                        iconName = focused ? 'ios-list' : 'ios-list';
                        backgroundColor = focused ? colors.secondaryColor : '#fff';
                        Icocolor = focused ? colors.fontColor : colors.grey;
                    } else if(route.name === 'AnswerQue'){
                        iconName = focused ? 'md-book' : 'md-book';
                        backgroundColor = focused ? colors.secondaryColor : '#fff';
                        Icocolor = focused ? colors.fontColor : colors.grey;
                    }else if(route.name === 'Profile'){
                        iconName = focused ? 'ios-person' : 'ios-person';
                        backgroundColor = focused ? colors.secondaryColor : '#fff';
                        Icocolor = focused ? colors.fontColor : colors.grey;
                    }

                    return <Ionicons name={iconName}  size={size} color={Icocolor} />;
                    },
                })}
                

                sceneAnimationEnabled={false}
                barStyle={{
                    backgroundColor:colors.secondaryColor,
                }}
                
            
            >
              <this.Tab.Screen name="CreateSlam" initialParams={
                  {
                      token:this.state.token
                  }
              } options={{
                  title:'Create',
              }} component={CreateSlam} />
              <this.Tab.Screen name="AnswerList" component={ShowSlamAnswer} initialParams={
                  {
                      token:this.state.token
                  }
              } options={{
                  title:'Answers',
              }} />
              <this.Tab.Screen name="AnswerQue" component={AnswerQuestion}
              initialParams={
                {
                    token:this.state.token
                }
            }
              options={{
                  title:'Slambooks',
              }} />

             
            <this.Tab.Screen name="Profile" initialParams={
                  {
                      token:this.state.token
                  }
              } options={{
                  title:'Profile',
              }} component={Profile} />

            </this.Tab.Navigator>
        </NavigationContainer>)
    }
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      width:'100%',
      backgroundColor:colors.secondaryColor
    } 
});