const express =require("express")
const mongoose=require("mongoose")
const cors=require('cors');
const multer=require("multer") //*


require("./models/user")
require("./models/fileUpload")


const app=express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use("/uploads",express.static("uploads")) // make file accessible

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
      cb(null,`${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })


let mongooseUrl="mongodb+srv://codeguy181:satwik3840@cluster0.bopkk7s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const User=mongoose.model("UserData")
const files_data=mongoose.model("FileStored")


mongoose.connect(mongooseUrl,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('connected to database');
}).catch((e)=>{
  console.log(e);
})


app.post("/register",async(req,res)=>{
   const {userName,email,password}=req.body;

   try{
     await User.create({
      userName,
      email,
      password
     })
     res.send("User data is inserted")
   }catch(error){
     res.send(error)
   }

})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password must be strings' });
  }


      const person = await User.findOne({ "email":email });

      if (!person) {
          return  res.status(404).json({ error: 'User not found' });
      }
      
      if(person.password === password){
        if(res.status(201)){
          return res.json({
            status:"ok",
            name:person.userName,
            email:email,
            flag:1
          })
        }else{
          return res.json({
            error:"error"
          })
        }
      }

      res.json({
          flag:0,
          error:"invalid password"
      })
});

app.post("/upload" ,upload.single("file"),async(req,res)=>{
    console.log(req.body) ;
    console.log(req.file)

    const email=req.body.email;
    const filename=req.file.filename;
   
    let emailId=await files_data.findOne({email});
    ftp_data=[]
    await ftp_data.splice(0,0,filename)
    if(emailId == null){
    try{

      await files_data.create({
        email,
        ftp_data
      })

      res.send({
        status:"ok"
      })
    }catch(err){
      res.send({
        status:err
      })
    }
  }else{

    try{
      await files_data.findOneAndUpdate({email},
      {$push:{ftp_data}}).then(()=>{
        res.send({
          mess:"old file is updated",
          status:"ok"
        })
      })
    }
    catch(err){
      res.send({
        mess:"internal server error"
      })
    }

  }

})

app.post("/get-files",async(req,res)=>{
    const {email} = req.body;

    try{
      await files_data.findOne({email}).then((data)=>{
        res.send({
          "data":data.ftp_data
        })
      })
    }catch(err){
      res.send({
        "err":err
      })
    }
})

app.listen(5000,()=>{
  console.log("server is running ....")
})

