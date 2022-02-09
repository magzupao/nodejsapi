var express = require('express');
const cron = require('node-cron');

var router = express.Router();

var jwt = require('jsonwebtoken')

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
   extended: true
}));
router.use(bodyParser.json());

const registro = {
   accion: '',
   usuario: '',
   precio: 0
}

const usuariosConToken = []

router.post('/login', (req, res) => {
   var username = req.body.user
   var password = req.body.password

   if (!(username === 'codigo51' && password === '1234')) {
      res.status(401).send({
         error: 'usuario o contraseña inválidos'
      })
      return
   }

   const found = usuariosConToken.find(element => element == "codigo51");
   if(found == "codigo51"){
      res.status(200).send({
         message: 'usuario ya tiene token'
      })
      return
   }

   var tokenData = {
      username: username
      // ANY DATA
   }

   var token = jwt.sign(tokenData, 'Secret Password', {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
   })

   var tokenArray = token.split(" ");
   let cadenaToken = tokenArray[0];
   if(cadenaToken){
      usuariosConToken.push(username);
   }

   res.send({
      cadenaToken
   })
})

function valida(req) {
   var token = req.headers['authorization']
   var mensaje;
   if (!token) {      
      mensaje = "EsNecesarioTokenAutenticación"      
   }else{
      token = token.replace('Bearer ', '')

      jwt.verify(token, 'Secret Password', function (err, user) {
         if (err) {         
            mensaje = 'TokenInválido'         
         } else {
            mensaje = 'ok'
         }
      })
   }

   return mensaje;
}

router.get('/', function (req,res) {
   var resp = valida(req)

   if(resp == 'ok'){
      console.log(" hace la funcionalidad ")
   }else{
      console.log(" bbbbbbbbb")
   }

   res.send('GET route on things.');
});

router.post('/charged', function (req, res) {
   var resp = valida(req)
   if(resp == 'ok'){
      console.log(" datos a cargar ");
      console.log(req.body.accion);
      registro.accion = req.body.accion;
      registro.usuario = req.body.usuario;
      registro.precio = req.body.precio;   
   }else{
      console.log(" bbbbbbbbb", resp )
   }
   res.send('POST carge route on things!!!');
});

router.get('/consulta', function (req, res) {
   res.send('GET consulta route on things.');
});

cron.schedule('*/5 * * * *', () => {
   usuariosConToken.length = 0;
   console.log("Task is running every minute " + new Date())
});


//export this router to use in our index.js
module.exports = router;
