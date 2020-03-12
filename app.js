var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
const mercadopago= require ('mercadopago')


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const {img, title, price, unit} = req.query

    mercadopago.configure({
        access_token: 'TEST-7452452965818124-031118-cafd16fdde84cbb189658141a823fbcf-155038136'
      });

      let preference = {
        items: [
          {
            "title": title,
            "unit_price": Number(price),
            "quantity": Number(unit),
            "picture_url": img
          }
        ]
      };
    mercadopago.preferences.create(preference)
        .then(function(response){
        // Este valor reemplazará el string "$$init_point$$" en tu HTML
        global.init_point = response.body.init_point;
        res.render('detail', {img,title,price,unit,id_preference:response.body.id});
        }).catch(function(error){
        console.log(error);
        });
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000);