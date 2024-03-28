const GoogleStrategy=require('passport-google-oauth20').Strategy
const passport=require("passport")

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope:['profile','email']
        },
        function (accessToken,refreshToken,Profile,callback){
            console.log('Profile Data');
            console.log(Profile); //we can store the db
            callback(null,Profile)
        }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})