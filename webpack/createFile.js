const fs = require('fs')

//在三个目录中新增文件
const dirs = new Map([
    ['pages', 'html'],
    ['sass', 'scss'],
    ['entry', 'js']
])

const createFiles = function (fileName) {
    for (let [key, value] of dirs.entries()) {
        fs.writeFile(`src/${key}/${fileName}.${value}`, "", err => {
            if (err) throw err
            console.log(`${value}创建成功`);
        })
    }
}

//在js和scss中引入需要的文件
const text =
    "import 'jquery'\n" +
    "import 'common'\n" +
    "import 'sass/layout.scss'"

const appendFiles = function (fileName) {
    fs.appendFile(`src/entry/${fileName}.js`, text, function (err) {
        if (err) throw err
        console.log('js写入成功')
    })

    fs.appendFile('src/sass/layout.scss', `\n@import '${fileName}.scss';`, err => {
        if (err) throw err
        console.log('scss写入成功')
    })
}

const fileTodo = function (fileName) {
    createFiles(fileName)
    appendFiles(fileName)
}

fileTodo('product') //在这写入需要增加的页面名称（以personal为例）