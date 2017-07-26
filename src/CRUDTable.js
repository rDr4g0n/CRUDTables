const ACTION_ICONS = {
    "create": "plus",
    "update": "pencil",
    "delete": "trash",
}

function renderTableRow(actions, columns, model){
    let keys = this.columns.slice(0)
    keys.push("actions")
    
    let html = []
    keys.forEach(key => {
        if(key === "actions"){
            html.push(`<td class="crud-table-row-cell crud-table-row-actions-cell">
                ${ actions.map(action => `<i class="action fa fa-fw fa-${ACTION_ICONS[action]}" data-action="${action}" data-id="${model.id}" title="${action}"></i>`).join("") }
            </td>`)
        } else {
            html.push(`<td class="crud-table-row-cell">${model[key]}</td>`)
        }
    })
    return html.join("")
}
function renderTableHeader(actions, columns, model){
    let keys = this.columns.slice(0)
    keys.push("actions")
    
    let html = []
    keys.forEach(key => {
        if(key === "actions"){
            html.push(`<th class="crud-table-row-header-cell crud-table-row-cell crud-table-row-actions-cell">${key}</th>`)
        } else {
            html.push(`<th class="crud-table-row-header-cell crud-table-row-cell">${key}</th>`)
        }
    })
    return html.join("")
}
function renderTableFooter(actions, columns, model){
    let keys = this.columns.slice(0)
    keys.push("actions")
    let html = []
    html.push(`<td class="crud-table-footer-row-cell" colspan="${columns.length + 1}">Showing ${model.length} results</td>`)
    return html.join("")
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

        // TODO - opionally get config from user
        this.headerRenderer = renderTableHeader
        this.rowRenderer = renderTableRow
        this.footerRenderer = renderTableFooter

        // TODO - new/edit form (replace table view with form, add back button, push state)
        // TODO - user provided list of columns
        // TODO - sort, resize, move, add, remove, columns
        // TODO - pagination
        // TODO - selct and apply action to multiple rows
        // TODO - separate api adapter into its own lil interface
        // TODO - use a template string to setup the initial html
        // TODO - add concept of schema (field label, field editable, field type, validation rules, 
        // relationships (id looksup a different object), etc). initally generate a dumb schema
        // from input, but later let user define

        // container element
        this.el = document.createElement("div")
        this.el.className = "crud-table"

        this.el.innerHTML = `
            <h1 class="crud-table-header">
                <div class="crud-table-header-title">${this.entity}</div>
                <div class="crud-table-header-actions">${
                    this.actions.table.map(action => `<i class="action fa fa-fw fa-${ACTION_ICONS[action]}" data-action="${action}" title="${action}"></i>`).join("")
                }</div>
            </h1>
            <table class="crud-table-table"></table>
        `

        this.table = this.el.querySelector(".crud-table-table")

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
        this.table.innerHTML = `
            ${this.headerRenderer(this.actions.row, this.columns, model)}
            ${this.rowRenderer(this.actions.row, this.columns, model)}
            ${this.footerRenderer(this.actions.row, this.columns, model)}
        `
    }
}
