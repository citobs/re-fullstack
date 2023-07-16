// 몽구스 불러오기
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function( next ){
    var user = this;
    if(user.isModified('password')){
    // 비밀번호를 암호화 시킨다.

    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        })
    })

} else {
    next()
}

})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567 이라면 암호화된 비밀번호 일치하는지 확인
    bcrypt.compare(plainPassword,this.password, function(err, isMatch){

        if(err) return cb(err);
        cb(null, isMatch)

    })
}

userSchema.methods.generateToken = function(cb) {
    //jsonwebtoken을 이용하여 토큰 생성

    var user = this;

    var token = jwt.sign(user._id.toHexString(),'3355')

    user.token = token
    user.save().then(() => {
        return cb(null, user)
    }).catch((err)=>{
        return cb(err)
    })
    

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, '3355', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

//module을 다른곳에 쓸 수 있게
module.exports = { User }