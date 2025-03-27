# Housing locator

## Overview

A centralized web application that provides easily accessible information regarding housing and rent; while factoring in transit, distance to work or school. 
Allowing users to find the most affordable deals based on their specifications.

Developed for the comp1800 Projects 1 course, applying User-Centred Design practices.

---

## Features

Example:
- Centralized rent list from multiple sources.
- Responsive design for desktop and mobile.
- Considers distances to work, school etc,
- Can find the best transit routes for users.
- Provides a descriptive map showing transit routes based of user input.

---

## Technologies Used

Example:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Express.js
- **Database**: Firebase Firestore
- **API**: Craigslist API, Mapbox API

---

## Usage

Please check back later.

1. Open your browser and visit `http://localhost:8000`.
2. Login/Signup.
3. Update work/school location in profile page.
4. View and search for listings on main dashboard.
5. View individual listing.
6. Favourite listing.
7. View favourites page to see favourited listings.
8. View original post from listing.

---

## Project Structure

Example:
```
project-name/
├── src/
|   ├── app.js
│   ├── views/
|   |    ├── dashboard.html
|   |    ├── favourites.html
|   |    ├── index.html
|   |    ├── listing.html
|   |    ├── login.html
|   |    ├── not-found.html
|   |    └── profile.html
│   ├── public/
|   |    ├── css/
|   |    |    ├── dashboard.css
|   |    |    ├── favourites.css
|   |    |    ├── footer.css
|   |    |    ├── listing.css
|   |    |    ├── profile.css
|   |    |    ├── style.css
|   |    ├── icons/
|   |    |    ├── Comp1800_favicon.svg
|   |    |    ├── filter.svg
|   |    |    ├── heart-solid.svg
|   |    |    ├── house.svg
|   |    |    ├── house-solid.svg
|   |    |    ├── profile-solid.svg
|   |    |    ├── profile.svg
|   |    ├── images/
|   |    |    ├── background.jpg
|   |    |    ├── Comp1800_Logo.png
|   |    |    ├── Comp1800_Logo(no text).png
|   |    └── scripts/
|   |    |    ├── api/
|   |    |    |    ├── loadListing.js
|   |    |    |    ├── loadListingsArray.js
|   |    |    |    ├── loadMap.js
|   |    |    ├── auth/
|   |    |    |    ├── authentication.js
|   |    |    |    ├── firebase_config.js
|   |    |    |    ├── forwardAuth.js
|   |    |    |    ├── login.js
|   |    |    ├── favourites/
|   |    |    |    ├── loadFavourites.js
|   |    |    |    ├── saveFavourite.js
|   |    |    ├── profile/
|   |    |         ├── profile.js
│   ├── api/
|   |    └── routes.js
│   └── util/
|        └── status.js
├── .env.example
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

---

## Contributors
- **[Braeden Sowinski](https://github.com/SowinskiBraeden)** - BCIT CST Student with a passion for back-end development.
- **[Trishaan Shetty](https://github.com/Trishaancodes)** - BCIT CST Student
- **[Calvin Arifianto](https://github.com/EquivocalBlaze)** - BCIT CST Student mhm
---

<!-- ## Acknowledgments -->


<!-- --- -->

## Limitations and Future Work
### Limitations

- Currently only Metro-Vancouver and nearby cities.

### Future Work

- Update UI to modern design
- Make more mobile friendly
- Fix 404 not found page
- Consider travel time from house to work/school
- Consider distance from house to worl/school

---

## License

[MIT LICENSE](/LICENSE)
