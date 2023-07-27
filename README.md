# Assignment 04

# Live Link: [https://digital-cow-hut-auth-backend-sigma.vercel.app/](https://digital-cow-hut-auth-backend-sigma.vercel.app/)

# **Application Routes**

### Main Part

> **AUTH (User)**

| Request       | Route                                                                           | Method |
| ------------- | ------------------------------------------------------------------------------- | ------ |
| Login         | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/auth/login         | POST   |
| Sign Up       | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/auth/signup        | POST   |
| Refresh Token | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/auth/refresh-token | POST   |

> **Auth (Admin)**

| Request      | Route                                                                            | Method |
| ------------ | -------------------------------------------------------------------------------- | ------ |
| Create Admin | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/admins/create-admin | POST   |
| Login        | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/admins/login        | POST   |

> **User**

| Request            | Route                                                                                       | Method     |
| ------------------ | ------------------------------------------------------------------------------------------- | ---------- |
| Get All Users      | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users                          | GET        |
| Get Single User    | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users/64c2d16e9d2dad47169a16dd | Single GET |
| Update Single User | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users/64c2d16e9d2dad47169a16dd | PATCH      |
| Delete Single User | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users/64c2d16e9d2dad47169a16dd | DELETE     |

> **Cows**

| Request           | Route                                                                                      | Method     |
| ----------------- | ------------------------------------------------------------------------------------------ | ---------- |
| Create Cow        | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/cows                          | POST       |
| Get All Cow       | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/cows                          | GET        |
| Get Single Cow    | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/cows/64c2d1f93ac8065561057480 | Single GET |
| Update Single Cow | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/cows/64c2d1f93ac8065561057480 | PATCH      |
| Delete Single Cow | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/cows/64c2d1f93ac8065561057480 | DELETE     |

> **Orders**

| Request        | Route                                                               | Method |
| -------------- | ------------------------------------------------------------------- | ------ |
| Create Order   | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/orders | POST   |
| Get All Orders | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/orders | GET    |

### **Bonus Part**

> Admin

| Request      | Route                                                                            | Method |
| ------------ | -------------------------------------------------------------------------------- | ------ |
| Create Admin | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/admins/create-admin | POST   |

> **My Profile**

| Request           | Route                                                                         | Method |
| ----------------- | ----------------------------------------------------------------------------- | ------ |
| Get My Profile    | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users/my-profile | GET    |
| Update My Profile | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/users/my-profile | PATCH  |

> **Order**

| Request          | Route                                                                                        | Method |
| ---------------- | -------------------------------------------------------------------------------------------- | ------ |
| Get Single Order | https://digital-cow-hut-auth-backend-sigma.vercel.app/api/v1/orders/64c2d25f3ac806556105748a | GET    |
