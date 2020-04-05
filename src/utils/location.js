const generateLocation = (lat,log , username) => {
    return{
        lat,
        log,
        username,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateLocation
}