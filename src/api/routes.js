const status = require("../util/status");

const vancouverAreaID = 16;
const searchPath = "hhh";
const craigslistAPI = `https://sapi.craigslist.org/web/v8/postings/search?lang=en&area_id=${vancouverAreaID}&searchPath=${searchPath}`
const craigslistListingPage = `https://vancouver.craigslist.org`;

// Load environment variables from .env file
require('dotenv').config()

const API_KEY = process.env.API_KEY || "";

module.exports = (app) => { 

  /**
   * /api/geocode?address=
   * query mapbox api to convert an address to lat and lon coordinates
   * @param address to convert
   * @return object with coordinates
   */
  app.get("/api/geocode", async (req, res) => {
    try {
      const dest = req.query.address;
      if (!dest)
        return res.status(status.InternalServerError).send({ok: false});

      const query = `https://api.mapbox.com/search/geocode/v6/forward?q=${dest}&access_token=${API_KEY}`;
      const raw = await fetch(query, { method: "GET" }).then(response => response.json());
      let data = {
        ok: true,
        coordinates: raw.features[0].geometry.coordinates,
      };
      return res.status(status.Ok).send(data);
    } catch (error) {
      console.error(`ERROR: /api/geocode -> ${error}`);
      return res.status(status.InternalServerError).send({ok: false});
    }
  });

  /**
   * /api/getmap
   * @return mapbox api key as string within an object
   */
  app.get("/api/getmap", async (req, res) => {
    return res.status(status.Ok).send({key: API_KEY});
  });

  /**
   * /api/listings
   * scrapes listings and gets required data from craigslist api
   * @return array of listing objects
   */
  app.get("/api/listings", async (req, res) => {
    try {
      const search    = req.query.query         ? `&query=${req.query.query}`                : "";
      const max_price = req.query.max_price     ? `&max_price=${req.query.max_price}`         : "";
      const min_bed   = req.query.min_bedrooms  ? `&min_bedrooms=${req.query.min_bedrooms}`   : "";
      const min_bath  = req.query.min_bathrooms ? `&min_bathrooms=${req.query.min_bathrooms}` : "";
      const max_dist  = req.query.max_distance  ? `&max_distance=${req.query.max_distance}`   : "";
      const min_sqft  = req.query.minSqft       ? `&minSqft=${req.query.minSqft}`             : "";

      const queryAPIFilters = `${craigslistAPI}${search}${max_price}${min_bed}${min_bath}${max_dist}${min_sqft}`;

      const raw = await fetch(queryAPIFilters, { method: "GET" }).then(response => response.json());
      
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

  /**
   * /api/listings/:area/:category/:seo/:id
   * Scrape web page of individual listing to get listing information.
   * @param area code of listing
   * @param category of listing
   * @param seo string of listing
   * @param id of listing
   * @return object of listing data
   */
  app.get("/api/listing/:area/:category/:seo/:id", async (req, res) => {
    const area = req.params.area;
    const category = req.params.category;
    const seo = req.params.seo;
    const id = req.params.id;

    try {
      const listingURL = `${craigslistListingPage}/${area}/${category}/d/${seo}/${id}.html`;
      const raw = await fetch(listingURL, { method: "GET" }).then(response => response.text());
      const stupidPadding = 17;

      let title = raw
                    .split("id=\"titletextonly\">")[1]
                    .split("</span>")[0];

      let location = raw
                      .split("id=\"titletextonly\">")[1]
                      .split("</span>")[1]
                      .substring(7);

      let images = [];
      if (raw.includes("<div id=\"thumbs\">")) {
        images = raw
                  .split("<div id=\"thumbs\">")[1]
                  .split("</div>")[0]
                  .split("href=\"");
      }
      images.shift()
      images = images.map((url) => url.split("\"")[0]);

      let price = raw
                  .split("class=\"price\">")[1]
                  .split("</span>")[0];

      let available = raw.split("class=\"attrgroup\">")[1].includes("available") ? 
                      raw.split("class=\"attrgroup\">")[1].split("available ")[1].split("\n")[0] : null;

      let sqft = 0;
      if (raw.split("<div class=\"mapAndAttrs\">")[1].split("<section id=\"postingbody\">")[0].includes("ft<sup>2</sup>")) {
        let last = raw
                    .split("class=\"attrgroup\">")[1]
                    .split("ft<sup>2</sup>")[0]
                    .split(" ")
                    .length - 1;

        sqft =  parseInt(raw
          .split("class=\"attrgroup\">")[1]
          .split("ft<sup>2</sup>")[0]
          .split(" ")[last]
        );   
      }

      let bedrooms = "No";
      if (raw.split("class=\"attrgroup\">")[1].includes("BR")) {
        bedrooms = parseInt(raw
          .split("class=\"attrgroup\">")[1]
          .split("<span class=\"attr important\">")[1]
          .substring(stupidPadding)
          .split("BR")[0]
        );
      }

      let bathrooms = "No";
      if (raw.split("class=\"attrgroup\">")[1].includes("Ba")) {
        bathrooms = raw
          .split("class=\"attrgroup\">")[1]
          .split("<span class=\"attr important\">")[1]
          .split("/ ")[1]
          .split("Ba")[0];
      }
      if (bathrooms != "shared" && bathrooms != "No") bathrooms = parseInt(bathrooms);

      let description = raw
                          .split("id=\"postingbody\"")[1]
                          .split("</div>")[2]
                          .split("</section>")[0]
                          .replaceAll("<br>", "")
                          .substring(1);


      let attributes = raw
        .split("class=\"attrgroup\">")[1]
        .split("<section id=\"postingbody\">")[0]
        .split("<a href=\"");

      attributes.shift();
      attributes = attributes.map((attr) => attr.split(">")[1].split("</a")[0]);
      
      let address = raw.split("<div class=\"mapbox\">")[1].includes("<div class=\"mapaddress\">")
                  ? raw
                      .split("<div class=\"mapbox\">")[1]
                      .split("<div class=\"mapaddress\">")[1]
                      .split("</div>")[0] : null;

      let period = raw.includes("<div class=\"attr rent_period\">") 
                ? raw
                    .split("<div class=\"attr rent_period\">")[1]
                    .split("</div>")[0]
                    .split("</a>")[0]
                    .split("\">")[3]
                : null;

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
        original: listingURL,
      };

      res.set('Content-Type', 'application/json');
      res.send(listing);
      return res.status(status.Ok);
    } catch (error) {
      console.error(`ERROR: /api/listing/${seo}/${id} -> ${error}`);
      return res.status(status.InternalServerError).send({"success": false, "message": "Failed to query Craigslist listing."});
    }
  });
}
