/*
  Program name: homework3.js
  Author: Katherine Chin
  Date created: 04/17/2026
  Date last edited: 04/17/2026
  Version: 3.0
  Description: External JavaScript for homework3.html - MIS3371 Homework 3
*/

function el(id) {
    return document.getElementById(id);
}


function setError(id, message) {
    el("err-" + id).textContent = message;
    return message === "";
}


function trimVal(id) {
    return el(id).value.trim();
}


function setupDateAndHeader() {
    var today = new Date();
    var maxDate = today.toISOString().split("T")[0];
    var minYear = today.getFullYear() - 120;
    var minDate = minYear + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    el("dob").setAttribute("max", maxDate);
    el("dob").setAttribute("min", minDate);


    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = today.getDate();
    var suffix = "th";
    if (!(d > 3 && d < 21)) {
        suffix = ["th", "st", "nd", "rd"][Math.min(d % 10, 3)];
    }
    el("dateDisplay").textContent = "Today is: " + days[today.getDay()] + ", " + months[today.getMonth()] + " " + d + suffix + ", " + today.getFullYear();
}


function updatePainLabel(value) {
    var labels = {
        1: "No Pain", 2: "Very Mild", 3: "Mild", 4: "Moderate", 5: "Noticeable",
        6: "Moderate-Severe", 7: "Severe", 8: "Very Severe", 9: "Intense", 10: "Worst Possible Pain"
    };
    el("painDisplay").innerHTML = "<strong>" + value + " - " + labels[value] + "</strong>";
}


function formatDashedNumber(rawDigits, cuts) {
    var parts = [];
    var start = 0;
    for (var i = 0; i < cuts.length; i++) {
        var piece = rawDigits.substring(start, start + cuts[i]);
        if (piece) {
            parts.push(piece);
        }
        start += cuts[i];
    }
    return parts.join("-");
}


function validateName(id, label) {
    var v = trimVal(id);
    if (!v) {
        return setError(id, label + " is required.");
    }
    if (v.length < 1 || v.length > 30) {
        return setError(id, label + " must be 1 to 30 characters.");
    }
    if (!/^[A-Za-z'\-]+$/.test(v)) {
        return setError(id, label + " can use letters, apostrophes, and dashes only.");
    }
    return setError(id, "");
}


function validateMi() {
    var v = trimVal("mi");
    if (!v) {
        return setError("mi", "");
    }
    if (!/^[A-Za-z]$/.test(v)) {
        return setError("mi", "Middle initial must be one letter.");
    }
    return setError("mi", "");
}


function validateDob() {
    var v = trimVal("dob");
    if (!v) {
        return setError("dob", "Date of birth is required.");
    }
    var picked = new Date(v + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var min = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (picked > today) {
        return setError("dob", "Date of birth cannot be in the future.");
    }
    if (picked < min) {
        return setError("dob", "Date of birth cannot be more than 120 years ago.");
    }
    return setError("dob", "");
}


function validateSsn() {
    var input = el("ssn");
    var digits = input.value.replace(/\D/g, "").substring(0, 9);
    input.value = formatDashedNumber(digits, [3, 2, 4]);
    if (digits.length !== 9) {
        return setError("ssn", "SSN must be 9 digits.");
    }
    if (!/^\d{3}-\d{2}-\d{4}$/.test(input.value)) {
        return setError("ssn", "SSN format must be XXX-XX-XXXX.");
    }
    return setError("ssn", "");
}


function validateEmail() {
    var input = el("email");
    input.value = input.value.toLowerCase().trim();
    var v = input.value;
    if (!v) {
        return setError("email", "Email is required.");
    }
    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(v)) {
        return setError("email", "Email must be in format name@domain.tld.");
    }
    return setError("email", "");
}


function validatePhone() {
    var input = el("phone");
    var digits = input.value.replace(/\D/g, "").substring(0, 10);
    input.value = formatDashedNumber(digits, [3, 3, 4]);
    if (digits.length !== 10) {
        return setError("phone", "Phone must be 10 digits.");
    }
    return setError("phone", "");
}


function validateAddr1() {
    var v = trimVal("addr1");
    if (!v) {
        return setError("addr1", "Address line 1 is required.");
    }
    if (v.length < 2 || v.length > 30) {
        return setError("addr1", "Address line 1 must be 2 to 30 characters.");
    }
    return setError("addr1", "");
}


function validateAddr2() {
    var v = trimVal("addr2");
    if (!v) {
        return setError("addr2", "");
    }
    if (v.length < 2 || v.length > 30) {
        return setError("addr2", "Address line 2 must be 2 to 30 characters if entered.");
    }
    return setError("addr2", "");
}


function validateCity() {
    var v = trimVal("city");
    if (!v) {
        return setError("city", "City is required.");
    }
    if (v.length < 2 || v.length > 30) {
        return setError("city", "City must be 2 to 30 characters.");
    }
    if (!/^[A-Za-z .'\-]+$/.test(v)) {
        return setError("city", "City contains invalid characters.");
    }
    return setError("city", "");
}


function validateState() {
    if (!el("state").value) {
        return setError("state", "Please select a state.");
    }
    return setError("state", "");
}


function validateZip() {
    var input = el("zip");
    input.value = input.value.replace(/\D/g, "").substring(0, 5);
    if (!/^\d{5}$/.test(input.value)) {
        return setError("zip", "Zip must be exactly 5 digits.");
    }
    return setError("zip", "");
}


function validateSymptoms() {
    var v = trimVal("symptoms");
    if (!v) {
        return setError("symptoms", "");
    }
    if (v.length < 2) {
        return setError("symptoms", "If entered, symptoms should be at least 2 characters.");
    }
    return setError("symptoms", "");
}


function validateRadio(name, errId, label) {
    var selected = document.querySelector("input[name='" + name + "']:checked");
    if (!selected) {
        return setError(errId, "Please select " + label + ".");
    }
    return setError(errId, "");
}


function validateUserId() {
    var input = el("userid");
    input.value = input.value.toLowerCase().trim();
    var v = input.value;
    if (!v) {
        return setError("userid", "User ID is required.");
    }
    if (v.length < 5 || v.length > 20) {
        return setError("userid", "User ID must be 5 to 20 characters.");
    }
    if (/^[0-9]/.test(v)) {
        return setError("userid", "User ID cannot start with a number.");
    }
    if (!/^[a-z0-9_-]+$/.test(v)) {
        return setError("userid", "User ID can use letters, numbers, dash, and underscore only.");
    }
    return setError("userid", "");
}


function validatePassword() {
    var pw = el("pw").value;
    var uid = el("userid").value.toLowerCase();
    if (!pw) {
        return setError("pw", "Password is required.");
    }
    if (pw.length < 8) {
        return setError("pw", "Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) {
        return setError("pw", "Password needs uppercase, lowercase, and a number.");
    }
    if (pw.toLowerCase() === uid) {
        return setError("pw", "Password cannot equal your User ID.");
    }
    return setError("pw", "");
}


function validatePasswordMatch() {
    var pw = el("pw").value;
    var pw2 = el("pw2").value;
    if (!pw2) {
        return setError("pw2", "Please re-enter your password.");
    }
    if (pw !== pw2) {
        return setError("pw2", "Passwords do not match.");
    }
    return setError("pw2", "");
}


function validateAll() {
    var ok = true;
    ok = validateName("fname", "First name") && ok;
    ok = validateMi() && ok;
    ok = validateName("lname", "Last name") && ok;
    ok = validateDob() && ok;
    ok = validateSsn() && ok;
    ok = validateEmail() && ok;
    ok = validatePhone() && ok;
    ok = validateAddr1() && ok;
    ok = validateAddr2() && ok;
    ok = validateCity() && ok;
    ok = validateState() && ok;
    ok = validateZip() && ok;
    ok = validateSymptoms() && ok;
    ok = validateRadio("gender", "gender", "a gender option") && ok;
    ok = validateRadio("vaccinated", "vaccinated", "a vaccination option") && ok;
    ok = validateRadio("insurance", "insurance", "an insurance option") && ok;
    ok = validateUserId() && ok;
    ok = validatePassword() && ok;
    ok = validatePasswordMatch() && ok;
    return ok;
}


function showValidateState(isValid) {
    var status = el("validate-status");
    var submit = el("submitBtn");
    if (isValid) {
        status.classList.add("ok");
        status.textContent = "All fields look good. You can submit now.";
        submit.style.display = "inline-block";
    } else {
        status.classList.remove("ok");
        status.textContent = "Please fix the fields marked in red.";
        submit.style.display = "none";
    }
}


function reviewRow(label, value) {
    return "<tr><td><b>" + label + "</b></td><td>" + value + "</td></tr>";
}


function showReview() {
    var checkedHistory = [];
    var checks = document.querySelectorAll("input[name='history']:checked");
    for (var i = 0; i < checks.length; i++) {
        checkedHistory.push(checks[i].value);
    }
    var gender = document.querySelector("input[name='gender']:checked");
    var vaccinated = document.querySelector("input[name='vaccinated']:checked");
    var insurance = document.querySelector("input[name='insurance']:checked");


    var html = "<table class='review-table'><tr><th>Field</th><th>Your Entry</th></tr>";
    html += reviewRow("Full Name", trimVal("fname") + " " + trimVal("mi") + " " + trimVal("lname"));
    html += reviewRow("Date of Birth", trimVal("dob"));
    html += reviewRow("SSN", el("ssn").value ? "(hidden)" : "(blank)");
    html += reviewRow("Email", trimVal("email"));
    html += reviewRow("Phone", trimVal("phone"));
    html += reviewRow("Address", trimVal("addr1") + " " + trimVal("addr2"));
    html += reviewRow("City/State/Zip", trimVal("city") + ", " + el("state").value + " " + trimVal("zip"));
    html += reviewRow("Symptoms", trimVal("symptoms") || "(none)");
    html += reviewRow("History", checkedHistory.length ? checkedHistory.join(", ") : "None selected");
    html += reviewRow("Gender", gender ? gender.value : "(none)");
    html += reviewRow("Vaccinated", vaccinated ? vaccinated.value : "(none)");
    html += reviewRow("Insurance", insurance ? insurance.value : "(none)");
    html += reviewRow("Pain Level", el("pain").value);
    html += reviewRow("User ID", trimVal("userid"));
    html += "</table>";


    el("review-content").innerHTML = html;
    el("review-panel").style.display = "block";
}


function clearFormUi() {
    var errors = document.querySelectorAll(".err");
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = "";
    }
    el("submitBtn").style.display = "none";
    el("review-panel").style.display = "none";
    updatePainLabel(1);
}


function bindLiveValidation() {
    el("fname").addEventListener("input", function() { validateName("fname", "First name"); });
    el("mi").addEventListener("input", validateMi);
    el("lname").addEventListener("input", function() { validateName("lname", "Last name"); });
    el("dob").addEventListener("change", validateDob);
    el("ssn").addEventListener("input", validateSsn);
    el("email").addEventListener("input", validateEmail);
    el("phone").addEventListener("input", validatePhone);
    el("addr1").addEventListener("input", validateAddr1);
    el("addr2").addEventListener("input", validateAddr2);
    el("city").addEventListener("input", validateCity);
    el("state").addEventListener("change", validateState);
    el("zip").addEventListener("input", validateZip);
    el("symptoms").addEventListener("blur", validateSymptoms);
    el("userid").addEventListener("input", validateUserId);
    el("pw").addEventListener("input", function() { validatePassword(); validatePasswordMatch(); });
    el("pw2").addEventListener("input", validatePasswordMatch);
    el("pain").addEventListener("input", function(e) { updatePainLabel(e.target.value); });


    var radios = document.querySelectorAll("input[name='gender'], input[name='vaccinated'], input[name='insurance']");
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function() {
            validateRadio("gender", "gender", "a gender option");
            validateRadio("vaccinated", "vaccinated", "a vaccination option");
            validateRadio("insurance", "insurance", "an insurance option");
        });
    }
}


window.onload = function() {
    setupDateAndHeader();
    bindLiveValidation();


    el("validateBtn").addEventListener("click", function() {
        showValidateState(validateAll());
    });


    el("reviewBtn").addEventListener("click", showReview);


    el("resetBtn").addEventListener("click", function() {
        setTimeout(clearFormUi, 0);
    });


    el("regForm").addEventListener("submit", function(e) {
        e.preventDefault();
        var good = validateAll();
        showValidateState(good);
        if (good) {
            window.location.href = "homework3-thankyou.html";
        }
    });
};
