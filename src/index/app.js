import CRUDTable from "../CRUDTable/CRUDTable"

function renderRestaurant(model){
    return `
        <div class="restaurant">
            <div class="restaurant-details">
                <div class="restaurant-name">${model.restaurant} <span class="restaurant-area">${model.area}</span></div>
                <div class="restaurant-address">${model.address}</div>
            </div>
            <div class="wait-time-wrap">
                <div class="wait-time">10</div>
                <div class="wait-time-unit">Minutes</div>
            </div>
        </div>
    `
}

class RestaurantList {
    constructor(model){
        this.el = document.createElement("div")
        this.el.className = "restaurant-list"
        this.model = model
        this.render()
        // TODO - event listeners
    }

    render(){
        this.el.innerHTML = this.model.map(restaurant => renderRestaurant(restaurant)).join("")
    }
}

let url = "http://65.111.114.167/waitme/index.php"
fetch(`${url}/restaurant`)
    .then(data => data.json())
    .then(restaurants => {
        let restaurantList = new RestaurantList(restaurants)
        document.querySelector(".content").appendChild(restaurantList.el)        
    })
