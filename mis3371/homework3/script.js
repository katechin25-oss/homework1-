/*
  Program name: script.js
  Author: Katherine Chin
  Date created: 04/17/2026
  Date last edited: 04/17/2026
  Version: 3.0
  Description: External JavaScript for homework3.html - MIS3371 Homework 3
*/

// ---- Error Tracker ----
var formErrors = {
    fname: true, lname: true, dob: true, ssn: true, 
    email: true, zip: true, userid: true, pw: true, pw2: true
};

// ---- Utility functions ----
function setError(id, msg) {
    document.getElementById(id).innerHTML = msg;
}

function clearError(id) {
    document.getElementById(id).innerHTML = "";
}

// Check if form is valid for submit button
function checkFormStatus() {
    var isValid = true;
    for (var key in formErrors) {
        if (formErrors[key] === true) isValid = false;
    }
    document.getElementById("submitBtn").style.display = isValid ? "block" : "none";
}

// ---- Name validation ----
function validateName(fieldId, errId, key) {
    var val = document.getElementById(fieldId).value;
    var regex = /^[A-Za-z'\-]+$/;
    if (val.length < 1 || val.length > 30 || !regex.test(val)) {
        setError(errId, "Invalid format (1-30 chars, letters/dashes/apostrophes only).");
        formErrors[key] = true;
    } else {
        clearError(errId);
        formErrors[key] = false;
    }
    checkFormStatus();
}

// ---- DOB validation ----
function validateDOB() {
    var dob = document.getElementById("dob").value;
    var dateObj = new Date(dob);
    var today = new Date();
    var minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);

    if (!dob || dateObj > today || dateObj < minDate) {
        setError("err-dob", "Invalid date (cannot be future or > 120 years ago).");
        formErrors.dob = true;
    } else {
        clearError("err-dob");
        formErrors.dob = false;
    }
    checkFormStatus();
}

// ---- SSN format and validation ----
function formatSSN(input) {
    var val = input.value.replace(/\D/g, ''); 
    if (val.length > 9) val = val.substring(0, 9);
    
    if (val.length > 5) {
        val = val.substring(0,3) + '-' + val.substring(3,5) + '-' + val.substring(5);
    } else if (val.length > 3) {
        val = val.substring(0,3) + '-' + val.substring(3);
    }
    input.value = val;
    
    if (val.length === 11) {
        clearError("err-ssn");
        formErrors.ssn = false;
    } else {
        setError("err-ssn", "Must be 9 digits.");
        formErrors.ssn = true;
    }
    checkFormStatus();
}

// ---- Email validation ----
function validateEmail() {
    var val = document.getElementById("email").value.toLowerCase();
    var regex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
    if (!regex.test(val)) {
        setError("err-email", "Invalid email format.");
        formErrors.email = true;
    } else {
        clearError("err-email");
        formErrors.email = false;
    }
    checkFormStatus();
}

// ---- Zip validation ----
function validateZip() {
    var val = document.getElementById("zip").value;
    if (/^\d{5}$/.test(val)) {
        clearError("err-zip");
        formErrors.zip = false;
    } else {
        setError("err-zip", "Must be 5 digits.");
        formErrors.zip = true;
    }
    checkFormStatus();
}

// ---- User ID validation ----
function validateUserId() {
    var val = document.getElementById("userid").value;
    if (val.length < 5 || val.length > 20 || /^[0-9]/.test(val) || /[^A-Za-z0-9_\-]/.test(val)) {
        setError("err-userid", "Invalid ID (5-20 chars, start with letter, no special chars).");
        formErrors.userid = true;
    } else {
        clearError("err-userid");
        formErrors.userid = false;
    }
    checkFormStatus();
}

// ---- Password validation ----
function validatePasswords() {
    var pw = document.getElementById("pw").value;
    var pw2 = document.getElementById("pw2").value;
    var uid = document.getElementById("userid").value;

    if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) {
        setError("err-pw", "Password too weak (8+ chars, upper, lower, number).");
        formErrors.pw = true;
    } else if (pw === uid) {
        setError("err-pw", "Password cannot match User ID.");
        formErrors.pw = true;
    } else {
        clearError("err-pw");
        formErrors.pw = false;
    }

    if (pw !== pw2) {
        setError("err-pw2", "Passwords do not match.");
        formErrors.pw2 = true;
    } else {
        clearError("err-pw2");
        formErrors.pw2 = false;
    }
    checkFormStatus();
}

// ---- Master form submission ----
function validateForm() {
    for (var key in formErrors) {
        if (formErrors[key] === true) {
            alert("Please fix all errors before submitting.");
            return false;
        }
    }
    window.location.href = "thankyou.html";
    return false;
}
