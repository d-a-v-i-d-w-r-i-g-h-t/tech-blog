// global constants
const usernameInputField = document.getElementById('username-signup');
const emailInputField = document.getElementById('email-signup');
const usernameWarning = document.getElementById('usernameWarning');
const signUpButton = document.getElementById('sign-up-button');
const passwordInputField = document.getElementById('password-signup');

// set up Password Mismatch modal
const passwordMismatchModalEl = document.getElementById('passwordMismatchModal');
const passwordMismatchModal = new bootstrap.Modal(passwordMismatchModalEl, {
  keyboard: true
});

// set up Missing Data modal
const missingDataModalEl = document.getElementById('missingDataModal');
const missingDataModal = new bootstrap.Modal(missingDataModalEl, {
  keyboard: true
});


// set up Invalid Email modal
const invalidEmailModalEl = document.getElementById('invalidEmailModal');
const invalidEmailModal = new bootstrap.Modal(invalidEmailModalEl, {
  keyboard: true
});



    //////////////////////////
   //  IS USERNAME UNIQUE  // 
  //////////////////////////
 //
// function to continuously check if username is unique as it is entered 
async function isUsernameUnique(username) {
  try {
    // fetch request to check if a username is unique
    const response = await fetch(`/api/users/check-username/${username}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });  
    
    if (response.ok) {
      // fetch was successful
      const data = await response.json();
      return data.usernameIsUnique;
    } else {
      // fetch was unsuccessful
      console.error('Error: unable to confirm unique username.');
      return false;
    }  
  } catch (err) {
    console.error('Error: unable to confirm unique username.');
    return false;
  }  
}  



    //////////////////////////////
   //  IS EMAIL ADDRESS VALID  //
  //////////////////////////////
 //
// function to check if email address has valid format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}  



    //////////////////////////////////////
   //  EVENT LISTENER: USERNAME INPUT  //
  //////////////////////////////////////
 //
// event listener on the username input field
usernameInputField.addEventListener('input', async () => {
  const proposedUsername = usernameInputField.value.trim();
  if (proposedUsername !== '') {
    
    const usernameIsUnique = await isUsernameUnique(proposedUsername);
    
    // Warn user if username is too short; disable submit button to prevent input
    if (proposedUsername.length < 3) {
      signUpButton.setAttribute('disabled', true);
      usernameWarning.textContent = 'Username must be at least three characters.';
      
      // Warn user if username is not unique; red input text and disable submit button
    } else if (!usernameIsUnique) {
      signUpButton.setAttribute('disabled', true);
      usernameInputField.style.color = 'red';
      usernameWarning.textContent = 'Username is already taken.';
      
      // Username is acceptable; enable submit button, black input text, no warning
    } else {
      signUpButton.removeAttribute('disabled');
      usernameInputField.style.color = '';
      usernameWarning.textContent = '';
    }
  }
})



    ///////////////////////////////////
   //  EVENT LISTENER: EMAIL INPUT  //
  ///////////////////////////////////
 //
// event listener on the email input field
emailInputField.addEventListener('blur', () => {
  const email = emailInputField.value.trim();
  if (email) {
    
    // Check if the email is invalid
    if (!isValidEmail(email)) {

      // clear email input field
      emailInputField.value = '';

      // display modal to warn user
      invalidEmailModal.show();
    }
  }
});



    ////////////////////////////
   //  SIGN UP FORM HANDLER  //
  ////////////////////////////
 //
// handle form submit with various checks
const signupFormHandler = async (event) => {
  event.preventDefault();
  
  const passwordVerifyInput = document.getElementById('password-verify-signup');
  
  // gather the data from the form elements on the page
  const username = usernameInputField.value.trim();
  const email = emailInputField.value.trim();
  const password = passwordInputField.value.trim();
  const passwordVerify = passwordVerifyInput.value.trim();
  
  // check if the passwords match
  if (password !== passwordVerify) {
    
    // clear password input fields
    passwordInputField.value = '';
    passwordVerifyInput.value = '';
    
    // display modal to warn user
    passwordMismatchModal.show();
    return; // stop form submission
  }

  if (username && email && password) {
    try {
      // send the username, e-mail, and password to the server
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      // after a successful sign up, go to the home page (user is logged in)
      if (response.ok) {
        document.location.replace('/');
      } else {
        const errorData = await response.json();
        alert(`Failed to sign up: ${errorData.message || 'Unknown error'}`);
      } 
    } catch (err) {
      console.err('Error during form submission: ', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  } else {
    // sign up information is incomplete; warn user
    missingDataModal.show();
    return;
  }
};



    //////////////////////
   //  LOGIN REDIRECT  //
  //////////////////////
 //
// redirect to the login page
const redirectToLogin = async (event) => {
  event.preventDefault();

  window.location.href = '/login';
}



    ////////////////////////////
   //  MISC EVENT LISTENERS  //
  ////////////////////////////

// event listener for when password mismatch modal is fully hidden
passwordMismatchModalEl.addEventListener('hidden.bs.modal', () => {
  // reset focus back on first password input
  passwordInputField.focus();
});

// event listener for when missing data modal is fully hidden
missingDataModalEl.addEventListener('hidden.bs.modal', () => {
  // reset focus on empty field if any
  if (usernameInputField.value === '') {
    usernameInputField.focus();
  } else if (emailInputField.value === '') {
    emailInputField.focus();
  }
});

// event listener for when invalid email modal is fully hidden
invalidEmailModalEl.addEventListener('hidden.bs.modal', () => {
  // reset focus on email input field
    emailInputField.focus();
});

// event listener on the signup form submit button
document
  .getElementById('signup-form')
  .addEventListener('submit', signupFormHandler);

// event listener to redirect to the login page
document
  .getElementById('login-redirect')
  .addEventListener('click', redirectToLogin);
