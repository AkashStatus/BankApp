# BankApp Demo

# Built With
- Node/Express - Used for creating RESTful api server
- MongoDb - Used as Db for storing all application States

# Getting and Starting Application

  #### Steps
   - 1. Use Command : git clone https://github.com/AkashStatus/BankApp.git
   - 2. navigate to /WorkSapaceFolder/Microservice/CustomerService and run  **npm install**  and **npm start**


# Basic Information about App

I have Added console.log() inside every Api to get to know what is happening inside Api.

MongoDb Configuration : path to file (workSpaceFolder/Microservice/CustomerService/config/contants.js)


## API End Points 
- Create User Account 
    - **POST  /v1/users/accounts**
- Add beneficiary
    - **POST /v1/users/beneficiary**
- Delete beneficiary by beneficiaryId
    - **DELETE /v1/users/:userId/beneficiary/:beneficiaryId**
- Create transaction 
    - **POST /v1/users/transactions**
-  Get Transaction by transactionId
    - **GET /v1/users/:userId/transactions/:transactionId**
- Get All transaction of user
    - **GET /v1/users/:userId/transactions**
- Transfer-Fund
    - **POST /v1/users/fund/transfer**
- GET User's Account Balance
    - **GET /v1/users/userId/accounts/balance**
- Calculate Interest for future Date
    - **POST /v1/users/interest**


### Registration Flow & Api
Since there is no info in Documentation for User Registration , so i assumed that i will be getting following data in **Request Body** at the time of user Registration
- first_name: 
- last_name: 
- unique_user_id:         *This should be unique name*
- email:  
- mobile_no:  
- password: 
- bank_address:  
- account_no: 
- account_type:  
- branch_name: 

*To Store Above data from Request Body i am using Two DB Collection*

#### 1. user collection  (path to file : workSpaceFolder/Microservice/CustomerService/model/user.js)
```
this model will contain following fields from request body
- first_name: 
- last_name: 
- unique_user_id: 
- email:  
- mobile_no:  
- password:
```

#### 2. account collection    (path to file : workSpaceFolder/Microservice/CustomerService/routes/account.js)
```
this model will contain following fields from request body
- user_id :           * This is reference key to UserModel. *
- bank_address:  
- account_no: 
- account_type:  
- branch_name:
```
##### Register Api  (path to file : workSpaceFolder/Microservice/CustomerService/routes/user.js)
```
 Register api takes data from request body and  first checks weather user with unique_user_id exists in DB or not , if user exists then it will send **User Already Exists** in response else  it will User & Account Info  in users collection & account collection respectively. 
```

### Login Flow & Api

#### Login Collection   (path to file : workSpaceFolder/Microservice/CustomerService/model/loginStatus.js)
To store login status i am using login_status collection. This Collection contains following fields
##### login_status collection
- user_id:          ** Reference to ObjectId of User Model **
- login_on:        *This is time of login*

Note: I dint save user's Session.

##### Login Api     (path to file : workSpaceFolder/Microservice/CustomerService/routes/login.js)

In Request Body send me ObjectId of registered User with his password that he sets at time of registration . Login Api will validate with both(ObjectId & password). If matches you will be logged in else user will get a simple response as **Please provide correct id and password** .

### Adding & Deleting beneficiary Flow & Api

#### beneficiary-users collection   (path to file : workSpaceFolder/Microservice/CustomerService/model/beneficiary.js)
- user_id:                      
- beneficiary_user_id:          *ObjectId of user to whom user is adding as beneficiary*
- first_name:
- beneficiary_account_no: 
- account_type: 

#### beneficiary Api        (path to file : workSpaceFolder/Microservice/CustomerService/routes/beneficiary.js)
    ```
    1. Add beneficiary 
        simple check if beneficiary user exists in DB or not. if exists add is him in beneficiary collection . 
    ```
    ```
    2. delete beneficiary by beneficiaryId
        find in DB with given beneficiaryId , if exists delete him.
    ```

### Transaction Flow & API    

#### transactions collection   (path to file : workSpaceFolder/Microservice/CustomerService/model/transaction.js)
 - user_id: String,     *ObjectId of User who makes transaction*
 - deposited_amount: Number,
 - withdrawal_amount: Number,
 - transferred_amount: Number,
 - is_paid: {type: Boolean ,default: false},
 - is_received: {type: Boolean ,default: false},
 - is_transferred: {type: Boolean ,default: false},
 - is_deposited: {type: Boolean ,default: false},
 - is_withdrawal: {type: Boolean, default: false}

### transaction Api     (path to file : workSpaceFolder/Microservice/CustomerService/routes/transaction.js)

  #### Add transaction   (path to file : workSpaceFolder/Microservice/CustomerService/routes/transaction.js)
   Steps : 
   1. take the details from request Body and save it in transaction Collection
   2. Now find the net_balance in account collection and update it with transaction amount

  #### Get transaction by transaction id (path to file : workSpaceFolder/Microservice/CustomerService/routes/transaction.js)
   Steps: 
   1. find the transaction from transaction collection belonging to transaction id
   2. send the found transaction in response body

  #### Delete Transaction belonging to a user  (path to file : workSpaceFolder/Microservice/CustomerService/routes/transaction.js)
   Steps: 
   1. find the transaction from transaction collection belonging to transaction id
   2. send the found transaction array in response body


### Fund-transfer Flow And Api
   
#### fund-transfers collection   (path to file : workSpaceFolder/Microservice/CustomerService/model/transfer-fund.js)
   - from_user_id:  {type: String, required: true},
   - to_user_id: {type: String, required: true},
   - from_account: {type: String, required: true},
   - to_account: {type: String, required: true},
   - transferred_amount: Number

 #### fund-transfer Api    (path to file : workSpaceFolder/Microservice/CustomerService/routes/transfer-fund.js)
   **Transfer balance**
    Steps: 
    1. find the user's account details from accounts collection who will transfer balance using *from_user_id* from Request Body
    2. update his net_balance with transferred_amount coming in Request Body
    3. Create a transaction for this user in transaction collection
    4. find receiver user's account details info who will be receiving amount  from account collection using to_user_id coming in Request Body.
    5. update his net_balance with transferred amount coming in request Body
    6. create a transaction in transactions collection for this user.
 **NOTE: At any point if fund transfer fails, Rollback the transaction**     


### Check Balance & Calculating interest
 
#### 1. get user account balance by userId  (path to file : workSpaceFolder/Microservice/CustomerService/routes/user.js)
  ``` Steps: 
     1. find the user's account details in accounts collection based on userId coming in request params.
     2. if found, return only net_balance.
  ```
  
#### 2. Calculate Interest at Base interest rate 4% for future dates (path to file :workSpaceFolder/Microservice/CustomerService/routes/user.js)
  ``` 
  Assumptions: 
  - 1. I assumed that 4% interest is given quarterly
  - 2. I assumed that date will be given in "2018-11-04" this format
  Steps: 
  -  1. find the user's account info from account collection based on userId coming in request body
  -  2. calculate interest for given date
  -  3. return the result in response body
   ```
 

## AWS EC2 Link : 
I hosted application on EC2 ubuntu instance .Click on below link to check running application. 
#### http://ec2-13-233-93-50.ap-south-1.compute.amazonaws.com:9000