// 몽구스 불러오기(암호화 파일인데 아직안됨 나중에 수정)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//스키마 생성하기

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50

    },
    email:{
        type: String,
        trim: true, // 빈칸을 없애주는 역할
        unique: 1 // email unique하게 
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        minlength: 5
    },// role은 관리자와의 구분
    role:{
        type:Number,
        default: 0

    },

    image:String,
    token: {
        type:String
    },
    tokenExp:{
        type:Number
    }


})


//mongoose method
userSchema.pre('save', function( next){

    var user = this;

    

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){

            if(err) return next(err)
    
       
    
    
            bcrypt.hash(saltRounds, salt, function(err,hash){
    
                if(err) return next(err)
    
                //암호화 성공시 해쉬로 바꾼다
    
                user.password = hash
                next()
    
            });
        });

    }
    //비밀번호를 암호화 시킨다
   

    

})

const User = mongoose.model('User', userSchema)

//module을 다른곳에 쓸 수 있게
module.exports = { User }