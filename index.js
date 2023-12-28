const express = require("express")
const app = express()
const PORT = 3001;
const UserRoute = require("./Routes/UserRoute")
const TestRoute = require("./Routes/TestRoute")
const passport = require('passport')
const expressSession = require("express-session")
const {initializingPassport} = require("./passportConfig")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
require("./dbConnect")

initializingPassport(passport);
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/users",UserRoute)
app.use("/api/tests",TestRoute)

app.listen(PORT,()=>{
    console.log("listening to port "+PORT);
})