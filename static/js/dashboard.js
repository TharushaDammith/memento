// Change Image

note_id = Number(document.querySelector('#NoteId').value);
img_link = document.querySelector('#ImgLink').value;
if (note_id) {
    note_img = document.querySelectorAll('.note-img');
    note_img[note_id-1].style.backgroundImage = `url('${img_link}')`;
}

// CREATE NOTE

function createElement() {
    var dark_mode = dark_mode = document.querySelector('#Dashboard').className.includes('dark-bg');

var note_boiler_light = `<div class="note">
    <div class="note-img">
        <div class="note-menu" onclick="OpenMenu(this)">            <div class="dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-row middle-dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div></div>
    </div>
        <ul class="note-list">
            <li class="note-item note-link box" onclick="RedirectToImages()">
                <p class="item-text txt">New image</p>
            </li>
            <li class="note-item note-delete box" onclick="DeleteMenu(this)">
                <p class="item-text txt">Delete</p>
            </li>
        </ul>
    <div class="note-content box">
        <textarea class="note-text txt">Write here...</textarea>
        <div class="note-options">
            <div class="date-box">
                <div class="date-clone"></div>
                <input class="date" type="date">
            </div>
            <img class="checkmark" src="static/icons/correct.png" onclick="MarkAsChecked(this)">
            <input class="checkmark-input" name="checkmark">
        </div>
    </div>
</div>`

var note_boiler_dark = `<div class="note">
    <div class="note-img">
        <div class="note-menu" onclick="OpenMenu(this)">            <div class="dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-row middle-dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="dot-row">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div></div>
    </div>
        <ul class="note-list">
            <li class="note-item note-link box dark-box" onclick="RedirectToImages()">
                <p class="item-text txt color-white">New image</p>
            </li>
            <li class="note-item note-delete box dark-box" onclick="DeleteMenu(this)">
                <p class="item-text txt color-white">Delete</p>
            </li>
        </ul>
    <div class="note-content box dark-box">
        <textarea class="note-text txt color-white">Write here...</textarea>
        <div class="note-options">
            <div class="date-box">
                <div class="date-clone"></div>
                <input class="date" type="date">
            </div>
            <img class="checkmark" src="static/icons/correct.png" onclick="MarkAsChecked(this)">
            <input class="checkmark-input" name="checkmark">
        </div>
    </div>
</div>`


    dashboard = document.querySelector('#Dashboard');
    if (dark_mode) {
        dashboard.insertAdjacentHTML('beforeend', note_boiler_dark);
    }
    else {
        dashboard.insertAdjacentHTML('beforeend', note_boiler_light);
    }

    FixHeight();

    last_input = Array.from(document.querySelectorAll('.date')).at(-1);
    last_div = Array.from(document.querySelectorAll('.date-clone')).at(-1);

    InitDate(last_input, last_div);
}

var create_btn = document.querySelectorAll('.create');
create_btn.forEach((item) => {
    item.addEventListener('click', createElement)
})


// OPEN MENU

function OpenMenu(elem) {
    menu_all = document.querySelectorAll('.note-menu');
    list_all = document.querySelectorAll('.note-list');

    for (i=0; i<menu_all.length; i++) {
        if (elem == menu_all[i]) {
            list_all[i].classList.toggle("note-list-on");
        }
    }
}

// DELETE MENU

function DeleteMenu(elem) {
    delete_all = document.querySelectorAll('.note-delete');
    note_all = document.querySelectorAll('.note');

    for (i=0; i<delete_all.length; i++) {
        if (elem == delete_all[i]) {
            note_all[i].remove();
        }
    }

    FixHeight();
}


// CHECKMARK

function MarkAsChecked(elem) {
    all_checkmarks = Array.from(document.querySelectorAll('.checkmark'));
    index = all_checkmarks.indexOf(elem)
    check_input = document.querySelectorAll('.checkmark-input')[index];

    if (elem.src.split('/').at(-1) == 'correct.png') {
        elem.src = "static/icons/correct-clicked.png";
        check_input.value = "True";
    }
    else {
        elem.src = 'static/icons/correct.png';
        check_input.value = "False";
    }
}


// DASHBOARD HEIGHT
function FixHeight() {
    note_num = document.querySelectorAll('.note').length;
    dashboard = document.querySelector('#Dashboard').style;
    note_length = document.querySelectorAll('.note').length;

    if (note_num > 3) {
        dashboard.height = 'initial';
    }

    if (window.innerWidth > 850) {
        if (note_length >= 4) {
            dashboard.height = 'initial';
        }
        else {
            dashboard.height = 'calc(100vh - 91px - 6rem)';
        }
    }
    else if (window.innerWidth < 600) {
        if (note_length >= 2) {
            dashboard.height = "initial";
        }
        else {
            dashboard.height = 'calc(100vh - 91px - 6rem)';
        }
    }
    else {
        if (note_length >= 3) {
            dashboard.height = "initial";
        }
        else {
            dashboard.height = 'calc(100vh - 91px - 6rem)';
        }
    }
}
FixHeight()

// OPEN/CLOSE SIDEBAR

function Sidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('sidebar-on');
}


// CACHE BOX SHOW/HIDE

function ShowCacheBox() {
    cache_box = document.querySelector('.cache-box');
    cache_box.classList.toggle('cache-box-on');
}

function HideCacheBox() {
    cache_box = document.querySelector('.cache-box');
    cache_box.classList.remove('cache-box-on');
}



// DARK MODE & LIGHT MODE

var light = document.querySelector('.light');
var dark = document.querySelector('.dark');

try {
    dark.addEventListener('click', () => {
        DarkMode();
    });

    light.addEventListener('click', () => {
        LightMode();
    });
}
catch {
    //pass
}



function DarkMode() {
    var bg = document.querySelectorAll('.bg');
    var hr = document.querySelectorAll('hr');
    var sidebar = document.querySelector('.sidebar');
    var txt = document.querySelectorAll('.txt');
    var box = document.querySelectorAll('.box');

    bg.forEach((item) => {
        item.classList.add('dark-bg');
    });

    sidebar.classList.add('dark-sidebar');

    hr.forEach((item) => {
        item.classList.add('border-white');
    });

    txt.forEach((item) => {
        item.classList.add('color-white');
    });

    box.forEach((item) => {
        item.classList.add('dark-box');
    });
}

function LightMode() {
    var bg = document.querySelectorAll('.bg');
    var hr = document.querySelectorAll('hr');
    var sidebar = document.querySelector('.sidebar');
    var txt = document.querySelectorAll('.txt');
    var box = document.querySelectorAll('.box');

    bg.forEach((item) => {
        item.classList.remove('dark-bg');
    });

    sidebar.classList.remove('dark-sidebar');

    hr.forEach((item) => {
        item.classList.remove('border-white');
    });

    txt.forEach((item) => {
        item.classList.remove('color-white');
    });

    box.forEach((item) => {
        item.classList.remove('dark-box');
    });
}



// Redirect Url

function RedirectToImages(elem) {
    link_list = Array.from(document.querySelectorAll('.note-link'));
    item_num = link_list.indexOf(elem) + 1;

    goto_url = `${window.location.href.split('/')[0]}select-image?note_id=${item_num}`;
    window.location.replace(goto_url);
}


// Date Selector

var now = new Date();
var dd = String(now.getDate()).padStart(2, '0');
var mm = String(now.getMonth() + 1).padStart(2, '0');
var yyyy = now.getFullYear();
var today = `${yyyy}-${mm}-${dd}`;
const red = "rgb(238, 87, 87)";
const yellow = "rgb(238, 223, 87)";
const green = "rgb(113, 191, 135)";

try {
    date_clone = document.querySelectorAll('.date-label');
    date = document.querySelectorAll('.date');
    for (i=0; i<date.length; i++) {
        InitDate(date[i], date_clone[i]);
    }
}
catch {
    //pass
}

function InitDate(date_input, display_div, init_load=false) {
    if (!init_load) {
        display_div.innerHTML = today;
    }

    date_input.addEventListener('input', () => {
        display_div.innerHTML = date_input.value;
        PickColor(display_div);
    });
}

// InitDate in all existing notes
date_input = document.querySelectorAll('.date');
display_div = document.querySelectorAll('.date-clone');
for (i=0; i<date_input.length; i++) {
    InitDate(date_input[i], display_div[i], true);
}

function PickColor(elem) {
    limits = document.querySelector('#Limits').textContent.split(';').map(Number);

    current_date = Number(today.split('-').join(''));
    exp_date = Number(elem.textContent.split('-').join(''));
    diff = exp_date - current_date;

    if (diff <= limits[0]) {
        elem.style.backgroundColor = red;
    }
    else if (diff < limits[1]) {
        elem.style.backgroundColor = yellow;
    }
    else {
        elem.style.backgroundColor = green;
    }
}

all_dates = document.querySelectorAll('.date-clone');
all_dates.forEach((item) => {
    PickColor(item)
});

// Save Data

function Save() {
    txt_list = [];
    img_links = [];
    chk_list = [];
    date_list = [];

    document.querySelectorAll('.note-text').forEach((item) => {
        txt_list.push(item.value);
    });

    document.querySelectorAll('.note-img').forEach((item) => {
        img = item.currentStyle || window.getComputedStyle(item, false),
        img_links.push(img.backgroundImage.split('"').at(1));
    });

    document.querySelectorAll('.checkmark').forEach((item) => {
        chk_list.push(item.src);
    });

    document.querySelectorAll('.date-clone').forEach((item) => {
        date_list.push(item.textContent);
    });

    document.querySelector('#Data').value = `${txt_list.join('~')}]${img_links.join('~')}]${chk_list.join('~')}]${date_list.join('~')}]`;
    document.querySelector('#RealBtn').click();
}


// Page unload alert

window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
});


// Change Mode per settings

settings_mode = document.querySelector("#Mode");
if (settings_mode.value == "Dark") {
    DarkMode();
    document.querySelector('.dark').style.display = "none";
    document.querySelector('.light').style.display = "block";
}
