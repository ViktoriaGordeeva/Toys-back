const fs = require('fs')
const gToys = require('../data/db.json')



module.exports = {
    query,
    getById,
    remove,
    save
}


function query(filterBy = {}) {
    var toys = gToys;
    if (filterBy.type !== 'All') toys = toys.filter(toy => toy.type === filterBy.type)
    const regex = new RegExp(filterBy.searchTxt, 'i')
    toys = toys.filter(toy => regex.test(toy.name))
    if (filterBy.inStock) toys = toys.filter(toy => toy.inStock)
    if (filterBy.sortBy === 'name') toys = toys.sort((a, b) => a.name - b.name)
    if (filterBy.sortBy === 'price') toys = toys.sort((a, b) => a.price - b.price)
    return Promise.resolve(toys)
}
function getById(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    if (toy) return Promise.resolve(toy)
    else return Promise.reject('No TOY')
}
function remove(toyId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    if (idx >= 0) {
        gToys.splice(idx, 1)
        _saveToysToFile()
        return Promise.resolve()
    }
    else return Promise.reject('No TOY to remove')


}
function save(toy) {
    if (toy._id) {
        const idx = gToys.findIndex(currToy => currToy._id === toy._id)
        gToys[idx] = toy;
    } else {
        toy._id = +_makeId()
        gToys.unshift(toy)
    }
    _saveToysToFile()
    return Promise.resolve(toy)
}


function _makeId(length = 4) {
    var txt = '';
    var possible = '0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _saveToysToFile() {
    fs.writeFileSync('data/db.json', JSON.stringify(gToys, null, 2))
}
