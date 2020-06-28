const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./model/user');
const Que = require('./model/question');
const Answer = require('./model/answer');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs')

const multer = require('multer');
const question = require('./model/question');

const uploads = multer({dest:'./public/profiles/'})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/profiles/');
    },
    filename:(req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname+'.jpg');
    }
});
  

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('avatar'));

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

app.get('/getavatar:token',async (req,res,next)=>{
    const userId = await jwt.verify(req.params.token,'Shyam').id;
    const user = await Users.findById(userId);
    if(!user){
        next({code:404,msg:'User not found'});
    }
    else{
        let imageURL = user.imgurl;
        
        res.status(200).json({status:true,imgurl:imageURL});
    }
})

app.post('/avatar:token',async (req,res,next)=>{
    
    const userID = await jwt.verify(req.params.token,'Shyam').id;
    const userData = await Users.findById(userID);
    const imageUrl = req.file;
    
    try{
        if(!userData){
            next({code:404,msg:'User not found'});
        }else{
            let oldImage = userData.imgurl;
            

            try{
                await fs.unlinkSync('./public/profiles/'+oldImage)
            }catch(err){}
            
            
            let result = await userData.updateOne({imgurl:imageUrl.filename});
           
            if(result){  
                res.status(200).json({status:true,imgurl:imageUrl});
            }else{
                next({code:505,msg:'Internal server error'})        
            }
        }

    }catch(err){
        next({code:505,msg:'Internal server error'+'\n'+err})
    };
    
    
    
});


const answer = async (userId,queId)=>{
    let answer = await Answer.findOne({queId:queId,userId:userId});
    if(!answer){return [{name:'',ans:''}]}
    else return answer.ans
}

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

app.post('/removeque',async (req,res,next)=>{
    try{
        
        let token = req.body.token;
        let queId = req.body.id;
        const userId = await jwt.verify(token,'Shyam').id;
        
        const que = await  Que.findOne({userId:userId}); 
        const queArray = que.que;

        let newQueArray = queArray.filter(item=>{
            if(item.id===queId){
                return false;
            }else{
                return true;
            }
        });

        const queData = await que.updateOne({que:newQueArray});
        if(!queData)
            res.status(200).json({status:false});
        else
            res.status(200).json({status:true});

    }catch(err){next({code:505,msg:'Internal server error'+'\n'+err})}
})

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
            const token = await jwt.sign({id:user._id,name:user.name,username:user.username},'Shyam',{expiresIn:'1h'});
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
                    password:pass,
                    imgurl:'Not Specified'
                });
                userModel.save().then(()=>{
                    res.status(200).json({status:true})
                }).catch((err)=>{
                    next({code:505,msg:"User creation failure"+err});
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

app.get('/userid:token',async (req,res,next)=>{
    try {
        const token = req.params['token'];
        let data = await jwt.verify(token,'Shyam');
        let userId = data.id;
        let user = await Users.findById(userId);

        res.status(200).json({status:true,id:userId,name:user.name,mobile:user.mobile});
    } catch (error) {
       next({code:505,msg:'Internal server error!'});
    }
})

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
    
});