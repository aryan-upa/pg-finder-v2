# PG Finder v2

PG Finder is a web application that helps users find PGs and hostels in different states and cities. It provides a 
user-friendly interface to search and book accommodations based on location, price, and amenities. Built using Node.js, 
Express JS and MongoDB, PG Finder is easy to deploy and customize.

Live at : [pg-finder-dart.onrender.com](https://pg-finder-dart.onrender.com/)

![Logo Finder Logo](https://github.com/aryan-upa/pg-finder-v2/blob/85b77a2356efa82f4f49fdf6c34e354a85f50b1c/public/images/logo-large.png)

## Usage:

The PG Finder application has been divided into 3 working modules, namely: Rider, Provider & Admin.

### Rider
The rider module encompasses the user who is here to look for properties. A rider in the application can do several 
things enlisted below:

1. Create a profile.
2. Search for properties.
3. Review, like and save properties for future.
4. Book a property by paying the booking amount, using card payments.
5. Get notified about booking success, booking fail, booking completion etc. through E-Mail.
6. Finally, a user can see all their bookings & likes and other information at one place, Dashboard.

### Provider
The provider module describes the user who is there to create property pages (their own), and do other stuff dealing 
with properties which they created. A provider's capabilities are:

1. Create a profile
2. Add properties by filling a detailed form, encompassing all details from property name to amenities provided.
3. Delete or Update a property details.
4. Confirm (Accept / Reject) a booking of a property owned by the provider after providing a valid message.
5. Finally, a provider can see all his properties, past confirmed booking and current pending booking details on their 
dashboard.

### Admin
As the name suggests, the admin has the complete control over the application. There are various tasks an admin can 
perform but PG Finder has taken care of the fact that multiple people can be admin, for this there is an entire 
admin-creation mechanism in place. Admin rights are as below:

1. Create admin account by providing Email and Admin Key.
2. Access the current state of all the roles in the application.
3. See profiles of rider & provider and can delete them as per need.
4. See status of all the bookings, and can remove any booking.
5. Can see all the contact made through home page's contact us section.

## How to run?

To run the application on Local System, you need your node version to be 16.16.0 and above. <br>
After installing node, clone the repository on your local system in a folder. Use following command:
```git
git clone https://github.com/aryan-upa/pg-finder-v2.git
```

After this, go into the folder where you've cloned the repo to create a file called `secret.env`, for the required API 
Keys follow guide [environment-variables](https://github.com/aryan-upa/pg-finder-v2/blob/b98747938cae97aab20475a8abad180d86c2fbec/Documents/environment-variables.md). Then open your fav shell and type:
```
npm init
npm start
```

Congratulations 🎉, you've successfully started the service on your local system.

## Contributing

The project is open for contribution, follow the [contributing-guidelines](https://github.com/aryan-upa/pg-finder-v2/blob/b98747938cae97aab20475a8abad180d86c2fbec/CONTRIBUTING.md) to create meaningful contributions in the 
project.

## License

MIT License - Copyright (c) 2023 Aryan Upadhyay & Priyanshi Mittal

## Developers

Frontend Development: [@priyanshi-mittal](https://github.com/priyanshi-mittal) <br>
Backend Development: [@aryan-upa](https://github.com/aryan-upa)


