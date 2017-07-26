import CRUDTable from "./CRUDTable"

let url = "http://65.111.114.167/waitme/index.php/restaurant"
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
    }
}

let table = new CRUDTable({
    apiEndpoint: "http://65.111.114.167/waitme/index.php",
    api: api,
    entity: "restaurant",
    actions: {
        table: ["create"],
        row: ["update", "delete"]
    }
})
document.getElementById("the-table").appendChild(table.el)
