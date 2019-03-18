module.exports = function(req,res,next){
    const timestamp = (new Date()).getTime()
    const method = req.method
    const path = req.originalUrl

    console.log(`${timestamp}${method}${path}`)
    next()
}