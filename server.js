const express = require('express')
const mongoose = require('mongoose')
const app = express()
const QRcode = require('qrcode')
const shortUrl = require('./models/shortUrl')
const path = require('path')
let PORT=process.env.PORT || 5000;


mongoose.connect('mongodb+srv://root:1234@cluster0.objqy.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,

})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.set('views',path.join(__dirname, 'views'))

//about cors
app.use((req, res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type,Accept');
    next();
})

// show data
app.get('/',async(req, res) => {
    const shortUrls =await shortUrl.find()
    res.render('index',{shortUrls:shortUrls})
})
// create short id 
app.post('/shortURL', async(req, res) => {
    await shortUrl.create({
        full:req.body.fullURL,
    })
    res.redirect('/')

})
// go to webpage by shortid and count click this shortid link
app.get('/:shortUrl', async(req, res) => {
    const ShortUrl=await shortUrl.findOne({short: req.params.shortUrl})
    if (ShortUrl === null) return res.sendStatus(404)
    ShortUrl.click++
    ShortUrl.save()
    res.redirect(ShortUrl.full)
})
// Qrcode
app.post("/scan",(req, res) => {
    const url = req.body.fullURL
    QRcode.toDataURL(url, (err, url) => {
        if (err) res.send("Error occured")
        res.render('scan', { url })
    });
});
app.listen(PORT);