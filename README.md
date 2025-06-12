# **Payment Application - Backend with NestJS**

## 👀 **Project Description:**

The goal of this project is to develop a backend application using **NestJS** to manage payments. The application should meet the following requirements:

### 3. 🤖 **API Endpoints:**

### 📌 Features
- **Authentication & Authorization**: User registration, login, and updates with roles (`ADMIN`, `USER`).
- **Movie Management**: Create, retrieve, and update movies with details like director, cast, and release date.
- **Queries & Mutations**:
  - `login`: User authentication.
  - `register`: Register new users.
  - `getMovies`: Retrieve all available movies.
  - `getMovieByTitle`: Find a movie by title.
  - `createMovie`: Add a new movie.
  - `updateMovie`: Modify movie details.
  - `getUser`: Get user information by ID.
  - `updateUser`: Update user data.

- **Automated Data Sync**:  
  - A **cron job** runs **once when the API starts** and then **every 5 minutes** to fetch the latest movie data from the **Star Wars API** and update the database.

---

## 📜 **Project Setup:**

### 1. Prerequisites:

Before you begin, make sure you have the following software installed on your machine:

- **Docker**: Used to run the database in a containerized environment.  
  You can download and install Docker from here: [Docker Official Website](https://www.docker.com/products/docker-desktop)

- **Node.js**: Used to run the backend application.  
  You can download and install Node.js from here: [Node.js Official Website](https://nodejs.org/en/download/)

### 2. Clone the Repository:

```bash
git clone <repository_url>
```

### 3. Navigate to the project directory

Change to your project directory:

```bash
cd <project_folder>
```

### 4. Install node dependencies

To install all the dependencies required for the project, run:

```bash
npm install
```

### 5. Install and up MongoDB using Docker

Then, run the following command to start MongoDB in a container:

```bash
docker-compose up -d
```

### 6. Configure environment variables 

Create a .env file in the root directory of the project and add the following environment variables:

```bash
JWT_SECRET=<your_jwt_secret>
```

Replace <your_jwt_secret> with a secret string for signing JWT tokens.

### 7. Run the application

After installing dependencies and configuring the environment, you can start the application with:

```bash
npm run start:dev
```

### 8. Go to the host url

The app will be running at http://localhost:3000/graphql

## 📜 **API documentation**

This project uses Graphql with [Apollo](https://www.apollographql.com/docs/apollo-server/)

## Steps for accesing the features:

### 1. Create the first user with the role ADMIN:

- Use the mutation: register

![login ](https://github.com/user-attachments/assets/63fa8c85-f324-4f25-8c75-38528e49256f)

[VIDEO TUTORIAL OF REGISTER](https://imagekit.io/tools/asset-public-link?detail=%7B%22name%22%3A%22how-to-register-first-user.mov%22%2C%22type%22%3A%22video%2Fquicktime%22%2C%22signedurl_expire%22%3A%222028-03-25T14%3A50%3A09.546Z%22%2C%22signedUrl%22%3A%22https%3A%2F%2Fmedia-hosting.imagekit.io%2F15cb9c0b048f48aa%2Fhow-to-register-first-user.mov%3FExpires%3D1837608610%26Key-Pair-Id%3DK2ZIVPTIP2VGHC%26Signature%3Dy~XHJzmddO77avC4A84yOPmbBJ~DbRy7~F-D0uMzTV0LpfMkYPp~e4J6Q0p-ttTbWVpnfaak4X63b64qjfrXepGr3uaxHFtVyQtXUUK~lHQZ~z3lm0kfJ7nYYjC6iBKf1~5BjmL6dBInTya1CUqBiWiadD38Q92BA79MJ2VqZBOYv4auruxEWWTf6mgqGcNMPCfbQPDXz9qG7bJowYdYgXjZGS0juL1U3ykZjzKwE0cPEHCThvInJRxoaq-uN3426KivELVWWJHuHzwDMf~NtGVE-1oyg2PIjOF5yvLrprC1m58rjiwRoLRG~ydvc8GOWJFenMCpRpslcz-9kskKiw__%22%7D)


### 2. Login and obtain the token:

- Use the mutation: login

![register](https://github.com/user-attachments/assets/f5ab5671-baff-4a14-b11f-766f94325cb5)

[VIDEO TUTORIAL OF LOGIN](https://imagekit.io/tools/asset-public-link?detail=%7B%22name%22%3A%22how-to-login.mov%22%2C%22type%22%3A%22video%2Fquicktime%22%2C%22signedurl_expire%22%3A%222028-03-25T15%3A01%3A06.344Z%22%2C%22signedUrl%22%3A%22https%3A%2F%2Fmedia-hosting.imagekit.io%2F3b676dc95dff4fe1%2Fhow-to-login.mov%3FExpires%3D1837609266%26Key-Pair-Id%3DK2ZIVPTIP2VGHC%26Signature%3Do8C7-S0Qf4cJAhD~a2Ge~5JOxpPBSViQDWJqC872OgdUl~hwhofOfhJ6OZdK1WT9Wix1Tapr5VMbRGEK9GrWmAA3Bk~TFTv8iLnoV81u6~betydumKecHa6RrZyUaSKbmaKerVleEqSmcaK1admV78e~ldYidMgELeHg1-~yeiWI5ncMN6tEM1xnMc8e~WvuhR0UtdtPeljQOKsMy56OxAJCYqGyUhiY9k8mIP66HnkSrihNKVX8cZaau7qzLaQE~YuiaYRWQKJRc9IXbmNvXXuWtSGWoPAWM1yGhmRbNh7hYtSUV2cLnYxim~GehxUfNMpl~PFJ4U-AqakAt-rW2w__%22%7D)

### 3. Set token to Authentication header:

![set header](https://github.com/user-attachments/assets/3289d57f-0e7a-4a45-8f23-d4b5970ed30c)

[VIDEO TUTORIAL OF AUTHENTICATION HEADER](https://imagekit.io/tools/asset-public-link?detail=%7B%22name%22%3A%22how-to-add-token-to-header.mov%22%2C%22type%22%3A%22video%2Fquicktime%22%2C%22signedurl_expire%22%3A%222028-03-25T15%3A01%3A06.340Z%22%2C%22signedUrl%22%3A%22https%3A%2F%2Fmedia-hosting.imagekit.io%2Fcc8e2d69159a4ebf%2Fhow-to-add-token-to-header.mov%3FExpires%3D1837609266%26Key-Pair-Id%3DK2ZIVPTIP2VGHC%26Signature%3DJHXYi4yOUxhycA1AkGzgah3zvfmfWDF-fnyRp3WcJhxr1c4yFtKEFsetQpcUMqLrpY75k6PQPPOW-FaneEbUSBhYD6PwdeWKMm-cJz4UTmbxC5JHBLd1gRqC3LrKr5SlCR0J3aUaETsVGuBytOvCWxlebhvMr5WctyhUKWkTxvUz6J5eUHmX68srN9DuM-a0w~75gXsmZJlNC2oaJCZ-3ag1tYeeNpgwvAsgQ~uz0lzd5BwPU6yhnwDinJd8S4V3m7cEdn15sgf8NXpMWZ4aoUFz6DneVWbUGFH6B0Jmm1iCm~-P3N4KpasAZCbpwaNJulFreilMm2FkyDY19QkfuQ__%22%7D)

### 4. Let's play!

This GraphQL-based API allows for user and movie management, including JWT authentication. 

![get movie](https://github.com/user-attachments/assets/351726b5-8381-42b4-af84-847a8bf7ea59)

[VIDEO TUTORIAL OF GET MOVIES](https://imagekit.io/tools/asset-public-link?detail=%7B%22name%22%3A%22how-to-get-movies.mov%22%2C%22type%22%3A%22video%2Fquicktime%22%2C%22signedurl_expire%22%3A%222028-03-25T15%3A01%3A06.342Z%22%2C%22signedUrl%22%3A%22https%3A%2F%2Fmedia-hosting.imagekit.io%2F0ca3d5d1527e40ef%2Fhow-to-get-movies.mov%3FExpires%3D1837609266%26Key-Pair-Id%3DK2ZIVPTIP2VGHC%26Signature%3DnMTxOQ54b2nsWzgUbKNTtu2GBmLfv-lCNCgKFEiRVXba-gegAa5Zi~aC6pEV~rH3i9jDXi0WcPogI7cD25410fCmEHs4JFfJAdIy3ahJQDc9UI6kAQ54NNlQdKMWmbmDcWnlA4p1d1b4lNj488FIxiWwNf3ATjMSppqExYsezKPthManjpG2KeXwbn8cmevEsJLPoJkLCnF~e9h-rpLN9nGgk3xpXvF6JhTkab9bDnfrHjI0mTZDLW-Uc9Ovm4AiTgetNiDuNm8FvIQL0TtTWh1-eEGLalLCZVIhzH7dI7o8YKW2D8JIkNHprLqFcVtcka7rAfvX8K-RIXWa2S8dgQ__%22%7D)