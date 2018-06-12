const
    fs = require('fs'),
    path = require('path');

const
    sitePath = rootDir('../../site'),
    distPath = rootDir('dist');


const files = fs.readdirSync(rootDir('dist'))

files.forEach(v => {
    if ((/\.\w+$/g).test(v)) {
        copy(`${distPath}/${v}`, `${sitePath}/${v}`)
    } else {
        fs.mkdirSync(`${sitePath}/${v}`)
        const files = fs.readdirSync(rootDir(`dist/${v}`))
        files.forEach(v1 => {
            if ((/\.\w+$/g).test(v1)) {
                copy(`${distPath}/${v}/${v1}`, `${sitePath}/${v}/${v1}`)
            } else {
                fs.mkdirSync(`${sitePath}/${v}/${v1}`)
                const files = fs.readdirSync(rootDir(`dist/${v}/${v1}`))
                files.forEach(v2 => {
                    copy(`${distPath}/${v}/${v1}/${v2}`, `${sitePath}/${v}/${v1}/${v2}`)
                })
            }
        })
    }
})

function rootDir(src) {
    return path.join(__dirname, '..', src)
}

function copy(from, to) {
    let data = fs.readFileSync(from)
    fs.writeFileSync(to, data)
}