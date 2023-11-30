const express = require("express");
const app = express();
const port = process.env.PORT || 3000;//port so we can host our website globaly else on host 3000
const mongoose = require("mongoose");
const userdata = require('./src/models/form')
const path = require("path");
const hbs = require("hbs");
// app.use(express.json());  //middleware
const Register = require('./src/models/form')
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://Purvabee:Hanspurva@cluster0.9x7eof2.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri,{
    // useNewurlParser:true,
    // useUnifiedTopology:true
    // useCreateIndex:true
}).then(()=> console.log(`Database connect`))
.catch(() => console.log(`Error`));


const static_path = path.join(__dirname,"./src/models");
const template_path = path.join(__dirname,"./templates/views");
const partials_path = path.join(__dirname,"./templates/partials");

app.use(express.static(static_path));
// app.use(express.static('navbar'));
console.log(path.join(__dirname,"./template/views"));


app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})



app.post("/register", async (req,res)=>{
    try{
        // console.log(req.body.firstName);
        // res.send(req.body.firstName);
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        const hashedPassword = await bcrypt.hash(req.body.password,3);
        if(password===cpassword){
            const registerEmloyee = new Register({
                firstname : req.body.firstName,
                lastname : req.body.lastName,
                email : req.body.email,
                password : hashedPassword,
                confirmpassword : req.body.confirmPassword,
                phone : req.body.phoneNumber,
                gender : req.body.gender
            })
            // res.redirect("./login.hbs");
            const registered = await registerEmloyee.save();
            res.status(201).render("login");
        }else{
            res.send("password wrong");
        }
    }catch(error){
        res.status(400).send(error);
    }
})


app.get("/views/login.hbs",(req,res)=>{
    res.render("login");
})

app.post("/login", async (req, res) => {
    try{
        const check = await Register.findOne({email:req.body.username});
        if(!check){
            res.send("user name not found");
        }
        const isPass = await bcrypt.compare(req.body.password, check.password);
        if(isPass){
            res.render("index")  
        }else{
            res.send("Wrong");
        }
    }

    catch{
        res.send("Wrong details");
    }


});

// app.post('/form',(req,res)=>{
//     const input = req.body;
//     const createdata = userdata.create(input)
//     console.log('input',input);
//     res.status(201).json(input);
// })

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})