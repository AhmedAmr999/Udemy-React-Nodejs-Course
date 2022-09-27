

//create Server

//const http= require('http')

//takes one argument function (request listener) request and response

// const server=http.createServer((req,res)=>{
//     console.log('REQUEST')
//     console.log(req.method,req.url)
    
//     if(req.method==="POST"){
//         let body=''

//         req.on('end',()=>{
//             const username=body.split('=')[1]
//             res.end('<h1>Name:'+ username +'</h1>')
//         })

//         req.on('data',(chunk)=>{
//             body+=chunk
//         })

//     }else{
//         res.setHeader('Content-Type','text/html')
//         res.end('<form method="POST" ><input type="text" name="username" /><button type="submit">Create User</button></form>')
//     }

 
// })

//port number
//server.listen(3000)




//USING EXPRESS

const express=require('express')

//parse incoming request bodies
const bodyParser=require('body-parser')


const app=express()

app.use(bodyParser.urlencoded({extended:false}))

app.post('/user',(req,res,next)=>{
    res.send('<h1> UserName: '+ req.body.username + '</h1>')
})

app.get('/',(req,res,next)=>{
    res.send('<form action="/user" method="POST" ><input type="text" name="username" /><button type="submit">Create User</button></form>')
})

app.listen(3000)
