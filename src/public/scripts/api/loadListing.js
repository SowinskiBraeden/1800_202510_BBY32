let listing;

/**
 * loadListing queries internal api to get listing data with
 * given parameters from page url to populate listing page.
 */
function loadListing() {
  const url      = window.location.href;
  const data     = url.split("/");
  const area     = data[data.length - 6];
  const category = data[data.length - 5];
  const seo      = data[data.length - 4];
  const id       = data[data.length - 3];
  const lat      = data[data.length - 2];
  const lon      = data[data.length - 1];

  // Get coordinates of work/school address if exists to show map route
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          const city = userDoc.data().city;
          const workAddress = userDoc.data().workAddress;
          const province = userDoc.data().province;
          let dest = `${workAddress ? workAddress : ""}${city ? ', ' : ''}${city}${province ? ' ' : ''}${province}`;
          dest = encodeURIComponent(dest);

          let end = null;
          if (dest != "") {
            const geocode = new XMLHttpRequest();
            geocode.onload = function() {
              let json = JSON.parse(this.response);
              if (json.ok)
                end = json.coordinates;
              loadMap([lon, lat], end);
            }
            geocode.open("GET", `/api/geocode?address=${dest}`);
            geocode.send();
          }
          loadMap([lon, lat], end);
        });
    }
  });

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
    document.querySelector(".original-listing").href = listing.original;
    if (listing.images.length > 0)
      document.querySelector(".listing-preview").src = listing.images[0];

    // document.querySelector(".map-embed").src = `http://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
  }

  xhttp.open("GET", `/api/listing/${area}/${category}/${seo}/${id}`);
  xhttp.send();
}

loadListing()
