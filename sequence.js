const batch = require('./batcher')
const sharp = require('sharp')

/**
 * Sequences
 */

let flow = batch.$promise((resolve, reject) => {
    batch.collect().then(resolve)
    // batch.collect().then(batch.set).then(batch.read).then(resolve)
})
let rename = batch.$promise((resolve, reject, files) => {
    batch.action(files, toThis).then(resolve)
})
let save = batch.$promise((resolve, reject, files) => {
    batch.action(files, saveAs).then(resolve)
})
let resize = batch.$promise((resolve, reject, files) => {
    batch.action(files, mobile).then(resolve)
})

/**
 * Methods
 */
function edit(file) {
    // let contents = batch
    return file
}
function saveAs(file) { 
    return file 
}
function toThis(file, i) {
    let f = file.name.split('.')
    f[0] = `renamed_${padding(i)}`
    return f.join('')
}
function end(results) {
    console.log('finished', results)
}
sharp.queue.on('change', function(queueLength) {
  console.log('Queue contains ' + queueLength + ' task(s)');
})
function mobile(file, i) {
    sharp(file)
        .resize(640)
        .toFile(`output/frame_${padding(i)}.png`, function(err, output) {
            if(err) console.log(err)
            console.log(output, 'finished')
        })
}
function padding(num) {
    return ("00"+num).slice(-3)
}
/**
 * Program
 */

flow().then(resize).catch(console.log)
    // .then(rename)
    // .then(save)
    // .then(resize)
//     // .then(edit)
//     // .then(save)
//     .catch(console.log)

