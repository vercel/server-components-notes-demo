import sendRes from './send-res.build'

const moduleMap_ = require('../public/react-client-manifest.json')
console.log(moduleMap_)

export default (...args) => sendRes(...args)
