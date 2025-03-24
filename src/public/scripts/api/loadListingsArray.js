function getListings() {
  // Close filters modal if open
  let modal = document.getElementById("myModal");
  modal.style.display = "none";

  // Reset listings
  document.getElementById("listings").innerHTML = "";
  document.getElementsByClassName("loader-container")[0].style.display = "block";
  document.getElementsByClassName("loader")[0].style.display = "block";

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {

    let listings = JSON.parse(this.response).data;

    let cardTemplate = document.getElementById("listing-template");

    // load listings
    for (let i = 0; i < listings.length; i++) {
      if (!listings[i].priceStr) continue;
      
      let card = cardTemplate.content.cloneNode(true);

      let redirect = `/dashboard/listing/${listings[i].area}/${listings[i].category}/${listings[i].seo}/${listings[i].id}/${listings[i].location.lat}/${listings[i].location.lon}`;
      card.querySelector(".listing-title").innerHTML = listings[i].title;
      card.querySelector(".listing-location").innerHTML = listings[i].location.area;
      card.querySelector(".listing-data").innerHTML = `${listings[i].priceStr} - ${listings[i].sqft}sqft - ${listings[i].bedrooms} room${listings[i].bedrooms > 1 ? "s" : ""}`;
      card.querySelector(".listing-area").innerHTML = listings[i].description;
      card.querySelector(".listing-link").href = redirect;

      if (listings[i].images.length > 0) {
        card.querySelector(".listing-preview").src = listings[i].images[0];
      }

      document.getElementsByClassName("loader-container")[0].style.display = "none";
      document.getElementsByClassName("loader")[0].style.display = "none";
      document.getElementById("listings").appendChild(card);
    }
  }

  // append existings filters
  let queryURL = new URL(`${window.location.href.split("/dashboard")[0]}/api/listings`);

  const search    = document.getElementById("search").value;
  const max_price = document.getElementById("price").value;
  const min_bed   = document.getElementById("bedrooms").value;
  const min_bath  = document.getElementById("bathrooms").value;
  const max_dist  = document.getElementById("distance").value;
  const min_sqft  = document.getElementById("sqft").value;

  if (search    !== "") queryURL.searchParams.append("query", search);
  if (max_price !== "") queryURL.searchParams.append("max_price", max_price);
  if (min_bed   !== "") queryURL.searchParams.append("min_bedrooms", min_bed);
  if (min_bath  !== "") queryURL.searchParams.append("min_bathrooms", min_bath);
  if (max_dist  !== "") queryURL.searchParams.append("max_distance", max_dist);
  if (min_sqft  !== "") queryURL.searchParams.append("minSqft", min_sqft);

  xhttp.open("GET", queryURL);
  xhttp.send();
};

getListings();
