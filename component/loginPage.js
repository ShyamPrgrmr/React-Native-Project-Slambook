import React from 'react';
import { Text,Block,Input,Button, } from 'galio-framework';
import { StyleSheet,View,Image } from 'react-native';
import { Login } from './../api/auth';
import Colors from './../assets/styles/color';
import * as fs from 'expo-file-system';
import * as SQLite from 'expo-sqlite';


const colors = Colors.getColor();
const db = SQLite.openDatabase("local.db");
const url = 'http://192.168.43.216:8080/';

export default class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state={username:'',password:'',showError:false,isLoading:false,errorMsg:''}
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    onRegister=(e)=>{
        e.preventDefault();
        this.props.navigation.navigate("Register");
    }

    componentDidMount=async()=>{
        this.checkDataLocalDatabase();
        try{
            let filename = fs.documentDirectory + 'login/login.json';
            let data = await fs.readAsStringAsync(filename);
            let r1 = JSON.parse(data);
            let username = r1.username;
            let password = r1.password;
            this.login(username,password);
        }catch(err){
            console.log(err)
        }
    }

    writeLoginData=async (username,password)=>{
        try{
            let filename = fs.documentDirectory + 'login/login.json';
            let content = '{"username":"'+username+'" , "password":"'+password+'"}';
            await fs.writeAsStringAsync(filename,content);
        }catch(err){console.log('error'+err)}
    }

    addDataLocalDatabase=(username,password)=>{
          
    }

    checkDataLocalDatabase=()=>{
        
    }

    login=(username,password)=>{
    this.setState({isLoading:true});
        fetch(url+'login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
        }).then(response=>{
           return response.json();
        }).then(async data=>{
            if(data.status){
                this.props.navigation.navigate("Dasboard",{token:data.token})
            }else{
                this.setState({showError:true,errorMsg:'Login Credentials are wrong'})
            }
            this.setState({isLoading:false})

            }).catch(err=>{
            console.log(err)
            
            this.setState({isLoading:false})
        });        
    }

    onLogin=e=>{
        this.setState({isLoading:true});
        fetch(url+'login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }),
        }).then(response=>{
           return response.json();
        }).then(async data=>{
            if(data.status){
                await this.writeLoginData(this.state.username,this.state.password);
                this.props.navigation.navigate("Dasboard",{token:data.token})
            }else{
                this.setState({showError:true,errorMsg:'Login Credentials are wrong'})
            }
            this.setState({isLoading:false})

            }).catch(err=>{
            console.log(err)
            
            this.setState({isLoading:false})
        });
    }

    onChangeUsername=(text)=>{
        this.setState({username:text.nativeEvent.text})     
    }
    onChangePassword=(text)=>{
        this.setState({password:text.nativeEvent.text})
    }

    showError = () => {
        return(
        this.state.showError?<Text style={{color:colors.error}}>{this.state.errorMsg}</Text>:null
        )
    }

    loading=()=>{
        return (this.state.isLoading?
        <View style={styles.loading}>
            <Image  source={{ 
                uri: './assets/spalsh.png' 
                }}></Image>
        </View>:null)
    }

    render(){
        return(
            <Block style={styles.container}>
                {this.loading()}
                <Block style={styles.loginBlock}>
                    <Text style={styles.loginHeading}>Login</Text>
                    {this.showError()}
                    <Text style={styles.label}>Username</Text>
                    <Input style={{borderColor:colors.primaryColor}} placeholder='Username' rounded name='username' value={this.state.username} onChange={this.onChangeUsername}></Input>
                    <Text style={styles.label}>Password</Text>
                    <Input style={{borderColor:colors.primaryColor}} placeholder='Password' rounded password viewPass name='password' value={this.state.password} onChange={this.onChangePassword}></Input>
                    <Button round uppercase style={{width:'100%',marginTop:10,backgroundColor:colors.primaryColor}} onPress={this.onLogin}>Login</Button>
                    <Button round uppercase style={{width:'100%',marginTop:10,backgroundColor:colors.primaryColor}} onPress={this.onRegister}>Register</Button>
                </Block>
            </Block>
        );
    }
}


const styles = StyleSheet.create({
    loading:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        backgroundColor:colors.transperentLoading,
        zIndex:100,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    container:{
        position:'relative',
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      width:'100%',
      backgroundColor:colors.secondaryColor
    },
    loginBlock:{
      backgroundColor:colors.boxBackColor,
      borderRadius:20,
      padding:10,
      width:'90%',
    },
    loginHeading:{
      fontSize:42,
      color:colors.primaryColor,
      marginBottom:10,
      textAlign:'center'
    },
    label:{
      fontSize:16,
      color:colors.primaryColor
    }
    });