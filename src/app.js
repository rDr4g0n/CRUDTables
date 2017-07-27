import CRUDTable from "./CRUDTable"

// TODO - load restaurant by id from hash
// TODO - push history so that back button works as expected

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
    },
    onDetailRender: (formEl, model) => {
        let el = document.createElement("div")
        el.className = "waittimes"
        el.innerHTML = "Grabbing Wait Times..."
        // TODO - spinner
        formEl.insertBefore(el, formEl.querySelector(".formy-form-actions"))

        let addButton = document.createElement("a")
        addButton.className = "actionable primary-button add-waittime"
        addButton.innerHTML = "Add Wait Time"
        formEl.querySelector(".formy-form-actions").append(addButton)
        addButton.addEventListener("click", e => {
            // TODO - style wait time entries
            // TODO - use a form to get waittime
            // TODO - refresh waittimes after add
            alert("im going to just like add a wait time for you.")
            let data = {
                partySize: 4,
                waitTime: Math.ceil(Math.random() * 10),
                timestamp: new Date().getTime(),
                area: "butt",
                restaurant_id: model.id
            }
            let form = new FormData()
            for(let key in data){
                form.append(key, data[key])
            }
            return fetch(`${url}/waittime`, {
                method: "POST",
                body: form
            })
        })

        return fetch(`${url}/waittime?restaurant_id=${model.id}`)
            .then(data => data.json())
            .then(waittimes => {
                if(!waittimes){
                    el.innerHTML = "No Wait Times fount"
                    return
                }

                let html = waittimes.map(time => {
                    return `
                        <div class="waittime">
                            <div>partySize: ${time.partySize}</div>
                            <div>waitTime: ${time.waitTime}</div>
                            <div>timestamp: ${time.timestamp}</div>
                        </div>
                    `
                })
                el.innerHTML = html.join("")
            })
    }
})
document.getElementById("restaurant-table").appendChild(restaurantTable.el)
