const ACTION_ICONS = {
    "create": "plus",
    "update": "pencil",
    "delete": "trash",
}

function renderTableRow(actions, columns, model){
    let keys = this.columns.slice(0)
    keys.push("actions")
    
    return model.map(rowItem => {
        let html = [`<tr class="crud-table-row">`]
        keys.forEach(key => {
            if(key === "actions"){
                html.push(`<td class="crud-table-row-cell crud-table-row-actions-cell">
                    ${ actions.map(action => `<i class="action fa fa-fw fa-${ACTION_ICONS[action]}" data-action="${action}" data-id="${rowItem.id}" title="${action}"></i>`).join("") }
                </td>`)
            } else {
                html.push(`<td class="crud-table-row-cell">${rowItem[key]}</td>`)
            }
        })
        html.push("</tr>")
        return html.join("")
    }).join("")
}
function renderTableHeader(actions, columns, model){
    let keys = this.columns.slice(0)
    keys.push("actions")
    
    let html = ["<tr class='crud-table-row'>"]
    keys.forEach(key => {
        if(key === "actions"){
            html.push(`<th class="crud-table-row-header-cell crud-table-row-cell crud-table-row-actions-cell">${key}</th>`)
        } else {
            html.push(`<th class="crud-table-row-header-cell crud-table-row-cell">${key}</th>`)
        }
    })
    html.push("</tr>")
    return html.join("")
}
function renderTableFooter(actions, columns, model){
    return `<tr><td class="crud-table-footer-row-cell" colspan="${columns.length + 1}">Showing ${model.length} results</td></tr>`
}

export default class CRUDTable {
    constructor(config){
        this.entity = config.entity
        this.apiEndpoint = config.apiEndpoint
        this.actions = config.actions
        this.columns = []

        this.api = config.api

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
            let result = await this.create(model)
            await this.update()
        }
    }
    create(model){
        return this.api.create(model)
            .then(response => console.log("create success i guess", response))
            .catch(e => console.error("oops", e))
    }

    update(){
        return this.api.retrieve()
            .then(data => {
                this.columns = Object.keys(data[0])
                this.render(data)
            })
            .catch(e => console.error("oops", e))
    }

    render(model){
        this.table.innerHTML = `
            ${this.headerRenderer(this.actions.row, this.columns, model)}
            ${this.rowRenderer(this.actions.row, this.columns, model)}
            ${this.footerRenderer(this.actions.row, this.columns, model)}
        `
    }
}
