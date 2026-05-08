/*
  Program name: homework4.js
  Author: Katherine Chin
  Date created: 05/06/2026
  Date last edited: 05/06/2026
  Version: 4.0
  Description: JavaScript for Homework 4.
*/


/* ============================================================
   HELPER FUNCTIONS (same as homework3)
   ============================================================ */

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


/* ============================================================
   FETCH API
   Loads states from states.txt and fills the state dropdown.
   Uses try/catch so if the file fails, a fallback message shows.
   ============================================================ */

function loadStates() {
    fetch("states.txt")
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            var lines = text.trim().split("\n");
            var select = el("state");

            // Clear the loading placeholder
            select.innerHTML = '<option value="">-- Select --</option>';

            // Add each state from the file as an option
            for (var i = 0; i < lines.length; i++) {
                var state = lines[i].trim();
                if (state) {
                    var option = document.createElement("option");
                    option.value = state;
                    option.textContent = state;
                    select.appendChild(option);
                }
            }
        })
        .catch(function(error) {
            // If fetch fails, show a fallback message in the dropdown
            el("state").innerHTML = '<option value="">-- Could not load states --</option>';
            console.log("Fetch error: " + error);
        });
}


/* ============================================================
   COOKIE FUNCTIONS
   Simple helpers to set, get, and delete a cookie by name.
   Cookie expires in 48 hours as professor requested.
   ============================================================ */

function setCookie(name, value) {
    // 48 hours expiry
    var expires = new Date();
    expires.setTime(expires.getTime() + (48 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + "; path=/";
}

function getCookie(name) {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(name + "=") === 0) {
            return c.substring((name + "=").length);
        }
    }
    return "";
}

function deleteCookie(name) {
    // Set expiry to the past to delete it
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}


/* ============================================================
   LOCAL STORAGE FUNCTIONS
   Save and load non-sensitive form fields.
   SSN and password are NOT saved (those are secure/sensitive).
   ============================================================ */

function saveToLocalStorage() {
    localStorage.setItem("hw4_fname",     trimVal("fname"));
    localStorage.setItem("hw4_mi",        trimVal("mi"));
    localStorage.setItem("hw4_lname",     trimVal("lname"));
    localStorage.setItem("hw4_dob",       trimVal("dob"));
    localStorage.setItem("hw4_email",     trimVal("email"));
    localStorage.setItem("hw4_phone",     trimVal("phone"));
    localStorage.setItem("hw4_addr1",     trimVal("addr1"));
    localStorage.setItem("hw4_addr2",     trimVal("addr2"));
    localStorage.setItem("hw4_city",      trimVal("city"));
    localStorage.setItem("hw4_state",     el("state").value);
    localStorage.setItem("hw4_zip",       trimVal("zip"));
    localStorage.setItem("hw4_symptoms",  trimVal("symptoms"));
    localStorage.setItem("hw4_userid",    trimVal("userid"));
    localStorage.setItem("hw4_pain",      el("pain").value);

    // Save gender radio
    var gender = document.querySelector("input[name='gender']:checked");
    localStorage.setItem("hw4_gender", gender ? gender.value : "");

    // Save vaccinated radio
    var vaccinated = document.querySelector("input[name='vaccinated']:checked");
    localStorage.setItem("hw4_vaccinated", vaccinated ? vaccinated.value : "");

    // Save insurance radio
    var insurance = document.querySelector("input[name='insurance']:checked");
    localStorage.setItem("hw4_insurance", insurance ? insurance.value : "");

    // Save checkboxes as a comma-separated list
    var checkedHistory = [];
    var checks = document.querySelectorAll("input[name='history']:checked");
    for (var i = 0; i < checks.length; i++) {
        checkedHistory.push(checks[i].value);
    }
    localStorage.setItem("hw4_history", checkedHistory.join(","));
}

function loadFromLocalStorage() {
    // Load simple text fields
    var fields = ["fname", "mi", "lname", "dob", "email", "phone",
                  "addr1", "addr2", "city", "zip", "symptoms", "userid"];
    for (var i = 0; i < fields.length; i++) {
        var saved = localStorage.getItem("hw4_" + fields[i]);
        if (saved) {
            el(fields[i]).value = saved;
        }
    }

    // Load state dropdown
    var savedState = localStorage.getItem("hw4_state");
    if (savedState) {
        el("state").value = savedState;
    }

    // Load pain slider
    var savedPain = localStorage.getItem("hw4_pain");
    if (savedPain) {
        el("pain").value = savedPain;
        updatePainLabel(savedPain);
    }

    // Load gender radio
    var savedGender = localStorage.getItem("hw4_gender");
    if (savedGender) {
        var genderRadio = document.querySelector("input[name='gender'][value='" + savedGender + "']");
        if (genderRadio) { genderRadio.checked = true; }
    }

    // Load vaccinated radio
    var savedVaccinated = localStorage.getItem("hw4_vaccinated");
    if (savedVaccinated) {
        var vacRadio = document.querySelector("input[name='vaccinated'][value='" + savedVaccinated + "']");
        if (vacRadio) { vacRadio.checked = true; }
    }

    // Load insurance radio
    var savedInsurance = localStorage.getItem("hw4_insurance");
    if (savedInsurance) {
        var insRadio = document.querySelector("input[name='insurance'][value='" + savedInsurance + "']");
        if (insRadio) { insRadio.checked = true; }
    }

    // Load checkboxes
    var savedHistory = localStorage.getItem("hw4_history");
    if (savedHistory && savedHistory !== "") {
        var historyValues = savedHistory.split(",");
        for (var j = 0; j < historyValues.length; j++) {
            var cb = document.querySelector("input[name='history'][value='" + historyValues[j] + "']");
            if (cb) { cb.checked = true; }
        }
    }
}

function clearLocalStorage() {
    // Remove all hw4 keys from local storage
    var keys = ["hw4_fname", "hw4_mi", "hw4_lname", "hw4_dob", "hw4_email",
                "hw4_phone", "hw4_addr1", "hw4_addr2", "hw4_city", "hw4_state",
                "hw4_zip", "hw4_symptoms", "hw4_userid", "hw4_pain",
                "hw4_gender", "hw4_vaccinated", "hw4_insurance", "hw4_history"];
    for (var i = 0; i < keys.length; i++) {
        localStorage.removeItem(keys[i]);
    }
}


/* ============================================================
   COOKIE + LOCAL STORAGE ON PAGE LOAD
   Check if user has been here before using the cookie.
   If yes: show welcome back message, load their saved data.
   If no: show welcome new user message.
   ============================================================ */

function checkCookieOnLoad() {
    var savedName = getCookie("hw4_firstname");

    if (savedName) {
        // Returning user — show welcome back in header
        el("welcomeMsg").textContent = "Welcome back, " + savedName + "!";

        // Show the "not me" checkbox
        el("notMeLabel").textContent = "Not " + savedName + "? Click here to start as a new user.";
        el("new-user-notice").style.display = "block";

        // Load their saved form data from local storage
        loadFromLocalStorage();

    } else {
        // New user
        el("welcomeMsg").textContent = "Welcome, New User!";
    }
}


/* ============================================================
   "NOT ME" CHECKBOX
   If the user says it is not them, delete cookie and local
   storage so they start fresh as a new user.
   ============================================================ */

function setupNotMeCheckbox() {
    el("notMeCheck").addEventListener("change", function() {
        if (this.checked) {
            var confirmed = confirm("Are you sure you want to start over as a new user? Your saved information will be cleared.");
            if (confirmed) {
                deleteCookie("hw4_firstname");
                clearLocalStorage();
                el("new-user-notice").style.display = "none";
                el("welcomeMsg").textContent = "Welcome, New User!";
                el("regForm").reset();
                clearFormUi();
            } else {
                // They changed their mind — uncheck it
                this.checked = false;
            }
        }
    });
}


/* ============================================================
   REMEMBER ME CHECKBOX
   If unchecked on submit, expire cookie and clear local data.
   If checked, save the cookie and local data.
   ============================================================ */

function handleRememberMe(firstName) {
    var rememberMe = el("rememberMe").checked;
    if (rememberMe) {
        setCookie("hw4_firstname", firstName);
        saveToLocalStorage();
    } else {
        deleteCookie("hw4_firstname");
        clearLocalStorage();
    }
}


/* ============================================================
   BIND LOCAL STORAGE SAVES ON BLUR
   Save each field to local storage when user leaves that field.
   This way data is saved as they fill in the form.
   ============================================================ */

function bindLocalStorageSaves() {
    var textFields = ["fname", "mi", "lname", "dob", "email", "phone",
                      "addr1", "addr2", "city", "zip", "symptoms", "userid"];

    for (var i = 0; i < textFields.length; i++) {
        // Using a closure so the variable is captured correctly in the loop
        (function(fieldId) {
            el(fieldId).addEventListener("blur", function() {
                saveToLocalStorage();
            });
        })(textFields[i]);
    }

    el("state").addEventListener("change", saveToLocalStorage);
    el("pain").addEventListener("input", saveToLocalStorage);

    var radios = document.querySelectorAll("input[name='gender'], input[name='vaccinated'], input[name='insurance']");
    for (var j = 0; j < radios.length; j++) {
        radios[j].addEventListener("change", saveToLocalStorage);
    }

    var checkboxes = document.querySelectorAll("input[name='history']");
    for (var k = 0; k < checkboxes.length; k++) {
        checkboxes[k].addEventListener("change", saveToLocalStorage);
    }
}


/* ============================================================
   DATE AND HEADER SETUP (same as homework3)
   ============================================================ */

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


/* ============================================================
   PAIN LABEL (same as homework3)
   ============================================================ */

function updatePainLabel(value) {
    var labels = {
        1: "No Pain", 2: "Very Mild", 3: "Mild", 4: "Moderate", 5: "Noticeable",
        6: "Moderate-Severe", 7: "Severe", 8: "Very Severe", 9: "Intense", 10: "Worst Possible Pain"
    };
    el("painDisplay").innerHTML = "<strong>" + value + " - " + labels[value] + "</strong>";
}


/* ============================================================
   FORMAT HELPER (same as homework3)
   ============================================================ */

function formatDashedNumber(rawDigits, cuts) {
    var parts = [];
    var start = 0;
    for (var i = 0; i < cuts.length; i++) {
        var piece = rawDigits.substring(start, start + cuts[i]);
        if (piece) { parts.push(piece); }
        start += cuts[i];
    }
    return parts.join("-");
}


/* ============================================================
   VALIDATION FUNCTIONS (same as homework3)
   ============================================================ */

function validateName(id, label) {
    var v = trimVal(id);
    if (!v) { return setError(id, label + " is required."); }
    if (v.length < 1 || v.length > 30) { return setError(id, label + " must be 1 to 30 characters."); }
    if (!/^[A-Za-z'\-]+$/.test(v)) { return setError(id, label + " can use letters, apostrophes, and dashes only."); }
    return setError(id, "");
}

function validateMi() {
    var v = trimVal("mi");
    if (!v) { return setError("mi", ""); }
    if (!/^[A-Za-z]$/.test(v)) { return setError("mi", "Middle initial must be one letter."); }
    return setError("mi", "");
}

function validateDob() {
    var v = trimVal("dob");
    if (!v) { return setError("dob", "Date of birth is required."); }
    var picked = new Date(v + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var min = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (picked > today) { return setError("dob", "Date of birth cannot be in the future."); }
    if (picked < min) { return setError("dob", "Date of birth cannot be more than 120 years ago."); }
    return setError("dob", "");
}

function validateSsn() {
    var input = el("ssn");
    var digits = input.value.replace(/\D/g, "").substring(0, 9);
    input.value = formatDashedNumber(digits, [3, 2, 4]);
    if (digits.length !== 9) { return setError("ssn", "SSN must be 9 digits."); }
    if (!/^\d{3}-\d{2}-\d{4}$/.test(input.value)) { return setError("ssn", "SSN format must be XXX-XX-XXXX."); }
    return setError("ssn", "");
}

function validateEmail() {
    var input = el("email");
    input.value = input.value.toLowerCase().trim();
    var v = input.value;
    if (!v) { return setError("email", "Email is required."); }
    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(v)) { return setError("email", "Email must be in format name@domain.tld."); }
    return setError("email", "");
}

function validatePhone() {
    var input = el("phone");
    var digits = input.value.replace(/\D/g, "").substring(0, 10);
    input.value = formatDashedNumber(digits, [3, 3, 4]);
    if (digits.length !== 10) { return setError("phone", "Phone must be 10 digits."); }
    return setError("phone", "");
}

function validateAddr1() {
    var v = trimVal("addr1");
    if (!v) { return setError("addr1", "Address line 1 is required."); }
    if (v.length < 2 || v.length > 30) { return setError("addr1", "Address line 1 must be 2 to 30 characters."); }
    return setError("addr1", "");
}

function validateAddr2() {
    var v = trimVal("addr2");
    if (!v) { return setError("addr2", ""); }
    if (v.length < 2 || v.length > 30) { return setError("addr2", "Address line 2 must be 2 to 30 characters if entered."); }
    return setError("addr2", "");
}

function validateCity() {
    var v = trimVal("city");
    if (!v) { return setError("city", "City is required."); }
    if (v.length < 2 || v.length > 30) { return setError("city", "City must be 2 to 30 characters."); }
    if (!/^[A-Za-z .'\-]+$/.test(v)) { return setError("city", "City contains invalid characters."); }
    return setError("city", "");
}

function validateState() {
    if (!el("state").value) { return setError("state", "Please select a state."); }
    return setError("state", "");
}

function validateZip() {
    var input = el("zip");
    input.value = input.value.replace(/\D/g, "").substring(0, 5);
    if (!/^\d{5}$/.test(input.value)) { return setError("zip", "Zip must be exactly 5 digits."); }
    return setError("zip", "");
}

function validateSymptoms() {
    var v = trimVal("symptoms");
    if (!v) { return setError("symptoms", ""); }
    if (v.length < 2) { return setError("symptoms", "If entered, symptoms should be at least 2 characters."); }
    return setError("symptoms", "");
}

function validateRadio(name, errId, label) {
    var selected = document.querySelector("input[name='" + name + "']:checked");
    if (!selected) { return setError(errId, "Please select " + label + "."); }
    return setError(errId, "");
}

function validateUserId() {
    var input = el("userid");
    input.value = input.value.toLowerCase().trim();
    var v = input.value;
    if (!v) { return setError("userid", "User ID is required."); }
    if (v.length < 5 || v.length > 20) { return setError("userid", "User ID must be 5 to 20 characters."); }
    if (/^[0-9]/.test(v)) { return setError("userid", "User ID cannot start with a number."); }
    if (!/^[a-z0-9_-]+$/.test(v)) { return setError("userid", "User ID can use letters, numbers, dash, and underscore only."); }
    return setError("userid", "");
}

function validatePassword() {
    var pw = el("pw").value;
    var uid = el("userid").value.toLowerCase();
    if (!pw) { return setError("pw", "Password is required."); }
    if (pw.length < 8) { return setError("pw", "Password must be at least 8 characters."); }
    if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) { return setError("pw", "Password needs uppercase, lowercase, and a number."); }
    if (pw.toLowerCase() === uid) { return setError("pw", "Password cannot equal your User ID."); }
    return setError("pw", "");
}

function validatePasswordMatch() {
    var pw = el("pw").value;
    var pw2 = el("pw2").value;
    if (!pw2) { return setError("pw2", "Please re-enter your password."); }
    if (pw !== pw2) { return setError("pw2", "Passwords do not match."); }
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


/* ============================================================
   VALIDATE STATUS DISPLAY (same as homework3)
   ============================================================ */

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


/* ============================================================
   REVIEW PANEL (same as homework3)
   ============================================================ */

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


/* ============================================================
   CLEAR FORM UI (same as homework3)
   ============================================================ */

function clearFormUi() {
    var errors = document.querySelectorAll(".err");
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = "";
    }
    el("submitBtn").style.display = "none";
    el("review-panel").style.display = "none";
    updatePainLabel(1);
}


/* ============================================================
   LIVE VALIDATION BINDING (same as homework3)
   ============================================================ */

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


/* ============================================================
   EXTRA CREDIT: AI CHAT BUBBLE
   Sends user message to Claude AI API and shows the response.
   The AI is given a system prompt so it stays focused on
   helping users fill out this medical registration form.
   ============================================================ */

function toggleChat() {
    var box = el("chat-box");
    if (box.style.display === "none") {
        box.style.display = "block";
        // Show a greeting when first opened if no messages yet
        if (el("chat-messages").children.length === 0) {
            addChatMessage("bot", "Hello! I am the Chin Medical Center assistant. I can help you fill out this registration form. What do you need help with?");
        }
        el("chat-input").focus();
    } else {
        box.style.display = "none";
    }
}

function addChatMessage(type, text) {
    var div = document.createElement("div");
    div.className = "chat-msg " + type;
    div.textContent = text;
    el("chat-messages").appendChild(div);
    // Scroll to the bottom so newest message is visible
    el("chat-messages").scrollTop = el("chat-messages").scrollHeight;
    return div;
}

function sendChat() {
    var input = el("chat-input");
    var userText = input.value.trim();
    if (!userText) { return; }

    // Show the user's message
    addChatMessage("user", userText);
    input.value = "";

    // Show a "thinking" placeholder while waiting for AI response
    var thinkingDiv = addChatMessage("thinking", "Thinking...");

    // Call the Anthropic AI API
    fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: "You are a helpful assistant for Chin Medical Center. Your job is to help patients fill out their online registration form. The form collects: first name, middle initial, last name, date of birth, social security number, email, phone number, address, city, state, zip code, current symptoms, medical history (chicken pox, measles, covid-19, smallpox, tetanus), gender, vaccination status, insurance status, pain level (1-10), desired user ID, and password. Only answer questions related to filling out this form or general medical registration questions. Keep your answers short and friendly. Do not give medical advice.",
            messages: [
                { role: "user", content: userText }
            ]
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Remove the thinking placeholder
        thinkingDiv.remove();

        // Get the AI text response
        var reply = "";
        if (data.content && data.content[0] && data.content[0].text) {
            reply = data.content[0].text;
        } else {
            reply = "Sorry, I could not get a response. Please try again.";
        }
        addChatMessage("bot", reply);
    })
    .catch(function(error) {
        thinkingDiv.remove();
        addChatMessage("bot", "Sorry, there was a connection error. Please try again.");
        console.log("Chat error: " + error);
    });
}


/* ============================================================
   WINDOW ON LOAD
   Runs everything when the page first loads.
   ============================================================ */

window.onload = function() {

    // Load states from states.txt using Fetch API
    loadStates();

    // Set up date display and DOB field limits
    setupDateAndHeader();

    // Check cookie to see if user has been here before
    checkCookieOnLoad();

    // Set up the "not me" checkbox behavior
    setupNotMeCheckbox();

    // Bind local storage saves when user leaves each field
    bindLocalStorageSaves();

    // Bind live validation
    bindLiveValidation();


    // VALIDATE button
    el("validateBtn").addEventListener("click", function() {
        showValidateState(validateAll());
    });

    // REVIEW button
    el("reviewBtn").addEventListener("click", showReview);

    // CLEAR/RESET button - also clears errors and review panel
    el("resetBtn").addEventListener("click", function() {
        setTimeout(clearFormUi, 0);
    });

    // SUBMIT button - validate, handle remember me, then redirect
    el("regForm").addEventListener("submit", function(e) {
        e.preventDefault();
        var good = validateAll();
        showValidateState(good);
        if (good) {
            // Handle remember me cookie and local storage
            handleRememberMe(trimVal("fname"));
            window.location.href = "homework4-thankyou.html";
        }
    });

    // CHAT: allow pressing Enter key in chat input to send
    el("chat-input").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            sendChat();
        }
    });

};
