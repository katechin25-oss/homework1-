/*
  Program name: script.js
  Author: Katherine Chin
  Date created: 03/26/2026
  Version: 2.0
  Description: External JavaScript for patient-form.html - MIS3371 Homework 2.
*/

// ---- SET DATE RANGE FOR DATE OF BIRTH ON PAGE LOAD ----
window.onload = function() {
    var today = new Date();

    // max = today (no future birthdays)
    var maxDate = today.toISOString().split('T')[0];

    // min = 120 years ago
    var minYear = today.getFullYear() - 120;
    var minDate = minYear + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    document.getElementById('dob').setAttribute('max', maxDate);
    document.getElementById('dob').setAttribute('min', minDate);

    // display today's date in the header
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var suffix = function(d) {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
    };
    document.getElementById("dateDisplay").innerHTML =
        "Today is: " + days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() + suffix(today.getDate()) + ", " + today.getFullYear();
};


//range slider js code - updates pain label as user drags
function updatePain(val) {
    var labels = {
        1: "No Pain", 2: "Very Mild", 3: "Mild", 4: "Moderate",
        5: "Noticeable", 6: "Moderate-Severe", 7: "Severe",
        8: "Very Severe", 9: "Intense", 10: "Worst Possible Pain"
    };
    document.getElementById('painDisplay').innerHTML = "<strong>" + val + " - " + labels[val] + "</strong>";
}


//validating user ID
function liveUserIdCheck(input) {
    // convert to lowercase right away
    input.value = input.value.toLowerCase();

    var val = input.value;

    if (val.length === 0) {
        document.getElementById('err-userid').innerHTML = "";
        return;
    }
    if (val.length < 5) {
        document.getElementById('err-userid').innerHTML = "User ID must be at least 5 characters.";
        return;
    }
    if (/^[0-9]/.test(val)) {
        document.getElementById('err-userid').innerHTML = "User ID cannot start with a number.";
        return;
    }
    if (/[^a-z0-9_\-]/.test(val)) {
        document.getElementById('err-userid').innerHTML = "Letters, numbers, underscores and dashes only. No spaces.";
        return;
    }
    document.getElementById('err-userid').innerHTML = "";
}


//validating password fields
function livePasswordCheck() {
    var pw  = document.getElementById('pw').value;
    var pw2 = document.getElementById('pw2').value;
    var userid = document.getElementById('userid').value.toLowerCase();
    var fname  = document.getElementById('fname').value.toLowerCase();
    var lname  = document.getElementById('lname').value.toLowerCase();

    document.getElementById('err-pw').innerHTML  = "";
    document.getElementById('err-pw2').innerHTML = "";

    if (pw.length === 0) {
        return;
    }
    if (pw.length < 8) {
        document.getElementById('err-pw').innerHTML = "Password must be at least 8 characters.";
        return;
    }
    if (pw.includes('"')) {
        document.getElementById('err-pw').innerHTML = "Password cannot contain double-quote characters.";
        return;
    }
    if (!/[A-Z]/.test(pw)) {
        document.getElementById('err-pw').innerHTML = "Password must have at least 1 uppercase letter.";
        return;
    }
    if (!/[a-z]/.test(pw)) {
        document.getElementById('err-pw').innerHTML = "Password must have at least 1 lowercase letter.";
        return;
    }
    if (!/[0-9]/.test(pw)) {
        document.getElementById('err-pw').innerHTML = "Password must have at least 1 number.";
        return;
    }
    if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw)) {
        document.getElementById('err-pw').innerHTML = "Password must have at least 1 special character (!@#%^&*()-_+=\\/><.,`~).";
        return;
    }
    if (userid.length >= 3 && pw.toLowerCase().includes(userid)) {
        document.getElementById('err-pw').innerHTML = "Password cannot contain your User ID.";
        return;
    }
    if (fname.length >= 3 && pw.toLowerCase().includes(fname)) {
        document.getElementById('err-pw').innerHTML = "Password cannot contain your first name.";
        return;
    }
    if (lname.length >= 3 && pw.toLowerCase().includes(lname)) {
        document.getElementById('err-pw').innerHTML = "Password cannot contain your last name.";
        return;
    }
    // check if passwords match (only if pw2 has been typed)
    if (pw2.length > 0 && pw !== pw2) {
        document.getElementById('err-pw2').innerHTML = "Passwords do not match.";
    }
}


//review button - collects all form data and displays with pass/error status
function showReview() {
    var fname    = document.getElementById('fname').value;
    var mi       = document.getElementById('mi').value;
    var lname    = document.getElementById('lname').value;
    var dob      = document.getElementById('dob').value;
    var ssn      = document.getElementById('ssn').value;
    var email    = document.getElementById('email').value;
    var phone    = document.getElementById('phone').value;
    var addr1    = document.getElementById('addr1').value;
    var addr2    = document.getElementById('addr2').value;
    var city     = document.getElementById('city').value;
    var state    = document.getElementById('state').value;
    var zipRaw   = document.getElementById('zip').value;
    var zip      = zipRaw.substring(0, 5); // truncate to first 5 digits
    var symptoms = document.getElementById('symptoms').value;
    var userid   = document.getElementById('userid').value.toLowerCase();
    var pw       = document.getElementById('pw').value;
    var pw2      = document.getElementById('pw2').value;
    var painDisp = document.getElementById('painDisplay').innerHTML;

    // get checked checkboxes
    var history = [];
    var checkboxes = document.querySelectorAll('input[name="history"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        history.push(checkboxes[i].value);
    }

    // get radio button values
    var genderEl     = document.querySelector('input[name="gender"]:checked');
    var vaccinatedEl = document.querySelector('input[name="vaccinated"]:checked');
    var insuranceEl  = document.querySelector('input[name="insurance"]:checked');
    var gender     = genderEl     ? genderEl.value     : '';
    var vaccinated = vaccinatedEl ? vaccinatedEl.value : '';
    var insurance  = insuranceEl  ? insuranceEl.value  : '';

    // check date of birth range
    var today   = new Date(); today.setHours(0,0,0,0);
    var minDOB  = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    var dobDate = dob ? new Date(dob) : null;
    var dobStatus = 'PASS';
    if (!dob) {
        dobStatus = 'ERROR: Date of birth is required.';
    } else if (dobDate > today) {
        dobStatus = 'ERROR: Cannot be in the future.';
    } else if (dobDate < minDOB) {
        dobStatus = 'ERROR: Date is more than 120 years ago.';
    }

    // build the review table
    var html = '<table class="review-table">';
    html += '<tr><th>Field</th><th>Your Entry</th><th>Status</th></tr>';

    // name
    var nameStr = fname + (mi ? ' ' + mi + '.' : '') + ' ' + lname;
    html += reviewRow('Full Name', nameStr, (fname && lname) ? 'PASS' : 'ERROR: First and last name required.');

    // date of birth
    html += reviewRow('Date of Birth', dob || '(blank)', dobStatus);

    // ssn - show hidden for security
    html += reviewRow('SSN', ssn ? '(hidden)' : '(blank)', /^\d{3}-\d{2}-\d{4}$/.test(ssn) ? 'PASS' : 'ERROR: Must be in format XXX-XX-XXXX.');

    // email
    html += reviewRow('Email', email || '(blank)', /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email) ? 'PASS' : 'ERROR: Invalid email format.');

    // phone
    html += reviewRow('Phone', phone || '(blank)', /^\d{3}-\d{3}-\d{4}$/.test(phone) ? 'PASS' : 'ERROR: Must be in format 000-000-0000.');

    // address
    html += reviewRow('Address Line 1', addr1 || '(blank)', addr1.length >= 2 ? 'PASS' : 'ERROR: Required, at least 2 characters.');
    html += reviewRow('Address Line 2', addr2 || '(none)', (addr2 === '' || addr2.length >= 2) ? 'PASS' : 'ERROR: If entered, must be 2-30 characters.');
    html += reviewRow('City', city || '(blank)', city.length >= 2 ? 'PASS' : 'ERROR: Required, at least 2 characters.');
    html += reviewRow('State', state || '(blank)', state ? 'PASS' : 'ERROR: Please select a state.');
    html += reviewRow('Zip Code (first 5)', zip || '(blank)', /^\d{5}$/.test(zip) ? 'PASS' : 'ERROR: Must be 5 digits.');

    // medical history
    html += reviewRow('Medical History', history.length > 0 ? history.join(', ') : 'None selected', 'PASS');
    html += reviewRow('Gender', gender || '(blank)', gender ? 'PASS' : 'ERROR: Please select a gender.');
    html += reviewRow('Vaccinated?', vaccinated || '(blank)', vaccinated ? 'PASS' : 'ERROR: Please select yes or no.');
    html += reviewRow('Has Insurance?', insurance || '(blank)', insurance ? 'PASS' : 'ERROR: Please select yes or no.');
    html += reviewRow('Pain Level', painDisp, 'PASS');
    html += reviewRow('Symptoms', symptoms || '(none)', symptoms.includes('"') ? 'ERROR: No double-quote characters allowed.' : 'PASS');

    // account info
    html += reviewRow('User ID', userid || '(blank)', checkUserId(userid));
    html += reviewRow('Password', pw ? '(entered - not shown)' : '(blank)', checkPassword(pw, userid, fname.toLowerCase(), lname.toLowerCase()));
    html += reviewRow('Passwords Match?', (pw && pw === pw2) ? 'Yes' : 'No', (pw && pw === pw2) ? 'PASS' : 'ERROR: Passwords do not match.');

    html += '</table>';

    document.getElementById('review-content').innerHTML = html;
    document.getElementById('review-panel').style.display = 'block';

    // scroll down to the review panel
    document.getElementById('review-panel').scrollIntoView({behavior: 'smooth'});
}


//clears the review panel when form is reset
function clearReview() {
    document.getElementById('review-panel').style.display = 'none';
    document.getElementById('review-content').innerHTML = '';
    document.getElementById('painDisplay').innerHTML = '<strong>1 - No Pain</strong>';
    document.getElementById('pain').value = 1;
}


//final validation before form submits
function handleSubmit() {
    var pw     = document.getElementById('pw').value;
    var pw2    = document.getElementById('pw2').value;
    var userid = document.getElementById('userid').value.toLowerCase();
    var fname  = document.getElementById('fname').value.toLowerCase();
    var lname  = document.getElementById('lname').value.toLowerCase();

    // check passwords match
    if (pw !== pw2) {
        document.getElementById('err-pw2').innerHTML = "Passwords do not match!";
        document.getElementById('pw2').focus();
        return false;
    }

    // check password strength
    var pwResult = checkPassword(pw, userid, fname, lname);
    if (pwResult !== 'PASS') {
        document.getElementById('err-pw').innerHTML = pwResult;
        return false;
    }

    // check symptoms for double quotes
    var symptoms = document.getElementById('symptoms').value;
    if (symptoms.includes('"')) {
        document.getElementById('err-symptoms').innerHTML = "Remove double-quote characters from symptoms.";
        return false;
    }

    // save userid as lowercase
    document.getElementById('userid').value = userid;

    // go to thank you page
    window.location.href = 'thankyou.html';
    return false;
}


//helper function - builds one row for the review table
function reviewRow(label, value, status) {
    var color = (status === 'PASS') ? 'green' : 'red';
    var icon  = (status === 'PASS') ? '✔ PASS' : '✘ ' + status;
    return '<tr><td><b>' + label + '</b></td><td>' + value + '</td><td style="color:' + color + ';">' + icon + '</td></tr>';
}


//helper function - checks if user ID is valid
function checkUserId(uid) {
    if (!uid) {
        return 'ERROR: User ID is required.';
    }
    if (uid.length < 5) {
        return 'ERROR: Must be at least 5 characters.';
    }
    if (/^[0-9]/.test(uid)) {
        return 'ERROR: Cannot start with a number.';
    }
    if (/[^a-z0-9_\-]/.test(uid)) {
        return 'ERROR: No special characters or spaces allowed.';
    }
    return 'PASS';
}


//helper function - checks if password meets all requirements
function checkPassword(pw, userid, fname, lname) {
    if (!pw) {
        return 'ERROR: Password is required.';
    }
    if (pw.length < 8) {
        return 'ERROR: Must be at least 8 characters.';
    }
    if (pw.length > 30) {
        return 'ERROR: Cannot exceed 30 characters.';
    }
    if (pw.includes('"')) {
        return 'ERROR: Cannot contain double-quote characters.';
    }
    if (!/[A-Z]/.test(pw)) {
        return 'ERROR: Must have at least 1 uppercase letter.';
    }
    if (!/[a-z]/.test(pw)) {
        return 'ERROR: Must have at least 1 lowercase letter.';
    }
    if (!/[0-9]/.test(pw)) {
        return 'ERROR: Must have at least 1 number.';
    }
    if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw)) {
        return 'ERROR: Must have at least 1 special character.';
    }
    if (userid.length >= 3 && pw.toLowerCase().includes(userid)) {
        return 'ERROR: Cannot contain your User ID.';
    }
    if (fname.length >= 3 && pw.toLowerCase().includes(fname)) {
        return 'ERROR: Cannot contain your first name.';
    }
    if (lname.length >= 3 && pw.toLowerCase().includes(lname)) {
        return 'ERROR: Cannot contain your last name.';
    }
    return 'PASS';
}
