// 시작점

const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://cit:898200@cluster1.huf6sz2.mongodb.net/', {
  // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAnModify: false, 
}).then(() => console.log('MongoDB Connected...'))
  .catch(arr => console.log(arr))

app.get('/', (req,res) => res.send('hello world!'))

app.listen(port, () => console.log('Exaple app listening on port ${port}!'))