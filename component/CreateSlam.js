import React from 'react';
import { View,ScrollView,StyleSheet,Image,BackHandler,Alert } from 'react-native';
import { Text,Block,Input,Button } from 'galio-framework';
import { NavigationAction } from '@react-navigation/native'
import Colors from './../assets/styles/color';
import FormValidator from './../helper/formValidator'
const colors = Colors.getColor();

export default class CreateSlam extends React.Component{
    constructor(props){
        super(props);
        this.state={list:[],question:'',token:this.props.route.params.token,loading:false}

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
   

    fetchQue = () =>{
        this.setState({loading:true},()=>{
            fetch('http://192.168.43.216:8080/getque'+this.state.token).
            then(res=>{
                return res.json();
            }).
            then(data=>{
                if(data.status){
                    let list_1 = [];
                    list_1=data.que.map((que)=>{
                        let question = que.que;
                        if(!question){return;}
                        if(question[question.length-1]!=='?'){
                            question = question + ' ?';
                        } 
                        return question;
                    }) 

                    this.setState({list:list_1,loading:false});
                }else{
                    this.setState({loading:false});
                }

            }).catch(err=>{
                console.log(err)
            })
        })
    }

    componentDidMount=()=>{     
        this.fetchQue();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
          );
    }

    addQuestion=()=>{
        let list_1 = this.state.list;
        
        if(FormValidator.validateQuestion(this.state.question))
        {  
          this.setState({loading:true},()=>{
            fetch('http://192.168.43.216:8080/postque', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token:this.state.token,
                    que:this.state.question
                }),
            }).then(response=>{
            return response.json();
            }).then(data=>{ 
                if(data.status){
                    this.setState({loading:false,question:''})
                    this.fetchQue();
                }else{
                    //display toast
                }
                }).catch(err=>{
                console.log(err)
                this.setState({loading:false})
            });
          })  
        }else{
            return;
        }
    }

    listOfQuestion=()=>{
        let i = 0;
        const listOfQue = this.state.list.map( item => {
            i++;
            return(<Text key={i} style={{
            color:colors.primaryColor,
            textAlign:'center',
            fontSize:18,
            }}>{ i+". "+item}</Text>)
        });

        if(listOfQue.length===0){
            return null;
        }else{
            return listOfQue;
        }
    }

    loading=()=>{
      return this.state.loading ? <View style={styles.loading}>
        <Image  source={{ uri: './../asset/loading.gif' }} style={{ width: 40, height: 40 }} />
      </View> : null;
    }

    render(){
        return(
        <ScrollView style={styles.container}>
            {this.loading()}
            <Block style={styles.block}>
                <Text style={styles.label}>Question</Text>
                <Input value={this.state.question} onChangeText={(text)=>{this.setState({question:text})}} rounded multiline={true}  placeholder="Enter question to add!" placeholderTextColor={colors.secondaryColor} 
                color={colors.primaryColor}
                style={
                   {
                     padding:2,
                     height:100,
                    }
                }></Input>
                <Button round uppercase style={{backgroundColor:colors.primaryColor}} onPress={this.addQuestion}>Add</Button>
            </Block>
            <Block style={styles.block1}>
                {this.listOfQuestion()}
            </Block>
        </ScrollView>)
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
      flex:1,
      width:'100%',
      padding:10,
      backgroundColor:colors.secondaryColor
    },
    block:{
        backgroundColor:colors.fontColor,
        borderRadius:20,
        padding:10
    },
    block1:{
        marginTop:10,
        backgroundColor:colors.fontColor,
        borderRadius:20,
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