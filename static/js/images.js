// DARK MODE

dark = document.querySelector('.dark');
light = document.querySelector('.light');

dark.addEventListener('click', () => {
    bg = document.querySelector('section');
    box = document.querySelectorAll('.box');
    txt = document.querySelectorAll('.txt');

    bg.classList.add('dark-bg');

    box.forEach((item) => {
        item.classList.add('dark-box');
    });

    txt.forEach((item) => {
        item.classList.add('color-white');
    });
});

light.addEventListener('click', () => {
    bg = document.querySelector('section');
    box = document.querySelectorAll('.box');
    txt = document.querySelectorAll('.txt');

    bg.classList.remove('dark-bg');

    box.forEach((item) => {
        item.classList.remove('dark-box');
    });

    txt.forEach((item) => {
        item.classList.remove('color-white');
    });
});

function OpenMenu(elem) {
    menu_all = document.querySelectorAll('.note-menu');
    list_all = document.querySelectorAll('.note-list');

    for (i=0; i<menu_all.length; i++) {
        if (elem == menu_all[i]) {
            list_all[i].classList.toggle("note-list-on");
        }
    }
}

// Link search boxes

search_box = document.querySelector('.search');
image_link = document.querySelector('#Load-More');
search_box.addEventListener('input', () => {
    image_link.value = search_box.value;
});

// Load more

function LoadMore() {
    query = document.querySelector('.search');
    btn = document.querySelector('#LoadBtn');
    item_limit = document.querySelector('#Item-Limit');

    if (query.value == "") {
        window.scroll(0, 0);
        search_box.classList.add('invalid-search');
    }
    else {
        all_images = document.querySelectorAll('.img');
        limit = all_images.length + 5;
        item_limit.value = limit;
        btn.click();
    }
}

// Lazy load images

document.addEventListener("DOMContentLoaded", function() {
    var lazyBackgrounds = [].slice.call(document.querySelectorAll(".img"));

    if ("IntersectionObserver" in window) {
        let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  entry.target.classList.add("visible");
                  lazyBackgroundObserver.unobserve(entry.target);
                }
            });
        });

        lazyBackgrounds.forEach(function(lazyBackground) {
            lazyBackgroundObserver.observe(lazyBackground);
        });
    }
});

// Stop input error

function NoBorder(elem) {
    elem.classList.remove('invalid-search');
}

// Set Image as

function SetImageAs(link) {
    img_link = document.querySelector("#Link");
    form3 = document.querySelector('#SetImageBtn');

    img_link.value = link;
    form3.click();
}


// Change Mode per settings

settings_mode = document.querySelector("#Mode");
if (settings_mode.value == "Dark") {
    dark_mode.click();
    dark_mode.style.display = "none";
    light_mode.style.display = "block";
}
