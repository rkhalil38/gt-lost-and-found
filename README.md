# GT Lost and Found

GT Lost and Found is a web service that allows GT students and faculty to locate their lost items around campus.

## 📃License & Copyright Notice

GT Lost and Found and all modifications are licensed under the AGPL v3.0 license.

### Original Work

Copyright © 2024 Romulus Khalil (romuluskhalil3@gmail.com)

## 🚀 Overview

The app is a NextJS 13 application (built using create-next-app). GT Lost and Found is written in TypeScript and uses Tailwind CSS for styling. GT Lost and Found uses Supabase (a PostgreSQL alternative to Firebase) as its primary database and authenticator. Supabase utilizes Cookie-based authentication, meaning user's credentials are stored in cookies upon login.

## 💻 Running Locally

### Required Software
- Node.js (any recent version will suffice)
- Node Package Manager (NPM) version 10.5.1 or later

### Important API Key Notice
- For the maps to properly display, a [Google Maps API Key](https://developers.google.com/maps/documentation/embed/get-api-key) is required
- All other required API keys are supplied in `.env.example`

### Managing Dependencies
After the repository is cloned to your local machine, run the following command in the repo folder:
```
npm install
```

### Running the App
To start a local development version of the frontend app, run:
```
npm run dev
```
The app will then become viewable at http://localhost:3000, which can then be viewed in the browser.

With that, any changes in the frontend code should be hot-reloaded to localhost.

## 😀 Contributing

GT Lost and Found welcomes contributions from anyone! Regular development is performed by the project owner ([Romulus Khalil](https://www.linkedin.com/in/romulus-khalil/)) but contributions are still encouraged. There is no set guide on how to contribute just yet but expect one in the future!


