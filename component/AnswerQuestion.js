import React from 'react';
import { View,ScrollView,StyleSheet } from 'react-native';
import { Text,Block,Input,Button,Toast } from 'galio-framework';
import Colors from './../assets/styles/color';
const colors = Colors.getColor();

const url = 'http://192.168.43.216:8080/';
export default class AnswerQuestion extends React.Component{
    constructor(props){
        super(props);
        this.state={id:'',que:[],token:this.props.route.params.token,ans:'',loading:false,showToast:false}
        this.submitAns = this.submitAns.bind(this);
    }

    submitAns=(id)=>{
        
        let userId = this.state.id;
        let token = this.state.token;
        let ans = this.state.ans;
        let queId = id;

        this.setState({loading:true},()=>{
            fetch(url+'postans', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token:token,
                userId:userId,
                queId:queId,
                ans:ans
            }),
            }).then(res=>{
                return res.json();
            }).then(data=>{
            if(data.status){
                this.setState({loading:false,ans:'',showToast:false});
                
            }else{
                this.setState({loading:false,ans:'',showToast:true});
                
            }
         }).catch(err=>{
             console.log(err);
         })
        });
    }

    loading = () => {
       return this.state.loading?
            <View style={styles.loading}></View>
        :null
    }

    fetchQue=()=>{
       const id = this.state.id;

       this.setState({loading:true},()=>{
            fetch(url+'getusersquestion/?id='+id).then
            (res=>{
                return res.json();
            }).then(data=>{
                    if(data.status){
                        let que = data.que;
                        let result = que.map(item => {
                        return {id:item.id,data:item.que};
                        })
                        this.setState({que:result,loading:false});
                    }else{
                        this.setState({que:null,loading:false});
                    }
            })
            .catch(err=>{
                this.setState({que:null,loading:false});
                console.log(err);
            })
       })
    }

    change=()=>{
        
    }


    loadQue = () =>{
        if(!this.state.que){
            return (
            <Block style={[styles.block,{marginTop:10}]}>
                <Text style={styles.label}>No questions</Text>
            </Block>
            );
        }else{
            return this.state.que.map(item=>{
                return(
                    <Block style={[styles.block,{marginBottom:10}]} key={item.id}>
                        <Text style={styles.label}>{item.data}</Text>
                        
                        <Input  
                        onChangeText={(text)=>{this.setState({ans:text})}} 
                        rounded  
                        placeholder="Your answer!" 
                        placeholderTextColor={colors.secondaryColor} 
                        color={colors.primaryColor}></Input>

                        <Button round 
                        style={{backgroundColor:colors.button}}
                        onPress={e=>{
                            e.preventDefault();
                            this.submitAns(item.id);
                        }}>
                            Send
                        </Button>
                    </Block>
                )
            });
        }
    }

    componentDidMount(){
    }

    showError = () => {
        if(this.state.showToast){
            return <Text style={{color:colors.error}}>Something went wrong!</Text>
        }else{
            return null;
        }
    }

    render(){
        return(
        <ScrollView style={[styles.container,{paddingBottom:10}]}>
            {this.showError()}
            {this.loading()}
            <Block style={[styles.block,{marginBottom:10}]}>
                <Text style={styles.label}>Enter code</Text>
                    
                    <Input 
                    onChangeText={(text)=>{this.setState({id:text})}} 
                    rounded placeholder="Enter the slambook id of your friend!" 
                    placeholderTextColor={colors.secondaryColor} 
                    color={colors.primaryColor}
                    ></Input>

                    <Button round uppercase onPress={(e)=>{
                        e.preventDefault();
                        this.fetchQue();
                    }} style={{backgroundColor:colors.button}}>Search
                    </Button>
                
            </Block>
            <Block>
                {this.loadQue()}
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
          borderRadius:5,
          padding:10
      },
      block1:{
      },
      queBlock:{
        backgroundColor:colors.fontColor,
        marginTop:10,
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