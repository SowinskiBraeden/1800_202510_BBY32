function getListings() {
  let coords = [];
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    const listings = JSON.parse(this.response).data;

    let cardTemplate = document.getElementById("listing-template");

    for (let i = 0; i < listings.length; i++) {
      if (!listings[i].priceStr) continue;
      
      let card = cardTemplate.content.cloneNode(true);

      let redirect = `/dashboard/listing/${listings[i].area}/${listings[i].category}/${listings[i].seo}/${listings[i].id}/${listings[i].location.lat}/${listings[i].location.lon}`;
      card.querySelector(".listing-title").innerHTML = listings[i].title;
      card.querySelector(".listing-location").innerHTML = listings[i].location.area;
      card.querySelector(".listing-data").innerHTML = `${listings[i].priceStr} - ${listings[i].sqft}sqft - ${listings[i].bedrooms} room${listings[i].bedrooms > 1 ? "s" : ""}`;
      card.querySelector(".listing-description").innerHTML = listings[i].description;
      card.querySelector(".listing-link").href = redirect;

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