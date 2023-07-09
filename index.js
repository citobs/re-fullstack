// 시작점


const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/User");




app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());



//강의에서는 monguri로 가르치지만 개정되면서 url로 바꿔야한다 mongoURL! 명심하자
mongoose.connect(config.mongoURL, {
//   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAnModify: false, 
}).then(() => console.log('MongoDB Connected...'))
  .catch(arr => console.log(arr))

app.get('/', (req,res) => res.send('hello world! siba nada'))

app.post('/register', (req, res)=>{

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



app.listen(port, () => console.log('Exaple app listening on port ${port}!'))