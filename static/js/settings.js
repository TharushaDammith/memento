var light_mode = document.querySelector('.light');
var dark_mode = document.querySelector('.dark');
var settings = document.querySelector('#Settings');
var border = document.querySelectorAll('.border');

dark_mode.addEventListener('click', () => {
    settings.classList.add('dark-mode');
    border.forEach((item) => {
        item.classList.add('border-white');
    })
})

light_mode.addEventListener('click', () => {
    settings.classList.remove('dark-mode');
     border.forEach((item) => {
        item.classList.remove('border-white');
    })
})

var eye = document.querySelector('.eye-pass');
var eye_slash = document.querySelector('.eye-slash-pass');
var password = document.querySelector('.password');

eye_slash.addEventListener('click', () => {
    eye_slash.style.display = "none";
    eye.style.display = "block";
    password.type = "text";
})

eye.addEventListener('click', () => {
    eye_slash.style.display = "block";
    eye.style.display = "none";
    password.type = "password";
})

var eye_confirm = document.querySelector('.eye-confirm');
var eye_slash_confirm = document.querySelector('.eye-slash-confirm');
var confirm_password = document.querySelector('.confirm-password');

eye_slash_confirm.addEventListener('click', () => {
    eye_slash_confirm.style.display = "none";
    eye_confirm.style.display = "block";
    confirm_password.type = "text";
})

eye_confirm.addEventListener('click', () => {
    eye_slash_confirm.style.display = "block";
    eye_confirm.style.display = "none";
    confirm_password.type = "password";
})


var light_theme = document.querySelector('.light-theme');
var dark_theme = document.querySelector('.dark-theme');
var theme_input = document.querySelector('#Theme');

light_theme.addEventListener('click', () => {
    alert("Save changes to see the difference.");
    light_theme.style.display = "none";
    dark_theme.style.display = "flex";
    theme_input.value = "Dark";
})

dark_theme.addEventListener('click', () => {
    alert("Save changes to see the difference.");
    light_theme.style.display = "flex";
    dark_theme.style.display = "none";
    theme_input.value = "Light";
})


// Status limits

min_lim = document.querySelector('.min-lim');
mid_lim = document.querySelector('.mid-lim');
max_lim = document.querySelector('.max-lim');

lim = [min_lim, mid_lim, max_lim];
task_error = document.querySelector('#TaskError');

mid_lim.addEventListener('input', () => {
    max_lim.value = `${mid_lim.value}+`;

    min_ = Number(min_lim.value);
    mid_ = Number(mid_lim.value);

    if (min_ >= mid_) {
        task_error.innerHTML = "*Number too small";
        mid_lim.classList.add('input-error');
    }
    if ((min_ < mid_) && (task_error.innerHTML == "*Number too small")) {
        task_error.innerHTML = "";
        mid_lim.classList.remove('input-error');
    }
});


// Check for errors

function CheckErrors() {
    if (task_error.innerHTML != "") {
        event.preventDefault();
    }
    if ((password.value != "") && (confirm_password.value == "")) {
        password_error = document.querySelector('#PasswordError');
        password_error.innerHTML = "*Enter new password";
        confirm_password.classList.add('input-error');
        event.preventDefault();
    }
}

confirm_password.addEventListener('input', () => {
    password_error = document.querySelector('#PasswordError');
    if ((confirm_password.value != "") && (password_error.innerHTML != "")) {
        password_error = document.querySelector('#PasswordError');
        password_error.innerHTML = "";
        confirm_password.classList.remove('input-error');
    }
});

password.addEventListener('input', () => {
    password_error = document.querySelector('#OldPasswordError');
    if (password_error) {
        password_error.innerHTML = "";
        password.classList.remove('input-error');
    }
});

// Delete account

email = document.querySelector('#Email').value;
function Delete() {
    delete_account = prompt(`All data related to this account will be permanently deleted. Type ${email} if you want to continue.`)
    if (delete_account != email) {
        event.preventDefault();
    }
}


// Change Mode per settings

settings_mode = document.querySelector("#Mode");
if (settings_mode.value == "Dark") {
    dark_mode.click();
    dark_mode.style.display = "none";
    light_mode.style.display = "block";
}
