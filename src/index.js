const express = require('express');
const path = require("path");

const app = express();
const port = 8000;

const vancouverAreaID = 16;
const searchPath = "hhh";
const craigslistAPI = `https://sapi.craigslist.org/web/v8/postings/search?lang=en&area_id=${vancouverAreaID}&searchPath=${searchPath}`

/* This junk doesnt work
// Params used to search in greater vancouver area
const marketplaceLat = 49.1936;
const marketplaceLon = -122.9525;
const marketplaceRad = 22;
const marketplacePage = `https://www.facebook.com/marketplace/109571329060695/propertyrentals?exact=false&latitude=${marketplaceLat}&longitude=${marketplaceLon}&radius=${marketplaceRad}`
*/

const status = {
  Ok: 200,
  Unauthorized: 401,
  NotFound: 404,
  InternalServerError: 500,
}

/*** STATIC FILES ***/
app.use('/static', express.static(path.join(__dirname, 'public')))

/*** ROUTES ***/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
  return res.status(status.Ok);
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
  return res.status(status.Ok);
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/dashboard.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/favourites", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/favourites.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/profile", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/profile.html'));
  return res.status(status.Ok);
});

app.get("/dashboard/favourites", (req, res) => {
  res.status(200);
    return res.sendFile(path.join(__dirname, '/views/favourites.html'));
  });

app.get("/dashboard/listing", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/listing.html'));
  return res.status(status.Ok);
});

/*** API ***/

/*

This junk doesn't work. Why meta got to make it so difficult to scrape
their stuff?

app.get("/api/listings/meta", async (req, res) => {
  try {
    const raw = await fetch(marketplacePage, { method: "GET" }).then(response => response.text());

    console.log(raw);

    return res.status(status.Ok).send("debugging...");

  } catch (error) {
    console.error(`ERROR: /api/listing/meta -> ${error}`);
    return res.status(status.InternalServerError).send("Failed to query Meta Marketplace page");
  }
});
*/

app.get("/api/listings", async (req, res) => {
  try {
    const raw = await fetch(craigslistAPI, { method: "GET" }).then(response => response.json());
  
    // Parse craigslist housing list into our own data structure
    let listings = { data: [] };
  
    for (let i = 0; i < raw.data.items.length; i++) {
      let item = raw.data.items[i];
      
      let imageURLs = [];
      const baseImageURL = "https://images.craigslist.org/d";
  
      if (item.images) 
        for (let j = 0; j < item.images.length; j++)
          imageURLs.push(`${baseImageURL}/${item.postingId}/${item.images[j].substring(2)}_600x450.jpg`);
  
      let listing = {
        location: {
          lat:       item.location.lat,
          lon:       item.location.lon,
          area:      item.location.hostname
        },
        title:       item.title,
        description: item.location.description,
        bedrooms:    item.bedrooms,
        price:       item.price,
        priceStr:    item.priceString,
        sqft:        item.sqft,
        images:      imageURLs,
        postingId:   item.postingId,
        postDate:    item.postedDate,
      }
  
      listings.data.push(listing);
    }
  
    res.send(listings);
    return res.status(status.Ok);
  } catch (error) {
    console.error(`ERROR: /api/listing -> ${error}`);
    return res.status(status.InternalServerError).send("Failed to query Craigslist API");
  }
});

/*** DEFAULT ***/

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/not-found.html'));
  return res.status(status.NotFound);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
