const status = require("../util/status");

const vancouverAreaID = 16;
const searchPath = "hhh";
const craigslistAPI = `https://sapi.craigslist.org/web/v8/postings/search?lang=en&area_id=${vancouverAreaID}&searchPath=${searchPath}`
const craigslistListingPage = `https://vancouver.craigslist.org`;

module.exports = (app) => { 
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
          id:          item.postingId,
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
          postDate:    item.postedDate,
          seo:         item.seo,
          category:    item.categoryAbbr,
          area:        item.location.subareaAbbr,
        };
        
        listings.data.push(listing);
      }
      
      res.set('Content-Type', 'application/json');
      res.send(listings);
      return res.status(status.Ok);
    } catch (error) {
      console.error(`ERROR: /api/listing -> ${error}`);
      return res.status(status.InternalServerError).send("Failed to query Craigslist API");
    }
  });

  app.get("/api/listing/:area/:category/:seo/:id", async (req, res) => {
    const area = req.params.area;
    const category = req.params.category;
    const seo = req.params.seo;
    const id = req.params.id;

    try {
      const listingURL = `${craigslistListingPage}/${area}/${category}/d/${seo}/${id}.html`;
      // console.log(listingURL);
      const raw = await fetch(listingURL, { method: "GET" }).then(response => response.text());

      const stupidPadding = 17;
      let title = raw.split("id=\"titletextonly\">")[1].split("</span>")[0];
      let location = raw.split("id=\"titletextonly\">")[1].split("</span>")[1].substring(7);
      let images = [];
      if (raw.includes("<div id=\"thumbs\">"))
        images = raw.split("<div id=\"thumbs\">")[1].split("</div>")[0].split("href=\"");
      images.shift()
      images = images.map((url) => url.split("\"")[0]);
      let price = raw.split("class=\"price\">")[1].split("</span>")[0];
      let available = raw.split("class=\"attrgroup\">")[1].includes("available") ? raw.split("class=\"attrgroup\">")[1].split("available ")[1].split("\n")[0] : null;
      let sqft = raw.includes("ft<sup>2</sup>") ? parseInt(raw.split("class=\"attrgroup\">")[1].split("<span class=\"attr important\">")[2].substring(stupidPadding).split("ft")[0]) : null;
      let bedrooms = parseInt(raw.split("class=\"attrgroup\">")[1].split("<span class=\"attr important\">")[1].substring(stupidPadding).split("BR")[0]);
      let bathrooms = raw.split("class=\"attrgroup\">")[1].split("<span class=\"attr important\">")[1].split("/ ")[1].split("Ba")[0];
      if (bathrooms != "shared") bathrooms = parseInt(bathrooms);
      let description = raw.split("id=\"postingbody\"")[1].split("</div>")[2].split("</section>")[0].replaceAll("<br>", "").substring(1);
      let attributes = raw.split("class=\"attrgroup\">")[3].split("<section id=\"postingbody\">")[0].split("<a href=\"");
      attributes.shift();
      attributes = attributes.map((attr) => attr.split(">")[1].split("</a")[0]);
      let address = raw.split("<div class=\"mapbox\">")[1].includes("<div class=\"mapaddress\">") ? raw.split("<div class=\"mapbox\">")[1].split("<div class=\"mapaddress\">")[1].split("</div>")[0] : null;
      let period = raw.split("class=\"attrgroup\">")[2].split("<a href=\"")[1].split(">")[1].split("</a")[0];

      let listing = {
        title: title,
        location: location,
        images: images,
        price: price,
        available: available,
        sqft: sqft,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        description: description,
        attributes: attributes,
        address: address,
        period: period,
      };

      res.set('Content-Type', 'application/json');
      res.send(listing);
      return res.status(status.Ok);
    } catch (error) {
      console.error(`ERROR: /api/listing/${seo}/${id} -> ${error}`);
      return res.status(status.InternalServerError).send("Failed to query Craigslist listing.");
    }
  });
}