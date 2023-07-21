var eye = document.querySelector('.bi-eye-fill');
var eye_slash = document.querySelector('.bi-eye-slash-fill');
var password = document.querySelector('.password');

eye.addEventListener('click', () => {
    eye_slash.style.display = "block";
    eye.style.display = "none";
    password.type = "password";
});

eye_slash.addEventListener('click', () => {
    eye_slash.style.display = "none";
    eye.style.display = "block";
    password.type = "text";
});