const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.beforeCreate = functions.auth.user().beforeCreate((user) => {
  const email = user.email;
  const universityDomain = "@univ.jfn.ac.lk";

  if (email.endsWith(universityDomain)) {
    console.log("Registration successful!");
    return Promise.resolve();
  } else {
    console.error("Only university emails are allowed.");
    return Promise.reject(new functions.auth.HttpsError('invalid-argument', 'Only @univ.jfn.ac.lk email addresses are allowed to register.'));
  }
});

exports.beforeSignIn = functions.auth.user().beforeSignIn((user) => {
  const email = user.email;
  const universityDomain = "@univ.jfn.ac.lk";

  if (email.endsWith(universityDomain)) {
    console.log("Login successful!");
    return Promise.resolve();
  } else {
    console.error("Only university emails are allowed.");
    return Promise.reject(new functions.auth.HttpsError('invalid-argument', 'Only @univ.jfn.ac.lk email addresses are allowed to sign in.'));
  }
});