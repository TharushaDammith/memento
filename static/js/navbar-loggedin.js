var menu_data = document.querySelector('.menu-data');

window.onclick = elem => {
    item = elem.target.className
    out_click = ( (item.includes('menu-data')) ||
                  (item.includes('menu-item')) ||
                  (item.includes('menu-link')) ||
                  (item.includes('menu-hr'))
                )
    if (!out_click) {
        if (item == 'user-menu') {
            menu_data.classList.toggle('menu-data-on');
        }
        else {
            menu_data.classList.remove('menu-data-on');
        }
    }
}

var light_mode =  document.querySelector('.light');
var dark_mode = document.querySelector('.dark');

dark_mode.addEventListener('click', () => {
    dark_mode.style.display = 'none';
    light_mode.style.display = 'block';
})

light_mode.addEventListener('click', () => {
    light_mode.style.display = 'none';
    dark_mode.style.display = "block";
})



// Redirect

function RedirectTo(page) {
    window.location.replace(page);
}