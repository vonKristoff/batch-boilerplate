/**
 * Batch file automator boilerplate
 */

const fs = require('fs'), // read file
    fsPath = require('fs-path'), // easy write file
    glob = require('glob'), // read filenames
    cwd = `${__dirname}/`,
    config = require('./config')

let readFrom = `${config.io.import}${config.io.find}`

function $promise(cb) {
    return function(param) {
        return new Promise((resolve, reject) => {
            cb(resolve, reject, param)
        })
    }
}

module.exports = {
    collect() {
        // get filenames from source directory
        return new Promise((resolve, reject) => {
            glob(readFrom, function (er, files) {
                if(!er) resolve(files)
                else reject(er)
            })
        })    
    },
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
function init() {
    // getFileList()    
}
init()