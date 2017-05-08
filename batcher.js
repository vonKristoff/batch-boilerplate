/**
 * Batch file automator boilerplate
 */

const fs = require('fs'), // read file
    fsPath = require('fs-path'), // easy write file
    glob = require('glob'), // read filenames
    cwd = `${__dirname}/`,
    config = require('./config')

let readFrom = `${config.import}${config.find}`

module.exports = {
    // promise shorthand for sequencer
    $promise(cb) {
        return function(param) {
            return new Promise((resolve, reject) => {
                cb(resolve, reject, param)
            })
        }
    },
    // get filenames from source directory
    collect() {        
        return new Promise((resolve, reject) => {
            glob(readFrom, function (er, files) {
                if(!er) resolve(files)
                else reject(er)
            })
        })    
    },
    // setup basic file meta as object
    set(files) {
        return new Promise((resolve, reject) => {
            let store = []
            files.forEach(file => {
                let name = file.split('/')
                store.push({ path: file, name: name[name.length - 1], data: null  })
            })
            resolve(store)
        })
    },
    // read and set file content data // prequisite method .set must have been run
    read(files) {
        return new Promise((resolve, reject) => {
            let next = function(index = 0) {
                let file = files[index]
                fs.readFile(file.path, 'utf8', function(err, data) {
                    if(!err) {
                        file.data = data
                        if(index < files.length - 1) next(index + 1)
                        else resolve(files)
                    } else reject(err)
                })
            }
            next()
        })  
    },
    // method handler
    action(files, method) {
        return new Promise((resolve, reject) => {
            let ary = []
            files.forEach((filename, index) => {
                ary.push(method(filename, index))
                if(index == files.length - 1) resolve(ary)
            })
        })        
    },
    // core actions (deprecate?)
    rename(files, method) {
        return new Promise((resolve, reject) => {
            let ary = []
            files.forEach((filename, index) => {
                ary.push(method(filename))
                if(index == files.length - 1) resolve(ary)
            })
        })
    }
}



// todo (add to methods)

function extractCoodinates(file) {
    // read contents of file
    fs.readFile(file, 'utf8', function(err, data) {
        if(!err) {
            let name = file.split('/').pop(),
                getTags = data.match(/<coordinates>(.*?)<\/coordinates>/g)
            getTags.forEach((item, i) => {
                getTags[i] = removeTag(item)
            })
            let coords = getTags.join('')
            saveToFile(coords.replace(/ /g, "\n"), name)
        }
    })
}
function saveToFile(contents, name) {
    let file = name.replace(".kml", "")
    fsPath.writeFile(`${target}/${file}.csv`, contents, 'utf8', (err) => {
        if(err) console.log(err)
        else console.log('path exported', `${file}.csv`)
    })    
}
function removeTag(item) {
    return item.replace("<coordinates>","").replace("</coordinates>","")
}
