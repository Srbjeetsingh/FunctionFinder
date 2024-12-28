let service;
let selectedPlace = null;

function initService() {
    const mapDiv = document.createElement("div"); 
    service = new google.maps.places.PlacesService(mapDiv);

    const tags = document.querySelectorAll(".btn-check");
    tags.forEach(tag => {
        tag.addEventListener("change", updatePlaceList);
    });
}

function updatePlaceList() {
    // Clear existing list
    const placeList = document.getElementById("place-list");
    placeList.innerHTML = "";

    const selectedTags = Array.from(document.querySelectorAll(".btn-check:checked")).map(tag => tag.value);

    if (selectedTags.length === 0) {
        return; 
    }

    selectedTags.forEach(tag => {
        const request = {
            location: new google.maps.LatLng(3.140853, 101.693207), 
            radius: 5000, 
            type: tag, 
            keyword: tag 
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(place => {
                    addPlaceToList(place);
                });
            }
        });
    });
}

function addPlaceToList(place) {
    const placeList = document.getElementById("place-list");

    // Create list item
    const listItem = document.createElement("li");
    listItem.classList.add("place-item");

    const img = document.createElement("img");
    img.src = place.photos ? place.photos[0].getUrl({ maxWidth: 50, maxHeight: 50 }) : "https://via.placeholder.com/50";
    listItem.appendChild(img);

    const details = document.createElement("div");
    details.classList.add("details");
    details.innerHTML = `
        <strong>${place.name}</strong><br>
        Rating: ${place.rating || "N/A"}<br>
        Address: ${place.vicinity || "N/A"}
    `;
    listItem.appendChild(details);

    // Add click-to-select behavior
    listItem.onclick = () => {
        // Clear existing selections
        document.querySelectorAll(".place-item").forEach(item => {
            item.classList.remove("selected");
        });

        // Highlight selected item
        listItem.classList.add("selected");
        selectedPlace = {
            name: place.name,
            rating: place.rating || "N/A",
            vicinity: place.vicinity || "N/A"
        };

        // Show control buttons
        const controls = document.getElementById("place-controls");
        controls.style.display = "block";
    };

    placeList.appendChild(listItem);
}

// Add event listeners for Plan and Book buttons
document.getElementById("plan-btn").onclick = () => {
    if (selectedPlace) {
        localStorage.setItem("selectedPlace", JSON.stringify(selectedPlace));
        window.location.href = "results.html";
    } else {
        alert("Please select a place first.");
    }
};

document.getElementById("book-btn").onclick = () => {
    const transportation = document.querySelector('input[name="transportation"]:checked');
    if (!transportation || transportation.value !== "no") {
        alert("Booking is only available if you dont have transportation.");
        return;
    }

    if (selectedPlace) {
        localStorage.setItem("selectedPlace", JSON.stringify(selectedPlace));
        window.location.href = "results.html";
    } else {
        alert("Please select a place first.");
    }
};

