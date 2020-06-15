import React from 'react';
import { View,ScrollView,StyleSheet,BackHandler } from 'react-native';
import { Text,Block,Accordion,Button } from 'galio-framework';
import Colors from './../assets/styles/color';
const colors = Colors.getColor();

export default class ShowSlamAnswer extends React.Component{
    constructor(props){
        super(props);
        this.state={ data:[],token:this.props.route.params.token,loading:false}; 
    
    }
    


    renderAnswers = () =>{
        let key=0;
        let queAns = this.state.data.map(item=>{
            let title = item.que;
            let ans='';
            
            for(let i=0;i<item.ans.length;i++){
                if((i)===item.ans.length-1){
                    ans = ans + item.ans[i].name + " : " +item.ans[i].ans;
                }else{
                    ans = ans + item.ans[i].name + " : " +item.ans[i].ans+ '\n';
                }
                
            }

            let dataArray = [
                {
                title: title, content: ans, 
                },
            ]
            
            return(
                {key:++key,dataArray:dataArray}
            );
        });
        
        return queAns.map(ele => {
            return(
            <Block key={ele.key} style={styles.block}>
                <Accordion dataArray={ele.dataArray} opened={-1} 
                           headerStyle={styles.accordionHead} 
                           contentStyle={styles.accordionContent}
                           >
                </Accordion>
            </Block>)
        })
    }


    fetchtqueans = () => {
        this.setState({loading:true},()=>{
            fetch('http://192.168.43.216:8080/getque'+this.state.token).
            then(res=>{
                return res.json();
            }).
            then(data=>{
                if(data.status){
                    let dataProto = [];
                    const queArray = data.que;
                    const ansArray = data.ans;

                    let result  = queArray.map(
                        arrayData =>{
                            let que = arrayData.que;
                            let id =  parseInt(arrayData.id);
                            try{
                                
                                let ans = ansArray.filter(ansdata=>{
                                    if(parseInt(ansdata.queId)===id){
                                        return true;
                                    }else{
                                        return false
                                    }
                                 });
                               
                                return {que:que,ans:ans[0].ans}
                            }catch(err){
                                return {que:que,ans:[]}
                            }

                        }
                    );                    
                    this.setState({loading:false,data:result});
                }

            }).catch(err=>{
                console.log(err)
            })
        })
    }


    componentDidMount(){  
        this.fetchtqueans();
        
    }


    loading=()=>{
        return this.state.loading?<View style={styles.loading}></View>:null;
    }

    render(){
        return(
        <ScrollView style={styles.container}>
            {this.loading()}
            <Button round style={{backgroundColor:colors.fontColor,marginTop:10,width:'100%'}}
                onPress={this.fetchtqueans}><Text style={{color:colors.primaryColor}}>Refresh</Text></Button>
            <View style={{paddingBottom:10}}>
                {this.renderAnswers()}
            </View>
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
    }
    ,container:{
      flex:1,
      width:'100%',
      paddingBottom:10,
      paddingLeft:10,
      paddingRight:10,
      backgroundColor:colors.secondaryColor
    },
    block:{
        backgroundColor:colors.fontColor,
        borderRadius:20,
        padding:5,
        justifyContent:'center',
        marginTop:10
    },
    accordionHead:{
        color:colors.primaryColor,
    },
    accordionContent:{
        color:colors.secondaryColor
    } 
});