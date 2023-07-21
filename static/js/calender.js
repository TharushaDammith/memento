function OpenSchedule(elem) {
    var dark_mode = document.querySelector('#Calender').className.includes('dark-bg');
    var link_list = elem.getAttribute('data-value').split(';');
    var event_list = document.querySelector('.event-list');
    var event_item_light =

    document.querySelectorAll('.event-item').forEach((item) => {
        item.remove();
    })

    link_list.forEach((item) => {
        if (item == "No tasks on this day.") {
            if (dark_mode) {
                event_list.insertAdjacentHTML('beforeend', `<li class="event-item"><a class="event-link color-white">${item}</a></li>`);
            }
            else {
                event_list.insertAdjacentHTML('beforeend', `<li class="event-item"><a class="event-link">${item}</a></li>`);
            }
        }
        else {
            if (dark_mode) {
                event_list.insertAdjacentHTML('beforeend', `<li class="event-item"><a class="event-link event-border color-white" href="${window.location.href.replace('calender', 'dashboard')}">${item}</a></li>`);
            }
            else {
                event_list.insertAdjacentHTML('beforeend', `<li class="event-item"><a class="event-link event-border" href="${window.location.href.replace('calender', 'dashboard')}">${item}</a></li>`);
            }
        }
    });

    var overlay = document.querySelector('.overlay');
    overlay.classList.add('show-overlay');

    var event_box = document.querySelector('.event-box');
    event_box.classList.add('open-event-box');
}

function CloseSchedule(overlay) {
    overlay.classList.remove('show-overlay');

    var event_box = document.querySelector('.event-box');
    event_box.classList.remove('open-event-box');
}


// DARK/LIGHT MODE

var light = document.querySelector('.light');
var dark = document.querySelector('.dark');

dark.addEventListener('click', () => {
    var calender = document.querySelector('#Calender');
    var all_boxes = document.querySelectorAll('.box');
    var all_links = document.querySelectorAll('.event-link');

    calender.classList.add('dark-bg');

    all_boxes.forEach((item) => {
        item.classList.add('dark-box');
    });

    all_links.forEach((item) => {
        item.classList.add('color-white');
    });
})

light.addEventListener('click', () => {
    var calender = document.querySelector('#Calender');
    var all_boxes = document.querySelectorAll('.box');
    var all_links = document.querySelectorAll('.event-link');

    calender.classList.remove('dark-bg');

    all_boxes.forEach((item) => {
        item.classList.remove('dark-box');
    });

    all_links.forEach((item) => {
        item.classList.remove('color-white');
    });
})


// Change Mode per settings

now = new Date();
FillMonth(now.getMonth() + 1, now.getFullYear());

var all_dates = document.querySelectorAll('.date');
for (i=0; i<all_dates.length; i++) {
    all_dates[i].innerHTML = i + 1;
    if (i + 1 == now.getDate()) {
        all_dates[i].classList.add('blue');
    }
}

// Date functionality

const today = new Date();
const month_list = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var month_elem = document.querySelector('.month');
var current_pos = 0;

month_elem.innerHTML = month_list[today.getMonth()];

function NextMonth() {
    current_pos += 1;
    ChangeMonth();
}

function PreviousMonth() {
    if (current_pos == -1) {
        current_pos = 11;
    }
    current_pos -= 1;
    ChangeMonth();
}

function ChangeMonth() {
    now = new Date();

    month_to = (today.getMonth() + current_pos) % 12;
    month_elem.innerHTML = month_list[month_to];

    date_list = document.querySelectorAll('.date');
    if (month_elem.innerHTML == month_list[now.getMonth()]) {
        date_list[now.getDate() - 1].classList.add('blue');
    }
    else {
        date_list[now.getDate() - 1].classList.remove('blue');
    }

    FillMonth(month_to + 1, now.getFullYear());
    SetTaskToDate();
}


// Fill remaining days of the month

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function FillMonth(month, year) {
    try {
        document.querySelectorAll('.week-box')[4].remove();
    }
    catch {
        //pass
    }

    rem_days = daysInMonth(month, year) - 28;
    month_box = document.querySelector('.month-box');

    week_template = `<div class="week-box"></div>`

    if (rem_days > 0) {
        month_box.insertAdjacentHTML('beforeend', week_template);
        week_box = Array.from(document.querySelectorAll('.week-box')).at(-1);

        for (i=0; i<7; i++) {
            if (i < rem_days) {
                week_box.insertAdjacentHTML('beforeend',
                `<div class="date box" onclick="OpenSchedule(this)" data-value="No tasks on this day.">${29+i}</div>`);
            }
            else {
                week_box.insertAdjacentHTML('beforeend',
                `<div style="opacity: 0; cursor: default;" class="date box" onclick="OpenSchedule(this)" data-value="No tasks on this day.">${29+i}</div>`);
            }
        }
    }

    settings_mode = document.querySelector("#Mode");
    if (settings_mode.value == "Dark") {
        dark.click();
        dark.style.display = "none";
        light.style.display = "block";
    }
}

// Post data

tasks = document.querySelector('#Tasks');
tasks_json = JSON.parse(tasks.value.replace(/'/g, "\""));

function SetTaskToDate() {
    now = new Date();
    month = now.getMonth();
    day = now.getDate();

    if (month < 10) {
        month = `0${month+1}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }

    current_date = Number(`${now.getFullYear()}${month}${day}`);

    date_list = document.querySelectorAll('.date');
    date_list.forEach((item) => {
        item.classList.remove('red');
        item.classList.remove('green');
        item.classList.remove('yellow');
    });

    limit = document.querySelector('#Limits').value.split(';');

    for (let date in tasks_json) {
        y_ = Number(date.split('-')[0]);
        m_ = Number(date.split('-')[1]);
        d_ = Number(date.split('-')[2]);

        expiry_date = Number(date.split('-').join(''));
        diff = expiry_date - current_date;

        if (month_list[m_-1] == month_elem.innerHTML) {
            exp_date_elem = date_list[d_ - 1];

            exp_date_elem.dataset.value = "";
            tasks_json[date].forEach((item) => {
                exp_date_elem.dataset.value += `${item};`;
            });

            if (diff <= limit[0]) {
                exp_date_elem.classList.add('red');
            }
            else if (diff > limit[1]) {
                exp_date_elem.classList.add('green');
            }
            else {
                exp_date_elem.classList.add('yellow');
            }
        }
    }
}
SetTaskToDate();
