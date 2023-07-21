var menu = document.querySelector('.menu');
var nav_list = document.querySelector('.nav-list');

menu.addEventListener('click', () => {
    nav_list.style.transition = "height 1s";
    nav_list.classList.toggle('open-nav-list');
});

function RedirectTo(to_page) {
    current_page = window.location.href.split('/').at(-1);
    if (current_page) {
        open(window.location.href.replace(current_page, to_page));
    }
    else {
        open(`${window.location.href}${to_page}`);
    }
}