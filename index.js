// 시작점


const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const port = 3000





app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());



//강의에서는 monguri로 가르치지만 개정되면서 url로 바꿔야한다 mongoURL!
mongoose.connect(config.mongoURL, {
//   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAnModify: false, 
}).then(() => console.log('MongoDB Connected...'))
  .catch(arr => console.log(arr))

app.get('/', (req,res) => res.send('hello world! siba nada'))

app.post('/api/users/register', (req, res)=>{

    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
  
   const user = new User(req.body)

   //죽은코드
//    user.save((err, isuserInfo) => {
//     if(err) return res.json({success:false, err})
//     return res.status(200).json({
//         success: true
//     })

user.save()
.then((userInfo) => res.status(200).json({ success: true }))
.catch((err) => res.json({ success: false, err }));

   })

   app.post('/api/users/login',(req, res) =>{
      // 요청된 이메일을 데이터베이스 찾기
      User.findOne({email: req.body.email})
      .then(user=>{
          if(!user){
              return res.json({
                  loginSuccess: false,
                  messsage: "제공된 이메일에 해당하는 유저가 없습니다."
              })
          }
         user.comparePassword(req.body.password, (err, isMatch) => {
              if(!isMatch) return res.json({loginSuccess: false, messsage: "비밀번호가 틀렸습니다."})
      // Password가 일치하다면 토큰 생성
         user.generateToken((err, user)=>{
                  if(err) return res.status(400).send(err);
                  // 토큰을 저장
                  res.cookie("x_auth", user.token)
                  .status(200)
                  .json({loginSuccess: true, userId: user._id})
              })
          })
      })
      .catch((err)=>{
          return res.status(400).send(err);
      })
  })

  app.get('/api/users/auth', auth, (req, res) => {

   //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.

   res.status(200).json({
      _id:req.user._id,
      isAdmin:req.user.role == 0 ? false : true,
      isAuth:true,
      email:req.user.email,
      name:req.user.name,
      lastname:req.user.lastname

   })

  })
  

app.get('/api/users/logout', auth, (req, res) => {
   // console.log('req.user', req.user)
   User.findOneAndUpdate({ _id: req.user._id },
     { token: "" }
     , (err, user) => {
       if (err) return res.json({ success: false, err });
       return res.status(200).send({
         success: true
       })
     })
 })
 
 
 
 
 

 

app.listen(port, () => console.log('Exaple app listening on port ${port}!'))