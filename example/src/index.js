import fetch, { Fetch } from '../../src/index'

// var fetch;
// fetch = new Fetch();
window.console.dir(fetch.run)
var root = document.getElementById('root')
document.getElementById('getAjax').onclick = function() {
    fetch.run('/mocks/ajax.json',{},false).then((data) => {
        window.console.log(data)
        root.innerHTML = data.message
    },function () {

    })
}

document.getElementById('ajaxError').onclick = function() {

    fetch.run('/mocks/ajax.jsons').then((data) => {
        window.console.log(data)
    }, function(ex) {
        root.innerHTML = `<font color="red">${ex.responseText}</font>`
    })
}