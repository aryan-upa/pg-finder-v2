# Project Structure

This document contains the entire project structure, all directories information and file information. Use this to 
relevantly store, create and update files in order to extend the project.

## Directories & Files

```bash
.
|-- README.md
|-- app.js
|-- config.js
|-- secret.env
|-- package-lock.json
|-- package.json
|-- data
|   `-- top_property.json
|-- middlewares
|   |-- common.js
|   |-- file_uploader.js
|   |-- role_validator.js
|   `-- schema_validator.js
|-- models
|   |-- booking.js
|   |-- contact.js
|   |-- key.js
|   |-- login.js
|   |-- property.js
|   |-- provider.js
|   |-- register.js
|   |-- review.js
|   `-- rider.js
|-- public
|   |-- css
|   |   |-- photoswipe.css
|   |   `-- starability-growRotate.min.css
|   |-- images
|   |   |-- * some images
|   |   |-- svg
|   |   |   `-- * some svgs
|   |   `-- why-us.jpg
|   `-- js
|       |-- include-first.js
|       |-- include.js
|       |-- photoswipe.esm.js
|       `-- photoswipe.js
|-- routes
|   |-- admin.js
|   |-- auth.js
|   |-- booking.js
|   |-- contact.js
|   |-- property.js
|   |-- provider.js
|   |-- review.js
|   `-- rider.js
|-- utils
|   |-- cron_jobs.js
|   |-- database_connect.js
|   |-- key_generator.js
|   |-- mail_sender.js
|   |-- some_methods.js
|   |-- state_city_provider.js
|   |-- validation_schemas.js
|   `-- zipcode_details.js
`-- views
    |-- layout
    |   |-- boilerplate.ejs
    |   `-- flash.ejs
    |-- admin-dashboard.ejs
    |-- admin-details.ejs
    |-- admin-login.ejs
    |-- admin-registration.ejs
    |-- edit-pg.ejs
    |-- error.ejs
    |-- forgot-password.ejs
    |-- home.ejs
    |-- property-page.ejs
    |-- provider-dashboard.ejs
    |-- register-pg.ejs
    |-- register-provider.ejs
    |-- register-user.ejs
    |-- reset-pass.ejs
    |-- rider-dashboard.ejs
    |-- search-home.ejs
    |-- search-result.ejs
    |-- success.ejs
    |-- update-provider.ejs
    |-- update-user.ejs
    |-- user-login.ejs
    `-- user-registration.ejs
```

## Directory information

### data
This directory contains data created during the execution of the program, such as `top-properties.json`, data in this 
folder is typically stored for as is usage and is update by some other functions.

### middlewares
This directory contains the middlewares defined during the creation of the project, these middlewares includes functions
like validation middlewares or file_uploader middlewares.

### models
This directory contains all the schema models in the project.

### public
This directory includes static and public files for front-end part of the application. Files like images and SVGs which 
are static also stored here.

### routes
All the routers used in the application are defined and stored in this directory.

### utils
All the files which are not directly related the server but contain code which is used for a specific reason are stored 
here. Files like `mail_sender.js` or `validation_schemas.js` are here.

### views
This directory contains the views of the application, it contains all the files related to HTML or EJS used for creating
the views.

