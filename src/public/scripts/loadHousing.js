function getListings() {
  let coords = [];
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    const listings = JSON.parse(this.response).data;

    let cardTemplate = document.getElementById("listing-template");

    for (let i = 0; i < listings.length; i++) {
      let card = cardTemplate.content.cloneNode(true);

      card.querySelector(".listing-title").innerHTML = listings[i].title;
      card.querySelector(".listing-location").innerHTML = listings[i].location.area;
      card.querySelector(".listing-data").innerHTML = `${listings[i].priceStr} - ${listings[i].sqft}sqft - ${listings[i].bedrooms} room${listings[i].bedrooms > 1 ? 's' : ''}`;
      card.querySelector(".listing-description").innerHTML = listings[i].description;

      if (listings[i].images.length > 0) {
        card.querySelector(".listing-preview").src = listings[i].images[0];
      }

      document.getElementById("listings").appendChild(card);
    }
  }

  xhttp.open("GET", "/api/listings");
  xhttp.send();
};

getListings();