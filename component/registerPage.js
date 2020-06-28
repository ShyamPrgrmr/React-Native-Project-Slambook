import React from 'react';
import { Text,Block,Input,Button,Toast } from 'galio-framework';
import { StyleSheet,ScrollView,View } from 'react-native';
import FormValidator from './../helper/formValidator'
import Register from './../api/auth';
import Colors from './../assets/styles/color';
const colors = Colors.getColor();

export default class RegisterPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            firstname:'',
            lastname:'',
            mobile:'',
            username:'',
            password:'',
            isShowState:false,
            msg:'',
            loading:false
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    validate=()=>{
        let error = []
        if(FormValidator.validateName(this.state.firstname)&&
           FormValidator.validateName(this.state.lastname)&&
           FormValidator.validatePhone(this.state.mobile)&&
           FormValidator.validatePassword(this.state.password)&&
           FormValidator.validatePassword(this.state.username)
        ){return true}
        return false;
    }

    onSubmit=(e)=>{
        e.preventDefault();

        this.setState({loading:true},()=>{
            if(this.validate()){
           
                fetch('http://192.168.43.216:8080/register',
                    {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name:this.state.firstname + " " + this.state.lastname,
                        mobile:this.state.mobile,
                        username:this.state.username,
                        password:this.state.password
                    }),
                }).then(result=>{
                    this.setState({loading:false})
                    return result.json();
                }).then(data=>{
                    if(data.status){
                        this.props.navigation.navigate("Home");
                    }else{                 
                        this.setState({isShowState:true,msg:data.msg});
                        setTimeout(()=>{
                            this.setState({isShowState:false});
                        },2000) 
                    }
                }).catch((err)=>{
                    console.log(err)
                })
           }else{
            this.setState({isShowState:true});
            setTimeout(()=>{
                this.setState({isShowState:false});
            },5000)
           }
        });
       
    }

    showError=()=>{
        return(
        this.state.isShowState? <Text style={{color:'#000'}}>{this.state.msg}</Text> : null
        )
    }

    loading=()=>{
        return this.state.loading ? <View style={styles.loading}></View> : null;
    }

    render(){
        return(
            <View style={styles.container}> 
                
                {this.loading()}

                <ScrollView style={styles.loginBlock} showsVerticalScrollIndicator={false}>
                    <Text style={styles.loginHeading}>Register</Text>
                    {this.showError()}
                    <Text style={styles.label}>First Name</Text>
                    <Input placeholder='First name' style={{borderColor:colors.primaryColor}}
                    value={this.state.firstname} onChangeText={(text)=>{this.setState({firstname:text})}} rounded name='firstname'>            
                    </Input>
                    <Text style={styles.label}>Last Name</Text>
                    <Input placeholder='Last Name' rounded name='lastname' style={{borderColor:colors.primaryColor}}
                        value={this.state.lastname} onChangeText={(text)=>{this.setState({lastname:text})}}>
                    </Input>
                    <Text style={styles.label}>Mobile</Text>
                    <Input placeholder='Mobile' rounded name='mobile' type='phone-pad' value={this.state.mobile} 
                        style={{borderColor:colors.primaryColor}} onChangeText={(text)=>{this.setState({mobile:text})}}></Input>
                    <Text style={styles.label}>Username</Text>
                    <Input placeholder='Username' rounded name='password' 
                        value={this.state.username} onChangeText={(text)=>{this.setState({username:text})}}
                        style={{borderColor:colors.primaryColor}}></Input>                    
                    <Text style={styles.label}>Password</Text>
                    <Input placeholder='Password' rounded password viewPass name='password'
                        value={this.state.password} onChangeText={(text)=>{this.setState({password:text})}}
                        style={{borderColor:colors.primaryColor}}></Input>


                    <Button color='success' style={{width:'100%',marginTop:10,backgroundColor:colors.primaryColor,marginBottom:15}} round uppercase  onPress={this.onSubmit}>Register</Button>
                </ScrollView>
            </View>
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
      maxHeight:'80%'

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
