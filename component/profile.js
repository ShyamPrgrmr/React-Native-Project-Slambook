import React from 'react';
import { View,Image,StyleSheet,TouchableOpacity,ToastAndroid,Clipboard,BackHandler,Alert,Linking } from 'react-native';
import { Text,Block,Button } from 'galio-framework';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SendSMS from 'react-native-sms'

import Colors from './../assets/styles/color';


import * as ImagePicker from 'expo-image-picker';

import * as SQLite from 'expo-sqlite';
const colors = Colors.getColor();
const db = SQLite.openDatabase("local.db");

export default class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state={token:this.props.route.params.token,id:'',name:'',mobile:'',uri:'',imgurl:'Not Specified',loading:false}
    }

    fetchAvatar=async ()=>{
        let result = await (await fetch('http://192.168.43.216:8080/getavatar'+this.state.token)).json();
        if(result.status){

            console.log(result.imgurl)
            this.setState({imgurl:'http://192.168.43.216:8080/profiles/'+result.imgurl})
        }else{
            this.setState({imgurl:'Not Specified'});
        }
    }

    loading=()=>{
        return this.state.loading ? <View style={styles.loading}></View> : null;
    }

    uploadAvatar = async ()=> {
        this.setState({loading:true});
        let form = new FormData();
        var data = new FormData();
        data.append('avatar', {
        uri: this.state.uri, 
        name: 'avatar',
        type: 'image/jpg'
        });
        try{
            const result = await (await fetch('http://192.168.43.216:8080/avatar'+this.state.token, {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: data
            })).json();

            if(result.status){
                await this.fetchAvatar();
                ToastAndroid.show("Uploaded", ToastAndroid.SHORT);
            }
            else{
                ToastAndroid.show("Image upload failed!", ToastAndroid.SHORT);
            }
        }catch(err){console.log(err)}
        this.setState({loading:false});
    }
    

    pickImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [2, 2],
            quality: 0.08,
          });
        if(!result.cancelled){
            this.setState({uri:result.uri},async ()=>{
                await this.uploadAvatar();
            });
        }
    }

    backAction = () => {
        Alert.alert("Exit", "do you really want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };

    componentDidMount=async()=>{
    
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
          );
        
        try{
            this.setState({loading:true},async ()=>{
                await this.fetchAvatar();
                
                const response = await (await fetch('http://192.168.43.216:8080/userid'+this.state.token)).json();
                if(response.status){
                    this.setState({id:response.id,name:response.name,mobile:response.mobile});
                }          

                this.setState({loading:false});
            })
        }catch(err){
            console.log(err);
        }

    }

    copyText=()=>{
        Clipboard.setString(this.state.id);
    }

    getImage=()=>{
        console.log(this.state.imgurl)
        if(this.state.imgurl === 'http://192.168.43.216:8080/profiles/Not Specified'){
            return(<Ionicons name={"ios-person-add"} size={80} color={colors.primaryColor} />)
        }else{
            return(<Image style={{width:100,height:100}} source={{uri:this.state.imgurl}}></Image>)
        }
    }

    render(){
        return(
        <View style={styles.container}>
            {this.loading()}
            <Block style={styles.first}> 
                
                <Block style={styles.photo}>
                    <TouchableOpacity style={styles.ineph} onPress={e=>{e.preventDefault(); this.pickImage()}}>
                        {this.getImage()}
                    </TouchableOpacity>
                </Block>

                <Block style={styles.desc}>
                    <Text style={{fontSize:25,color:colors.fontColor,textAlign:"center"}}>{this.state.name}</Text>
                </Block>
            </Block>

            <Block style={styles.newcon}>
                <Text style={{color:colors.primaryColor,
                             textAlign:'center',
                             marginTop:'auto',
                             marginBottom:'auto',
                             fontSize:12
                            }
                             }>
                 Slambook ID : {this.state.id}
                 </Text>            
                 <Button onlyIcon icon="ios-copy" 
                 iconFamily="ionicon" 
                 iconSize={30} color={colors.fontColor} 
                 iconColor={colors.primaryColor} 
                 style={{ width: 28, height: 25,marginLeft:'auto' }}
                 onPress={ (e)=>{
                    e.preventDefault();
                     this.copyText();
                    ToastAndroid.show("Copied", ToastAndroid.SHORT);
                 }}
                 >     
                copy</Button>

                <Button onlyIcon icon="logo-whatsapp" 
                 iconFamily="ionicon" 
                 iconSize={30} color={colors.fontColor} 
                 iconColor={colors.whatsapp}
                 style={{ width: 28, height: 25,marginLeft:10 }}
                 onPress={ (e)=>{
                    e.preventDefault();
                        let url = 'whatsapp://send?text=Hey copy and paste this id in Slambook : \n' + this.state.id ;
                    Linking.openURL(url).then((data) => {
                        console.log('WhatsApp Opened');
                      }).catch(() => {
                        ToastAndroid.show('Make sure Whatsapp installed on your device', ToastAndroid.SHORT);
                      });
                 }}
                 >     
                WhatsApp</Button>



            </Block> 

            <Block style={styles.newcon}>
                 <Text style={{color:colors.primaryColor,
                             textAlign:'center',
                             marginTop:'auto',
                             marginBottom:'auto',
                             fontSize:12
                            }}>

                            Mobile : {this.state.mobile}
               </Text>
            </Block>
            
            <Block style={styles.newcon1}>
                 <Text style={{color:colors.primaryColor,textAlign:'center',}}>Developer Info.</Text>
            
                 <Text style={{color:colors.primaryColor,
                             textAlign:'center',
                             marginTop:'auto',
                             marginBottom:'auto',
                            }}>

                            Shyam G. Pradhan
               </Text>

               <Block style={{display:'flex',flexDirection:'row',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                    
                    <Button onlyIcon icon="logo-whatsapp" 
                    iconFamily="ionicon" 
                    iconSize={35} color={colors.fontColor} 
                    iconColor={colors.whatsapp}
                    style={{ width: 32, height: 25,marginLeft:10 }}
                    onPress={ (e)=>{
                        e.preventDefault();
                            let url = 'whatsapp://send?phone="918793127023"';
                        Linking.openURL(url).then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            ToastAndroid.show('Make sure Whatsapp installed on your device', ToastAndroid.SHORT);
                        });
                    }}
                    >WhatsApp</Button>

                    <Button onlyIcon icon="logo-facebook" 
                    iconFamily="ionicon" 
                    iconSize={35} color={colors.fontColor} 
                    iconColor={colors.facebook}
                    style={{ width: 25, height: 25,marginLeft:10 }}
                    onPress={ (e)=>{
                        e.preventDefault();
                            let url = 'https://www.facebook.com/shyamyaonline/';
                        Linking.openURL(url).then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            ToastAndroid.show('Make sure Whatsapp installed on your device', ToastAndroid.SHORT);
                        });
                    }}
                    >WhatsApp</Button>


                    <Button onlyIcon icon="logo-github" 
                    iconFamily="ionicon" 
                    iconSize={35} color={colors.fontColor} 
                    iconColor={colors.github} 
                    style={{ width: 32, height: 25,marginLeft:10 }}
                    onPress={ (e)=>{
                        e.preventDefault();
                            let url = 'https://www.github.com/shyamprgrmr/';
                        Linking.openURL(url).then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            ToastAndroid.show('Make sure Whatsapp installed on your device', ToastAndroid.SHORT);
                        });
                    }}
                    >WhatsApp</Button>

                    <Button onlyIcon icon="logo-linkedin" 
                    iconFamily="ionicon" 
                    iconSize={35} color={colors.fontColor} 
                    iconColor={colors.linkedin} 
                    style={{ width: 28, height: 25,marginLeft:10 }}
                    
                    onPress={ (e)=>{
                        e.preventDefault();
                            let url = 'https://www.linkedin.com/in/shyam-pradhan-78274719b';
                        Linking.openURL(url).then((data) => {
                            console.log('WhatsApp Opened');
                        }).catch(() => {
                            ToastAndroid.show('Make sure Whatsapp installed on your device', ToastAndroid.SHORT);
                        });
                    }}
                    >WhatsApp</Button>
               </Block>
               <Text style={{color:colors.primaryColor,
                             textAlign:'center',
                             marginTop:10,
                            }}>

                            Copyright, All rights are reserved!
               </Text>
            </Block>
        </View>);
    }
}

const styles = StyleSheet.create({
    newcon1:{
        marginTop:'auto',
        backgroundColor:colors.fontColor,
        borderRadius:5,
        padding:10,
        display:'flex',
        flexDirection:'column',
    }
    ,newcon:{
        marginTop:10,
        backgroundColor:colors.fontColor,
        borderRadius:1,
        padding:10,
        display:'flex',
        flexDirection:'row',
        borderRadius:5,
    },
    ineph:{
        backgroundColor:colors.boxBackColor,
        width:100,
        height:100,   
        borderRadius:80,
        borderWidth:2,
        borderColor:colors.fontColor,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
    },
    photo:{
        overflow:'hidden',
        paddingTop:30,
        display:'flex',
        justifyContent:"flex-end",
        alignItems:'center'
    },
    desc:{
      paddingTop:10  
    }
    ,
    first:{
       
        width:'100%',
        backgroundColor:'transparent',
        borderRadius:5,
        padding:10,
        display:'flex',
        flexDirection:'column',
    },    
    loading:{
        position:'absolute',
        top:0,
        left:0,
        width:'150%',
        height:'150%',
        backgroundColor:colors.transperentLoading,
        zIndex:100,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },

    container:{
      flex:1,
      width:'100%',
      padding:10,
      backgroundColor:colors.secondaryColor
    },
    block:{
        backgroundColor:colors.fontColor,
        borderRadius:5,
        padding:10
    },
    block1:{
        marginTop:10,
        backgroundColor:colors.fontColor,
        borderRadius:5,
        padding:10,
        justifyContent:'center',
    }
    ,
    heading:{
        fontSize:30,
        textAlign:'center'
    },
    label:{
        fontSize:16,
        color:colors.primaryColor,
        marginLeft:8
      }
});