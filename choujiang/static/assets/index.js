var fs = require('fs')
var Files = []
function writejs(data) {
data = 'var members = ' + JSON.stringify(data) + '; export default members';
fs.writeFile('members.js', data, (err) => {
if (err) {
console.log(err)
}
console.log('写入成功')
})
}
fs.readdir('images', (err, files) => {
files.map((item) => {
var name = item.split('.')[0]
Files.push(name)
writejs(Files)
})
})