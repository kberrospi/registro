const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { 
  useNewUrlParser: true, useUnifiedTopology: true
});

const PersonSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String,
});

const Person = mongoose.model("Persons", PersonSchema);

app.get('/', async (req, res)=>{

    Person.find(function(err,data){
        if(err) return res.send('error: ' + err);
        let row ='';
        data.forEach((e)=>{
            row+= '<tr><td>' + e.name + '</td>' +
                  '<td>' + e.email + '</td>' +
                  '<td>' + e.pass + '</td></tr>'
        });
        let html= '<a href="/register">Regitser</a>'
              +'<table border=1>'
              +'<thead><th>Nombre</th> <th>Email</th> <th>Password</th> </thead>'
              +'<tbody>' + row + '</tbody></table>' 

        res.send(html);
    });
    
    


    
});

app.get('/register', (req, res)=>{

    let formulario = '<form action="/register" method="post"><div><label>Nombre: </label> '
                    + '<input name="cname" id="name" type="text"/></div><div><label>Email:</label>'
                    + '<input name="cemail" id="email" type="email"></div>'
                    + '<div><label>Contraseña:  </label>'
                    + '<input name="cpass" id="password" type="password"></div>'
                    + '<div><button type="submit">Enviar</button></div></form>'


    res.send(formulario)
});

app.post('/register',async (req, res)=>{
    let n = req.body.cname; 
    let em = req.body.cemail;
    let p = req.body.cpass;
    await Person.create({name: n , email: em, pass: p});
    res.redirect('/');
    
   
});

app.listen(3000, ()=> console.log('Listening on port 3000'));