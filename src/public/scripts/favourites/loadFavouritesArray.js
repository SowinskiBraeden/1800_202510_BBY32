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
    
      firebase.auth().onAuthStateChanged(u => {
        if (u) {
          userdoc = db.collection("users").doc(u.uid);
          userdoc.get()
            .then(u => {
            return saved = u.data()["saved"];
          })}
      });

      let listings = JSON.parse(saved);  
  
      // iterate over array and convert to json
      for (let i = 0; i < saved.length; i++) {
        if (!listings[i].priceStr) continue;
        
        // DOM code to put listing data into HTML page
        let cardTemplate = document.getElementById("listing-template");  
        let card = cardTemplate.content.cloneNode(true);
        
        let redirect = listings[i].url;
        card.querySelector(".listing-title").innerHTML = listings[i].title;
        card.querySelector(".listing-location").innerHTML = listings[i].location;
        card.querySelector(".listing-data").innerHTML = `${listings[i].price} - ${listings[i].sqft}sqft - ${listings[i].rooms}room${listings[i].rooms.length > 1 ? "s" : ""}`;
        card.querySelector(".listing-description").innerHTML = listings[i].description;
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
  let queryURL = new URL(`${window.location.href.split("/dashboard/favourites")[0]}/favourites/favourites`);
  
  const search    = document.getElementById("Search_input").value;
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


