let listing;

function loadListing() {
  const url      = window.location.href;
  const data     = url.split("/");
  const area     = data[data.length - 6];
  const category = data[data.length - 5];
  const seo      = data[data.length - 4];
  const id       = data[data.length - 3];
  const lat      = data[data.length - 2];
  const lon      = data[data.length - 1];

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {

    listing = JSON.parse(this.response);

    let data = `${listing.price}`;
    if (listing.sqft != null)
      data = data + ` - ${listing.sqft}ft<sup>2</sup>`

    let room = `${listing.bedrooms} bed${listing.bedrooms > 1 ? "s" : ""}, ${listing.bathrooms} bath.`;
    document.querySelector(".listing-title").innerHTML = listing.title;
    document.querySelector(".listing-location").innerHTML = listing.location;
    document.querySelector(".listing-data").innerHTML = data;
    document.querySelector(".listing-data-1").innerHTML = room;
    document.querySelector(".listing-description").innerHTML = listing.description;
    if (listing.images.length > 0)
      document.querySelector(".listing-preview").src = listing.images[0];

    document.querySelector(".map-embed").src = `http://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
  }

  xhttp.open("GET", `/api/listing/${area}/${category}/${seo}/${id}`);
  xhttp.send();
}

loadListing()

