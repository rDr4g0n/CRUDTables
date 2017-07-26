import CRUDTable from "./CRUDTable"

let table = new CRUDTable({
    apiEndpoint: "http://65.111.114.167/waitme/index.php",
    entity: "restaurant",
    actions: {
        table: ["create"],
        row: ["update", "delete"]
    }
})
document.getElementById("the-table").appendChild(table.el)
