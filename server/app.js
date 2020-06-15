const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./model/user');
const Que = require('./model/question');
const Answer = require('./model/answer');
const fetch = require('node-fetch')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/',(req,res,next)=>{
    res.status(200).json({status:true});
});


const answer = async (userId,queId)=>{
    let answer = await Answer.findOne({queId:queId,userId:userId});
    if(!answer){return [{name:'',ans:''}]}
    else return answer.ans
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZGY5YjU5NWNkYzQ0MmUyNjQ0ZmIxZCIsIm5hbWUiOiJzaHlhbSIsInVzZXJuYW1lIjoic2h5YW0iLCJpYXQiOjE1OTE4NzQ3NjV9.zrJV66hAk5nccvYySow2cNfMpxmmh5hR0ZW2J-KGNmE

app.get('/getusersquestion',async (req,res,next)=>{
    try{
        const userId = req.query.id;
        const questionQue = await Que.findOne({userId:userId});
        if(!questionQue){
            res.status(200).json({status:false,msg:'no questions'});    
        }else{
            
            let queArray=[];
            queArray = questionQue.que;
            res.status(200).json({status:true,que:queArray});
        }
    }catch(err){
        next({code:505,msg:'Internal server error'+'\n'+err});
    }
});



app.get('/getque:token',async (req,res,next)=>{
    try{
        const token = req.params.token;
        const data = await jwt.verify(token,'Shyam');
        const userId = data.id;

        const questionQue = await Que.findOne({userId:userId});
        if(!questionQue){
            res.status(200).json({status:false,msg:'no questions'});    
        }else{
            
            let queArray=[];
            queArray = questionQue.que;
            let answer = await Answer.find({userId:userId});
            res.status(200).json({status:true,que:queArray,ans:answer});

        }
    }catch(err){
        next({code:505,msg:'Internal server error'+'\n'+err});
    }
});

app.post('/login',async (req,res,next)=>{
    try{
        
        const username = req.body.username;
        const password = req.body.password;
        const user = await Users.findOne({username:username});
        const result = await bcrypt.compare(password,user.password)
        if(!result){
            next({code:404,msg:'User not found!'});
        }else{
            const token = await jwt.sign({id:user._id,name:user.name,username:user.username},'Shyam');
            res.status(200).json({status:true,token:token});
        }
    }catch(err){
        next({code:505,msg:err});
    }
});

app.post('/register',(req,res,next)=>{
    const name = req.body.name;
    const mobile = req.body.mobile;
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password,12).then(hashpass=>{
        return hashpass;
    }).then(pass=>{
        Users.findOne({mobile:mobile,username:username}).then(user=>{
            if(user){
                next({code:404,msg:'User already exist'});
                return;
            }
            else{
                const userModel  = new Users({
                    name:name,
                    mobile:mobile,
                    username:username,
                    password:pass
                });
                userModel.save().then(()=>{
                    res.status(200).json({status:true})
                }).catch((err)=>{
                    next({code:505,msg:"User creation failure"});
                    return
                })
            }
        })
    }).catch(()=>{
        next({code:505,msg:'Server Error'});
    })
});

app.post('/postque',async (req,res,next)=>{
    try{
        const token  =  req.body.token;
        const que = req.body.que;
        const data = await jwt.verify(token,'Shyam');
        let Dateid = new Date().getTime()+new Date().getFullYear();
        
        if(!data){next({code:404,msg:'Please login first'});}
        const userId  = data.id;
        const questionQueue = await Que.findOne({userId:userId});
        if(!questionQueue){
            //create
            
            const questionque = new Que({
                userId:userId,
                que:[{id:Dateid,que:que}]
            });
            const result = await questionque.save();
            if(!result){
                next({code:505,msg:'Internal server error'});
            }
            res.status(200).json({status:true});

        }else{
            questionQueue.que.push({id:Dateid,que:que});
            const result = await questionQueue.save();
            if(!result){
                next({code:505,msg:'Internal server error'});
            }else{
                res.status(200).json({status:true});
            }
        }
    }catch(err){
        next({code:505,msg:'Internal server error'});
    }
});

app.post('/postans',async (req,res,next)=>{
    
    try{
        const userId = req.body.userId;
        const queId = req.body.queId;
        const token = req.body.token;
        const ans = req.body.ans;
        
        const pdata = await jwt.verify(token,'Shyam');
        if(!pdata){next({code:404,msg:'Please login first'});}
        const name = pdata.name;

        const queq = await Que.findOne({userId:userId});
        if(!queq){next({code:404,msg:'User not found'});}
        
        const answer = await Answer.findOne({queId:queId});
        if(!answer){
            const newans = new Answer({
                userId:userId,
                queId:queId,
                ans:[{name:name,ans:ans}]
            });
            const result = await newans.save();
            res.status(200).json({status:true});
        }else{
            answer.ans.push({name:name,ans:ans})
            const result = await answer.save();
            res.status(200).json({status:true});
        }

    }
    catch(err){ 
        next({code:505,msg:'Internal server error '+err});
    }
})

app.use((err,req,res,next)=>{
    let code = err.code;
    let msg = err.msg;
    res.status(code).json({status:false,msg:msg});
})

mongoose
  .connect(
    'mongodb+srv://root:root@cluster0-nk8bs.mongodb.net/slambook?retryWrites=true&w=majority',
    {useNewUrlParser: true,useUnifiedTopology: true} 
  )
  .then(result => {
    app.listen(8080);
    console.log('started')
  })
  .catch(err => {
    res.status(404).json({status:false,msg:"Database Server Error!"});
});