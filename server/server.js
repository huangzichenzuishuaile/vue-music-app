const express = require('express')
const app = express()
const axios = require('axios')

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
    console.log(req,res)
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api',apiRoutes)

app.listen(8080,function(){
    console.log('执行')
})

