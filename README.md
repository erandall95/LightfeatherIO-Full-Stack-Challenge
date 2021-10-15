# Getting Started

This project was created to complete the "Full-Stack Challenge" from Lightfeather.IO.
![Lightfeather Challenge App](./assest/readme_img.png)

For this challenge, you will be building a simple form that will populate with data from an API
endpoint. After all validation on the form has been complete, the form response will be
submitted to another API endpoint. You will also be implementing this simple API which
provides a list of supervisors and accepts a registration to receive notifications from a given
supervisor.

## Client Specifications
Please build a form that allows for a team member to register for notifications from their
supervisor through email or phone (for the purposes of this challenge, we will not be building out
the email or phone functionality, but we do want to capture the data that would be necessary).
Your form must be able to perform the following functions:
* Retrieve a list of supervisors and display in a dropdown from: GET /api/supervisors.
* Capture the following fields:
  * First Name
  * Last Name
  * Email (if preferred)
  * Phone number (if preferred)
  * Supervisor
* Submit form information to the following endpoint: POST /api/submit
* Please add validation to the following fields:
  * Name fields are required and must only contain letters, no numbers.
  * Either an email or phone number must be provided depending on preference
    * Apply standard email + phone validation for these two fields

## Server Specifications

Please build an application that exposes an API that allows an application to retrieve a list of
supervisors and submit personal information.
Your application must include the following endpoints:
* GET/api/supervisors
  * When this endpoint is hit, a call is made to GET https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers to pull down a list of managers.
  * The endpoint should take the response payload from AWS and format it to
return:
    * A list of supervisor strings formatted as follows:
“jurisdiction - lastName, firstName”
    * Supervisors within the endpoint response payload should be sorted in
alphabetical order first by jurisdiction, then by lastName and firstName.
    * Numeric jurisdictions should be excluded from the response.

* POST /api/submit
  * The endpoint should expect to be provided the following parameters by means of your preferred content type:
    * firstName
    * lastName
    * email
    * phoneNumber
    * supervisor
    * The submitted data above should be printed to the console upon receiving the post request.
  * If firstName, lastName, or supervisor is not provided, the endpoint should return an error response. These are required parameters.
  * The user of your endpoint should have the option to leave out email and
phoneNumber when they submit without issue. They are not required for
submission.

## How to run the App

This app can either be run with Docker or with Node through NPM.

Download - [Docker](https://www.docker.com/products/docker-desktop)

Download - [Node](https://nodejs.org/en/download/)

### Run with Docker

Open a terminal and run:

> docker pull erandall95/lightfeather_challenge_app
>
> docker run -it -p 3000:3000 -p 3001:3001 erandall95/lightfeather_challenge_app

### Run with NPM

In the project directory, you can run:

#### `npm run install_all`

Installs all npm modules.
This command only needs to be run when first opened.

#### `npm run dev`

Launches the app backend and frontend.

## How to use the App

Open a browser and head to [http://localhost:3000](http://localhost:3000).