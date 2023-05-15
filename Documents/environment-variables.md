# Environment Variables

The following document contains all the environment variables you need to define in order for the application to work 
flawlessly, information is provided on what to name and how to obtain all the API Keys.

---

### Keys:

DATABASE_URL = _database url, either local mongoDB connection URL or connection URL to mongoDB Atlas._ <br>

BASE_URL = _base url of your application, for local development use it as `http://localhost:3000` and for cloud use it as `https://pg-finder-dart.onrender.com`_ <br> 

EMAIL_ADDRESS = _create a new email address (preferably Gmail) and use it as `email@vendor.com`_ <br>

APP_PASSCODE = _generate app passcode for your (email vendor) account to authenticate with node application. For Gmail, it can be created under security tab in your account, check on internet on how to create it_ <br>

SESSION_SECRET = _create a session secret, read on Google to learn more_ <br>

ZIPCODE_STACK_KEY = _for zipcode verification, go to [https://zipcodestack.com/](https://zipcodestack.com/) to get your API Key._ <br>

Further 3 API Keys, belong to Cloudinary services to save your user images and documents, create a free account to get these, 
you'll also need to enable PDF delivery option in securities tab to use feature completely.

CLOUD_NAME = _cloud name_ <br> 
CLOUDINARY_API_KEY = _cloudinary api key_ <br>
CLOUDINARY_API_SECRET= _cloudinary api secret_ <br>

ADMIN_KEY = _define an Admin Key, which you'll have to provide to a user to create an admin._ <br>

STRIPE_PRIVATE_KEY = _get your stripe private key after creating an account on stripe._ <br>
