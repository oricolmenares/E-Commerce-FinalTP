var express = require('express');
var router = express.Router();
var path= require('path');
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*GET list of products */
router.get('/api/items',function(req, res, next){ 
  const keyword = req.query.q
  
  if (keyword === undefined){
    res.json('ERROR EN KEYWORD')
    return
  }

  const apiEndPoint = 'https://api.mercadolibre.com/sites/MLA/search?q=' + keyword + '&limit=4'
  var productsJson = {
    categories: [],
    items: []
  }

  axios.get(apiEndPoint)
    .then(result =>{

      for(i=0; i < result.data.results.length; i++ ){
        const item = result.data.results[i]
        productsJson.categories.push(item.category_id)

        let producto = {
          id: item.id,
          title: item.title,
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          location: item.address.city_name,
          price: {
            currency: item.currency_id,
            amount: item.price,
            decimals: 00
          }
        }
        
        productsJson.items.push(producto)
        
      }
      console.log('el llamado a la api fue exitoso ')
      res.json(productsJson)
    })
    .catch(error =>{
      res.json('el llamado NO se ejecuto')
    })
  
})


/*GET one product detail */
router.get('/api/items/:id', function(req, res, nex){
  const mlaId = req.params.id

  const apiEndPoint1 = 'https://api.mercadolibre.com/items/' + mlaId
  const apiEndPoint2 = 'https://api.mercadolibre.com/items/'+ mlaId +'/description'


  var productDetailJson = {
    categories: [],
  }

  axios.get(apiEndPoint1)
    .then(result =>{

      productDetailJson.categories.push(result.data.category_id)

      var item = {
        id: result.data.id,
        title: result.data.title,
        price:{
          currency: result.data.currency_id,
            amount: result.data.price,
            decimals: 00
        },
        picture: result.data.thumbnail,
        condition: result.data.condition,
        free_shipping: result.data.shipping.free_shipping, 
        sold_quantity: result.data.sold_quantity
      }  
      
      productDetailJson.item = item

      res.json(productDetailJson)

      console.log('el llamado a apiEndPoint1 se realizo con Exito')
     
    })
    .catch(error =>{
      console.log('el llamado a apiEndPoint1 NO se realizo')
    })
    

  axios.get(apiEndPoint2)
    .then(result =>{
      console.log('se realizo el llamado a la apiEndPoint2')
    })
    .catch(error =>{
      console.log('el llamado a apiEndPoint2 NO se realizo ')
    })

    
  
})

module.exports = router;
  