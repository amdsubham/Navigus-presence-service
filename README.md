
This application is made using React.js(ES6) Framework and firebase as a database. This application is deployed in heroku server. This application is fully responsive and consists of 3 main pages, 

- Create-Account 
- Login (Authentication module)
- HomePage

Each pages include some features and validation process as described.

Create Account page:
Input Fields- 
FullName - (Length Should not be null ).
Email- (email should be in email format).
Password- (password must contain one uppercase, lowercase, symbol and number).
Confirm Password- (confirm password should be same as Password).
Choose Avatar- (choose a avatar of your choice.)


When user will submit, an account will be registered. User can login to his account to using the following login process.

Login page:
Input Fields- 

Email- (email should be in email format).
Password- (password must contain one uppercase, lowercase, symbol and number).

If the credentials are wrong then it will move to showing an error message, After successful login the user will be moved to User home Page
User will be able to see the documents.  
User timestamp will be taken and he will be added as pastViewer to the document.
User has option to check who is presently online by clicking present viewer button.
User can check the past viewers to the document as well by clicking past viewer button.

There is a avatar section when user can check the presently online users avatars.

Logout:

When user clicks on the logout button. The system will remove user from present online viewers section and will redirect to login page.

