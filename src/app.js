import CRUDTable from "./CRUDTable"

let table = new CRUDTable({
    apiEndpoint: "http://192.168.1.8/waitme/index.php",
    entity: "restaurant",
    actions: {
        table: ["create"],
        row: ["update", "delete"]
    }
})
document.getElementById("the-table").appendChild(table.el)
