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
// NOTE - automatically attaches waittimes, not reusable
function retrieve(){
    return fetch(`${url}/${this.entity}`)
        .then(data => data.json())
        .then(data => {
            return Promise.all(data.map(d => {
                return fetch(`${url}/waittime?restaurant_id=${d.id}`)
                    .then(data => data.json())
                    .then(waittime => {
                        d.waittime = waittime || []
                        return d
                    })
                    .catch(e => {
                        console.error("ahh geez", e)
                    })
            }))
        })
        // TODO - fetch wait times for each
}
function update(data){
    // TODO - implement!
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
        row: ["update", "delete"]
    }
})
document.getElementById("restaurant-table").appendChild(restaurantTable.el)
