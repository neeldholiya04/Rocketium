# Rocketium Machine Test
This project is a Node.js-based RESTful API that provides functionalities to manage data, including fetching, storing, creating, updating, and deleting data. The project uses Axios for HTTP requests, and file system operations to read and write data to a JSON file. It also includes utilities for removing duplicates, filtering, and sorting data.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Utilities](#utilities)
- [Error Handling](#error-handling)

## Project Structure
```
Rocketium/
├── src/
│   ├── controllers/
│   │   └── DataController.js
│   ├── routes/
│   │   └── DataRoute.js
│   ├── services/
│   │   └── dataFetchStoreService.js
│   └── utils/
│       ├── FilterUtil.js
│       └── sortUtil.js
│       └── RemoveDuplicateUtil.js
├── data/
│   └── data.json
├── .env
├── app.js
└── package.json
```

### Services
* `dataFetchStoreService.js`: Handles fetching data from an external URL, removing duplicates, and storing the data in a JSON file.

### Controllers
* `DataController.js`: Handles the API endpoints for getting, creating, updating, and deleting data.

### Routes
* `DataRoute.js`: Defines the routes and associates them with controller methods.

### Utilities
* `filterUtils.js`: Provides utility functions for filtering data.
* `sortUtils.js`: Provides utility functions for sorting data.
* `removeDuplicateUtil.js`: Utility to remove duplicate entries based on a specified key.

## Installation
1. Clone the repository locally
    ```bash
    git clone https://github.com/neeldholiya04/Rocketium.git
    cd Rocketium
    ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a `.env` file in the root directory and add your environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

```env
PORT=3000 {REPLACE WITH THE ADDRESS YOU WANT TO PORT WITH}
DATA_URL={YOUR_DATA_URL}
```

## Usage
Start the server
```bash
npm app.js
```
The server will start at the point you defined in `.env` file. Here it will start at `PORT=3000`

## API Endpoints
### Get Data
```url
GET http://localhost:3000/api/data
```
Retrives the data from the JSON file. Supports filtering and sorting through query parameters.

Query Parameters:
* `filters`: JSON array of filter criteria.
* `sortBy`: Field to sort by.
* `sortOrder`: Sort order (asc or desc)
### Create Data
```url
POST http://localhost:3000/api/data
```
Creates a new data entry.  
* Request Body Example
    ```json
    {
    "name": "name",
    "language": "language",
    "id": "id",
    "bio": "Bio",
    "version": 3.2
  }
    ```
### Update Data
```url
PUT http://localhost:3000/api/data/:id
```
Updates an existing data entry by ID.
* Request Body Example
    ```json
    {
    "name": "updated_name",
    "language": "updated_language",
    "bio": "updated_bio",
    "version": 3.2//(replace with the updated version if any)
  }
    ```
### Delete Data
```url
DELETE http://localhost:3000/api/data/:id
```
Deletes a data entry by ID.


## Error Handling
* **400 Bad Request**: For invalid input or user already exists.
* **404 Not Found**: For non-existent data entries.
* **500 Internal Server Error**: For server-related issues.




 
    