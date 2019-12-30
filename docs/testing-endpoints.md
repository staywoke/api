![StayWoke Logo](https://staywoke-github.s3.us-east-1.amazonaws.com/common/logo.png "StayWoke Logo")

**[↤ Developer Overview](../README.md)**

Testing Endpoints with Postman
===

> Quickly and easily test API requests directly within Postman.

![Postman Logo](https://staywoke-github.s3.us-east-1.amazonaws.com/api/postman-logo.png "Postman Logo")

[![Install Chrome](https://img.shields.io/badge/Download-Postman-fd6c35.svg?style=for-the-badge)](https://www.getpostman.com/downloads/)

Setup:
---

Once you have Postman installed and open, you will want to import our handy collection of API requests.  These requests are setup to support each of our API's endpoints, allowing you to more easily test your local API during the development process.

#### Step #1. Import API Collection

With Postman Open, go to `File > Import ...`

![Postman Settings](https://staywoke-github.s3.us-east-1.amazonaws.com/api/postman-setting.png "Postman Settings")

You will see an import modal that looks like this:

![Postman Import](https://staywoke-github.s3.us-east-1.amazonaws.com/api/postman-import.png "Postman Import")

Find the `api.postman_collection.json` in the root of this project, and drop it into this modal ( or select it by choosing `Choose Files` ).

NOTE: If you are prompted that you already have this collection installed, you should likely replace it with the latest version in this repo.


#### Step #3. Collection Requests

You will need to make sure you have your local developer API setup and running.  Once you do, you can use the newly imported Collection to automate testing our API endpoints.

If you need help getting the API setup, see our [Developer Overview](../README.md).

#### Step #3. Collection Requests

Now you should see a new `StayWoke API` collection in the left menu.  This collection matches the structure of our developer [Apiary Documentation](https://staywoke.docs.apiary.io/).

![Postman Screenshot](https://staywoke-github.s3.us-east-1.amazonaws.com/api/postman-screenshot.png "Postman Screenshot")

Feel free to tweak these however you need during the development process. If things get messed up, you can always just reimport the `api.postman_collection.json` file and start from scratch.