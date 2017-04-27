const batch = require('./batcher')

function $promise(cb) {
    return function(param) {
        return new Promise((resolve, reject) => {
            cb(resolve, reject, param)
        })
    }
}

let startSequence = $promise((resolve, reject) => {
    batch.collect().then(resolve)
})
let rename = new $promise((resolve, reject, files) => {
    batch.rename(files, toThis).then(resolve)
})

function toThis(file) {
    return file + 'some creap'
}
function end(results) {
    console.log('finished', results)
}


startSequence()
    .then(rename)
    .then(end)
    .catch(console.log)