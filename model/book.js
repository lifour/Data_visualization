const fs = require('fs')

const bookFilePath = 'db/book.json'

const loadBooks = () => {
    let content = fs.readFileSync(bookFilePath, 'utf8')
    let bs = JSON.parse(content)
    return bs
}

const b = {
    data: loadBooks()
}

b.all = function() {
    let bs = this.data
    return bs
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
module.exports = b
