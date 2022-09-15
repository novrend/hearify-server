# p2-iproject-server
Individual Project - Server
## Endpoints

List of Available Endpoints:
- `GET /sign-in`
- `POST /register`
- `POST /login`
- `GET /me`
- `PATCH /confirm`
- `GET /resend-confirm-code`
- `POST /forgot-password`
- `PATCH /forgot-password`

- `GET /transaction/me`
- `GET /transaction/dana`
- `GET /transaction/qris`
- `GET /transaction/paid`

- `GET /playlist/`
- `POST /playlist/`
- `GET /playlist/:playlistId`
- `PUT /playlist/:playlistId`
- `PATCH /playlist/:playlistId/:songId`
- `DELETE /playlist/:playlistId/:songId`
- `DELETE /playlist/:playlistId/`

- `GET /api/get-album?albumId=:albumId`
- `GET /api/get-new-release`
- `GET /api/get-artist?artistId=:artistId`
- `GET /api/search-song?q=:q`
- `GET /api/get-song?id=:id`
- `GET /api/get-featured-playlist`
- `GET /api/get-playlist-by-genre?name=:name`
- `GET /api/get-genre`
- `GET /api/find-playlist-by-genre?genre=:genre`

&nbsp;
### GET /sign-in
### Description
- Sign in with social media

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```

#### Response
_201 - OK OR 200 - Created_

- Body
    ```json
    {
      "access_token": String,
      "isPremium": Boolean
    }
    ```

&nbsp;

### POST /register
### Description
- Create a new user data

### Request:

- Body:

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response
_201 - OK_

- Body
    ```json
    {
      "statusCode": 201,
      "data":
        {
          "email": String,
          "username": String,
          "password": String,
          "phoneNumber": String,
          "address": String
        }
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
    "statusCode": 400,
        "message": {
            "email": "Email cannot be empty"
        }
    }
    OR
    {
    "statusCode": 400,
        "message": {
            "email": "Invalid email format"
        }
    }
    OR
    {
    "statusCode": 400,
        "message": {
            "email": "Email already taken"
        }
    }
    OR
    {
    "statusCode": 400,
        "message": {
            "password": "Password cannot be empty"
        }
    }
    OR
    {
    "statusCode": 400,
        "message": {
            "password": "Min length password is 5 characters"
        }
    }
    ```
&nbsp;

### POST /pub/login
#### Description
- Get access token

#### Request
- Body
    ```json
    {
        "email": String,
        "password": String
    }
#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "username": String,
      "access_token": String
    }
    ```

_400 - Bad Request_
- Body
    ```json
    {
      "statusCode": 400,
      "message": {
          "input": "Invalid Input"
      }
    }
    ```

_401 - Unauthorized_
- Body
    ```json
    {
      "statusCode": 401,
      "message": {
          "input": "Invalid email/password"
      }
    }
    ```
&nbsp;

### GET /pub/genres
#### Description
- Get all the genre data

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
          "id": Integer,
          "name": String,
          "createdAt": Date,
          "updatedAt": Date
        },
        ...
      ]
    }
    ```
&nbsp;

### GET /pub/movies
#### Description
- Get all the movie data

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
            "id": Integer,
            "title": String,
            "synopsis": Text,
            "trailerUrl": String,
            "imgUrl": String,
            "rating": Integer,
            "Genre": {
              "id": String,
              "name": String
            },
            "User": {
              "username": String,
              "email": String
            },
            "createdAt": Date,
            "updatedAt": Date
        },
        ...
      ]
    }
    ```
&nbsp;

### GET /pub/movies/:id
#### Description
- Get a movie data based on given id

#### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "id": Integer,
        "title": String,
        "synopsis": Text,
        "trailerUrl": String,
        "imgUrl": String,
        "rating": Integer,
        "Genre": {
          "id": Integer,
          "name": String
        },
        "authorId": Integer,
        "createdAt": Date,
        "updatedAt": Date
      },
      "qr": String
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
        "statusCode": 400,
        "message": "Invalid input parameter"
    }
    ```

_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "message": "Movie not found"
    }
    ```
&nbsp;

### GET /pub/favorite
#### Description
- Get all the favorite movie data

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
            "id": Integer,
            "UserId": Integer,
            "MovieId": Integer
        },
        ...
      ]
    }
    ```

_401 - Unauthorized_
- Body
    ```json
    {
        "statusCode": 401,
        "message": "Missing Token"
    }
    OR
    {
        "statusCode": 401,
        "message": "Token Invalid"
    }
    ```
&nbsp;

### POST /pub/favorite/:movieId
#### Description
- Add a movie to favorite based on given movie id

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- Body
    ```json
    {
      "status": String
    }
    ```

#### Response
_201 - OK_
- Body
    ```json
    {
      "statusCode": 201,
      "message": "Movie success added to favorite"
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
        "statusCode": 400,
        "message": "Invalid input parameter"
    }
    ```
_401 - Unauthorized_
- Body
    ```json
    {
        "statusCode": 401,
        "message": "Missing Token"
    }
    OR
    {
        "statusCode": 401,
        "message": "Token Invalid"
    }
    ```
_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "error": {
        "message": "Movie not found"
      }
    }
    ```
&nbsp;

### DELETE /pub/favorite/:favoriteId
#### Description
- Delete a movie from favorite based on given favorite id

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- Body
    ```json
    {
      "status": String
    }
    ```

#### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "message": "Movie success deleted from favorite"
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
        "statusCode": 400,
        "message": "Invalid input parameter"
    }
    ```
_401 - Unauthorized_
- Body
    ```json
    {
        "statusCode": 401,
        "message": "Missing Token"
    }
    OR
    {
        "statusCode": 401,
        "message": "Token Invalid"
    }
    ```
_403 - Forbidden_
- Body
    ```json
    {
        "statusCode": 403,
        "message": "Forbidden"
    }
    ```
_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "error": {
        "message": "Favorite Movie Not Found"
      }
    }
    ```
&nbsp;

### Global Error
#### Response
_500 - Internal Server Error_
- Body
    ```json
    {
      "statusCode": 500,
      "message": "Internal Server Error"
    }
    ```