const express =require("express")
const mongoose=require("mongoose")
const cors=require('cors');
const multer=require("multer")


require("./models/user")



const app=express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))


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


  try {
      const person = await User.findOne({ "email":email });

      if (!person) {
          return  res.status(404).json({ error: 'User not found' });
      }

      if (person.password === password) {
          return res.json({ status: 'Password is correct' , flag:1});
      } else {
          return res.json({ status: 'Password is incorrect',flag:0});
      }
  } catch (err) {
      console.log('Error finding user:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
app.post("/upload" ,upload.single("ftp_files"),(req,res)=>{
    console.log(req.body);
    console.log(req.file)

    return res.redirect("http://localhost:3000/home")
})

app.listen(5000,()=>{
  console.log("server is running ....")
})
