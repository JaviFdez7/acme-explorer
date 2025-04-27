# AcmeExplorer

## Node version

The current version used for the project is v22.14.0

If you are using nvm, run:

```bash
nvm use
```

## Installation
To install the project dependencies, run:

```bash
npm install
```

## Configuration

The project is using firebase for authentication and storage. You can find the configuration in the `src/environments/environment*.ts` file.

Our configuration has been uploaded to the repository for the sake of evaluation.

## Development server

To start a local development server, run:

```bash
npm start
```

> **IMPORTANT:** 
Use this command to start the server instead of `ng serve` to ensure that both the Angular application and the json-server are running simultaneously. json-server is used for the favourites feature.

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Running unit tests

To execute unit tests use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npm start
```

Then open a new terminal and run:

```bash
npx cypress open
```

This will open the Cypress Test Runner, where you can run the end-to-end tests.

## Credentials

You can use the following credentials to log in:

#### Admin
- Email: `admin@admin.com`
- Password: `password`

#### Manager
- Email: `manager@manager.com`
- Password: `password`

#### Explorer
- Email: `explorer@explorer.com`
- Password: `password`

#### Sponsor
- Email: `sponsor@sponsor.com`
- Password: `password`

#### Paypal
- Email: `acmeexplorer@personal.example.com`
- Password: `acmeexplorer`

## Features

The features of the application are those aligned with the `level A` of the guidelines, as well as other extra features. The following list summarizes the features of the application:
- **Level A**: All features aligned with the level A of the guidelines.
- **Extra features**: 
  - ***Tailwind***: CSS framework for styling.
  - ***PrimeNG***: UI component library for Angular.
  - ***Configurable theme***: The application allows you to change the theme of the application.
  - ***Firebase & json-server***: The application uses both Firebase and json-server for data storage. Favourites are stored in json-server, while Firebase is used for authentication and other data.
  - ***Angular 19***: The application uses the latest version of Angular as of the date of the project creation.

## Considerations

As we are using Firebase for authentication, and onAuthStateChanged function provided by Firebase for authentication state, we are not in control of how the authentication state is managed.

This translates to the fact that when loging in or registering, a cookie is created and the user is perceived as logged in ([Firebase v3 eliminated the ability to create users from the client side without logging out the current user](https://groups.google.com/g/firebase-talk/c/zYatdVy1QfU/m/b-qI7iWeAAAJ)).

This is a limitation that affects the user creation process for an administrator, as registering a user means that the administrator will be automatically logged in as that user.

For this reason, the administrator is logged out after registering a user, so that the administrator can log in as the administrator again.

The solution to this problem is to use a custom authentication system, which is not in the scope of this project.

#### References
- [StackOverflow: Firebase Auth issue when registering users, automatic sign in when register?](https://stackoverflow.com/questions/68296369/firebase-auth-issue-when-registering-users-automatic-sign-in-when-register)

- [StackOverflow: How to prevent automatic log in after creating a new user on Firebase without using signOut() method](https://stackoverflow.com/questions/76818228/how-to-prevent-automatic-log-in-after-creating-a-new-user-on-firebase-without-us)

- [Firebase v3 eliminated the ability to create users from the client side without logging out the current user.](https://groups.google.com/g/firebase-talk/c/zYatdVy1QfU/m/b-qI7iWeAAAJ)