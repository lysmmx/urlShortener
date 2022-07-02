
const mongodb =require('mongoose')
const shortId=require('shortid')


const shortUrlSchema=new mongodb.Schema({
    full:{
        type: String,
        required: true
    },
    short:{
        type: String,
        required: true,
        default: shortId.generate
    },
    click:{
        type: Number,
        required: true,
        default:0
    }, 
})
module.exports =mongodb.model('ShortUrl',shortUrlSchema)