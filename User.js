// 몽구스 불러오기
const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema)

//module을 다른곳에 쓸 수 있게
module.exports = {User}