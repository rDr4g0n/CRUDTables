import CRUDTable from "../CRUDTable/CRUDTable"

function renderRestaurant(model){
    return `
        <div class="restaurant">
            <div class="restaurant-details">
                <div class="restaurant-name">${model.restaurant} <span class="restaurant-area">${model.area}</span></div>
                <div class="restaurant-address">${model.address}</div>
            </div>
            <div class="wait-time-wrap" ${model.waittime ? "" : "style='display:none;'"}>
                <div class="wait-time">${Math.floor(model.waittime)}</div>
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

function magicWaittimeAlgorithm(waittimes){
    // TODO - actually consider party size, waittime age,
    // and dont just average like a hilarious joke
    if(!waittimes.length){
        return null
    }
    return waittimes.reduce((avg, w) => {
        return (avg + w.waitTime) * 0.5 
    }, 0)
}

let url = "http://65.111.114.167/waitme/index.php"
function updateRestaurantList(){
    Promise.resolve()
        // request restaurants and waittimes in parallel
        .then(() => Promise.all([
            fetch(`${url}/restaurant`),
            fetch(`${url}/waittime`)
        ]))
        // parse/complete the request
        .then(([restaurants, waittimes]) => Promise.all([
            restaurants.json(),
            waittimes.json()
        ]))
        // join waittimes with restaurants
        .then(([restaurants, waittimes]) => {
            restaurants.forEach(r => {
                r.waittimes = []
                waittimes.forEach(w => {
                    if(w.restaurant_id === r.id){
                        r.waittimes.push(w)
                    }
                })
            })
            return restaurants
        })
        // generate wait time for each restaurant
        .then(restaurants => {
            return restaurants.map(r => {
                // magic algorithm to distill waittime
                r.waittime = magicWaittimeAlgorithm(r.waittimes)
                return r
            })
        })
        // render
        .then(restaurants => {
            let restaurantList = new RestaurantList(restaurants)
            document.querySelector(".restaurants").appendChild(restaurantList.el)        
        })
        .catch(e => {
            console.error("something broke", e)
        })
}

updateRestaurantList()
