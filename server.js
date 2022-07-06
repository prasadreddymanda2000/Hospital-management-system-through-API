const express=require('express');
const bodyParser=require('body-parser');
let jwt=require('jsonwebtoken');
let config=require('./config');
let middleware=require('./middleware');
let app=require('./index.js');

class HandlerGenerator{
    login(req,res){
        let username=req.body.username;
        let password=req.body.password;
        
        let mockedUsername='admin';
        let mockedPassword='password';

        if(username && password){
            if(username === mockedUsername && password === mockedPassword){
                let token=jwt.sign({username: username},
                config.secret,
                {
                    expiresIn: '24h'
                });

                //return jwt token for future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            }
            else{
                res.json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        }
        else{
            res.json({
                success: false,
                message: 'Authentication failed'
            });
        }
    }
    testFunction(req,res){
        res.json({
            success: true,
            message: 'Test Successful'
        });
    }
}

//starting point of server
function main(){
    let app=express();
    let handlers=new HandlerGenerator();
    const port=100;
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    //routes and handlers
    app.post('/login',handlers.login);
    app.get('/',middleware.checkToken,handlers.testFunction);

    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();