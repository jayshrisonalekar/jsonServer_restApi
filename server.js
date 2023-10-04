const jsonServer = require('json-server')
const clone = require('clone')
const data = require('./db.json')
const cors = require('cors');

const isProductionEnv = process.env.NODE_ENV === 'production';
const server = jsonServer.create()
server.use(cors());
const middlewares = jsonServer.defaults()
server.use(middlewares)

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
})


server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data))
    next()
})

server.use(router)
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server