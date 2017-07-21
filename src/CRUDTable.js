const ACTION_ICONS = {
    "create": "plus",
    "update": "pencil",
    "delete": "trash",
}

class CRUDTableRow {
    constructor(config){
        this.model = config.model
        this.header = config.header
        this.actions = config.actions || []
        this.columns = config.columns

        this.el = document.createElement("tr")
        this.el.className = "crud-table-row"

        if(this.header){
            this.el.classList.add("crud-table-row-header")
        }

        this.render()
    }

    render(){
        let html = []

        let keys = this.columns.slice(0)

        keys.push("actions")

        keys.forEach(key => {
            if(this.header){
                if(key === "actions"){
                    html.push(`<th class="crud-table-row-header-cell crud-table-row-cell crud-table-row-actions-cell">${key}</th>`)
                } else {
                    html.push(`<th class="crud-table-row-header-cell crud-table-row-cell">${key}</th>`)
                }
            } else {
                if(key === "actions"){
                    html.push(`<td class="crud-table-row-cell crud-table-row-actions-cell">
                        ${ this.actions.map(action => `<i class="action fa fa-fw fa-${ACTION_ICONS[action]}" data-action="${action}" data-id="${this.model.id}" title="${action}"></i>`).join("") }
                    </td>`)
                } else {
                    html.push(`<td class="crud-table-row-cell">${this.model[key]}</td>`)
                }
            }
        })

        this.el.innerHTML = html.join("")
    }
}

export default class CRUDTable {
    constructor(config){
        this.entity = config.entity
        this.apiEndpoint = config.apiEndpoint
        this.actions = config.actions
        this.columns = []

        // TODO - user provided list of columns
        // TODO - sort, resize, move, add, remove, columns
        // TODO - pagination
        // TODO - selct and apply action to multiple rows

        // container element
        this.el = document.createElement("div")
        this.el.className = "crud-table"

        // header element
        let header = document.createElement("h1")
        header.className = "crud-table-header"
        header.innerHTML = `
            <div class="crud-table-header-title">${this.entity}</div>
            <div class="crud-table-header-actions">${
                this.actions.table.map(action => `<i class="action fa fa-fw fa-${ACTION_ICONS[action]}" data-action="${action}" title="${action}"></i>`).join("")
            }</div>
        `
        this.el.appendChild(header)

        // table element
        this.table = document.createElement("table")
        this.table.className = "crud-table-table"
        this.el.appendChild(this.table)

        // bind delegated events
        this.el.addEventListener("click", e => {
            if(e.target.matches(".action")){
                this.handleAction(e.target.dataset.action, e.target.dataset.id)
            }
        })

        // grab data, render rows
        this.update()
    }

    handleAction(action, id){
        switch(action){
            case "create":
                this.requestCreate()
                break
            default:
                break
        }
    }

    async requestCreate(){
        // TODO - pop up editable create form
        if(confirm("do you want to create a random restaurant instead of using a nice form to enter the actual info?")){
            let model = {}
            this.columns.forEach(col => model[col] = Math.random())
            let result = await this.doCreate(model)
            // TODO - refresh
        }
    }
    async doCreate(model){
        try {
            let form = new FormData()
            for(let key in model){
                form.append(key, model[key])
            }
            let response = await fetch(`${this.apiEndpoint}/${this.entity}`, { 
                method: "POST",
                body: form
            })
        } catch(err) {
            console.error("oops", err)
        }
    }

    async update(){
        try {
            let response = await fetch(`${this.apiEndpoint}/${this.entity}`)
            let data = await response.json()
            // TODO - i guess dont assume data[0] exists and represents 
            // all the objects in the results
            this.columns = Object.keys(data[0])
            this.renderRows(data)
        } catch(err) {
            console.error("oops", err)
        }
    }

    renderRows(model){
        this.table.innerHTML = ""

        let rows = model.map(row => new CRUDTableRow({
            model: row,
            actions: this.actions.row,
            columns: this.columns
        }))

        // NOTE - header row is kinda a hack. whatever
        let headerRow = new CRUDTableRow({
            model: model[0],
            header: true,
            columns: this.columns
        })

        this.table.appendChild(headerRow.el)
        rows.forEach(row => this.table.appendChild(row.el))

        let footerRow = document.createElement("tr")
        // NOTE - columns.length + 1 for the actions column
        footerRow.innerHTML = `<td class="crud-table-footer-row-cell" colspan="${this.columns.length + 1}">Showing ${model.length} results</td>`
        this.table.appendChild(footerRow)
    }
}
