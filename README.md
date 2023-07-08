# Assignment 03

# Application Routes

> User
> 

| Request Name | Request Type | Route |
| --- | --- | --- |
| Create User | POST | /api/v1/auth/signup |
| Get All Users | GET | /api/v1/users |
| Get User By ID | GET | /api/v1/users/:id |
| Update User By ID | PATCH | /api/v1/users/:id |
| Delete User By ID | DELETE | /api/v1/users/:id |

> Cow
> 

| Request Name | Request Type | Route |
| --- | --- | --- |
| Create Cow | POST | /api/v1/cows |
| Get All Cows | GET | /api/v1/cows |
| Get Cow By ID | GET | /api/v1/cows/:id |
| Update Cow By ID | PATCH | /api/v1/cows/:id |
| Delete Cow By ID | DELETE | /api/v1/cows/:id |

> Pagination and Filtering Routes of Cows
> 

| Request Name | Request Type | Route |
| --- | --- | --- |
|  | GET | api/v1/cows?pag=1&limit=10 |
|  | GET | api/v1/cows?sortBy=price&sortOrder=asc |
|  | GET | api/v1/cows?minPrice=20000&maxPrice=70000 |
|  | GET | api/v1/cows?location=Chattogram |
|  | GET | api/v1/cows?searchTerm=Cha |