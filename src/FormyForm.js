export default class FormyForm {
    constructor(config){
        this.title = config.title
        this.model = config.model
        this.onCancel = config.onCancel
        this.onSave = config.onSave

        this.id = this.model.id

        // container element
        this.el = document.createElement("div")
        this.el.className = "formy-form"

        this.el.innerHTML = `
            <h1 class="formy-form-header">
                <div class="formy-form-back"><i class="actionable cancel fa fa-fw fa-arrow-left"></i></div>
                <div class="formy-form-header-title">${this.title}</div>
            </h1>
            <table class="formy-form-form"></table>
            <div class="formy-form-actions">
                <a class="actionable minor-button cancel">Cancel</a>
                <a class="actionable primary-button save">Save</a>
            </div>
        `
        this.formBodyEl = this.el.querySelector(".formy-form-form")

        // bind delegated events
        this.el.addEventListener("click", e => {
            if(e.target.matches(".actionable.cancel")){
                this._onCancel()
            } else if(e.target.matches(".actionable.save")){
                this._onSave()
            }
        })

        // TODO - save, cancel handlers

        this.render()
    }

    _onCancel(){
        // TODO - check for unsaved changes and warn
        this.onCancel()
    }

    _onSave(){
        let data = {
            id: this.id
        }
        let fields = Array.from(this.el.querySelectorAll(".formy-form-fieldset-input"))
        fields.forEach(field => {
            let key = field.dataset.key
            let val = field.value
            data[key] = val
        })

        // TODO - validate?
        // TODO - deal with errors
        this.onSave(data)
    }

    render(){
        let html = []
        for(let key in this.model){
            if(key === "id"){
                continue
            }

            html.push(`
                <tr class="formy-form-fieldset">
                    <td>
                        <div class="formy-form-fieldset-label">${key}</div>
                    </td>
                    <td>
                        <input type="text" class="formy-form-fieldset-input" data-key="${key}" value="${this.model[key]}">
                    </td>
                </tr>
            `)
        }
        this.formBodyEl.innerHTML = html.join("")
    }

    onSaveClick(){

    }

    onCancelClick(){

    }
}

