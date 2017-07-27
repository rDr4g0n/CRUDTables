import CRUDTable from "./CRUDTable"

// general API crap
let url = "http://65.111.114.167/waitme/index.php"
function create(data){
    let form = new FormData()
    for(let key in data){
        form.append(key, data[key])
    }
    return fetch(`${url}/${this.entity}`, { 
        method: "POST",
        body: form
    })
}
function retrieve(){
    return fetch(`${url}/${this.entity}`)
        .then(data => data.json())
}
function update(data){
    // TODO - implement!
    alert("edit doesn't work yet, but you can pretend it did!")
    return Promise.resolve()
}
function del(id){
    return fetch(`${url}/${this.entity}/delete?id=${id}`)
}

let restaurantAPI = {
    entity: "restaurant",
    create: create,
    retrieve: retrieve,
    update: update,
    del: del
}
let restaurantTable = new CRUDTable({
    api: restaurantAPI,
    entity: "restaurant",
    actions: {
        table: ["create"],
        row: ["details", "update", "delete"]
    }
})
document.getElementById("restaurant-table").appendChild(restaurantTable.el)
