# Reset Password Flow Documentation  
**Last Updated:** Feb. 09th, 2026  

---

## Purpose

Allows users to reset their password if forgotten and regain access to their account through Firebase.

### Ensures:

- Email-based password recovery
- Safe redirect handling after completion

---

## Key Reset Functions

The password reset function is located in `auth-api.js`.

This function allows a user to enter their email address, and Firebase sends a password reset link using its built-in:

```js
    export const resetPassword = async (email) => {
return await sendPasswordResetEmail(auth, email);
    };
```

## Resetting Password Flow

The reset functionality is contained in `reset.js`.

## Overview

- User clicks the **“Forgot Password”** link on the Login page
- User is redirected to the reset page
- User enters their email address in the form
- User clicks the **“Reset Password”** button
- Email address is validated
- A password reset email is sent
- User is redirected back to the Login page
- User clicks the **“Reset Password”** link in the email
- User is redirected to a new page
- User enters a new password and saves it

---

## Forgot Password

If a user forgets their password:

- They click the **“Forgot Password”** link on the Login page
- They are redirected to the reset page

```html 
<a
href="reset.html"
data-cy="reset-link"
class="forgot"
id="forgot-pswd"
data-cy="forgot-pswd"
>Forgot Password ?</a>


```

[![forget_password]][img1](./images/img1.png)

## Reset Form

On the reset page:

- User enters their email address into the form
- Clicks the **“Reset Password”** button to submit

 When the Button is Pressed:

- The reset function is called
- An email is sent to the entered email address
- User is redirected back to the Login page
- This process uses Firebase’s `sendPasswordResetEmail()` function


```html 
    <form id="reset-form">
<p class="user-message">Enter your email address below and we'll send y
<input type="email" id="reset-email" placehblder="Email Address" required>
<button class="create-btn" type="submit" data-cy="reset-btn">RESET PASS</button>

</form>
```
```js
try {
await resetPassword(email);
message. textContent =
"Password reset email sent! Check your inbox.";
message. style.color = "green";
resetForm.reset();
//
}
```



# Reset Email

When the user receives the email:

- The email contains a reset link
- Clicking the link redirects the user to a page
- The user enters a new password
- The new password is saved
- The user can now log in with the updated credentials



