import CRUDTable from "./CRUDTable"

let url = "http://65.111.114.167/waitme/index.php/restaurant"
let entity = "restaurant"
// adyard api adapter
let api = {
    create(data){
        let form = new FormData()
        for(let key in data){
            form.append(key, data[key])
        }
        return fetch(url, { 
            method: "POST",
            body: form
        })
    },
    // TODO - search, filter, sort, pagination
    retrieve(){
        return fetch(url).then(data => data.json())
    },
    update(data){
        // TODO - implement!
        return Promise.resolve()
    },
    del(id){
        return fetch(`${url}/delete?id=${id}`)
    }
}

let table = new CRUDTable({
    apiEndpoint: "http://65.111.114.167/waitme/index.php",
    api: api,
    entity: entity,
    actions: {
        table: ["create"],
        row: ["update", "delete"]
    }
})
document.getElementById("the-table").appendChild(table.el)
