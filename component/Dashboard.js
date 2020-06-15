import React from 'react';
import { View,ScrollView,StyleSheet } from 'react-native';
import { Text } from 'galio-framework';
import { StackActions,NavigationActions } from 'react-navigation';
import CreateSlam from './CreateSlam';
import ShowSlamAnswer from './ShowSlamAnswer';
import AnswerQuestion from './AnswerQuestion';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
    
    Tab = createBottomTabNavigator();

    //<ion-icon name="book-outline"></ion-icon>
    render(){
        return(
        <NavigationContainer independent={true}>
            <this.Tab.Navigator 
              
                screenOptions={({ route }) => ({tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'CreateSlam') {
                        iconName = focused ? 'ios-add-circle': 'ios-add';
                    } else if (route.name === 'AnswerList') {
                        iconName = focused ? 'ios-list-box' : 'ios-list';
                    } else if(route.name === 'AnswerQue'){
                        iconName = focused ? 'md-square' : 'md-square-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={colors.primaryColor} />;
                    },
                })
                }
                tabBarOptions={{
                    activeTintColor:colors.primaryColor,
                    inactiveTintColor: colors.grey,
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