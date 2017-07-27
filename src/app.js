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
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                // map entity ids to id field
                return data.map(d => {
                    d.id = d.id || d[`${this.entity}_id`]
                    return d
                })
            })
    },
    del(id){
        return fetch(`${url}?${entity}_id=${id}`, { 
            method: "DELETE",
        })
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
