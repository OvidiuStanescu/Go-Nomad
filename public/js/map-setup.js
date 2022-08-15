const ironhackBCN = {
    lat: 41.3977381,
    lng: 2.190471916
}

let map

function renderMap() {

    map = new google.maps.Map(
        document.querySelector('#myMap'),
        {
            zoom: 12,
            center: ironhackBCN,
            styles: mapStyles.dark
        }
    )
}


window.onload = () => {
    const lat = Number(latitude.value)
    const lng = Number(longitude.value)

    new google.maps.Marker({
        map,
        position: { lat, lng },
        title: 'Ironhack Barcelona'
    })

    map.setCenter({ lat, lng })
}


