const batch = require('./batcher')

function $promise(cb) {
    return function(param) {
        return new Promise((resolve, reject) => {
            cb(resolve, reject, param)
        })
    }
}


    // .then(batch.readName(function(file) {
    //     console.log(file)
    // }))
    // .then(end)




let start = new $promise((resolve, reject) => {
    batch.collect().then(resolve)
})

function toThis(file) {
    return file + 'some creap'
}

let rename = new $promise((resolve, reject, files) => {
    batch.rename(files, toThis).then(resolve)
})

function end(results) {
    console.log('finished', results)
}


start()
    .then(rename)
    .then(end)
    .catch(console.log)