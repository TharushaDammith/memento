// HOME

function ReadMore() {
    window.scroll(0, 716);
}


// NOTES

function MarkAsChecked(checkmark) {
    if (checkmark.src.includes("correct.png")) {
            checkmark.src = "/static/icons/correct-clicked.png";
        }
    else {
        checkmark.src = "/static/icons/correct.png";
    }
}

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
        PickColor(display_div);
    }

    date_input.addEventListener('input', () => {
        display_div.innerHTML = date_input.value;
        PickColor(display_div);
    });
}

// InitDate in all existing notes
date_input = document.querySelectorAll('.date');
display_div = document.querySelectorAll('.date-clone');

d_ = now.getDate();
d_3 = d_ + 4;
d_7 = d_ + 7;
if (d_7 < 10) {
    d_7 = `0${d_7}`;
}
if (d_3 < 10) {
    d_3 = `0${d_3}`;
}
m_ = now.getMonth() + 1;
if (m_ < 10) {
    m_ = `0${m_}`;
}

display_div[0].innerHTML = `${now.getFullYear()}-${m_}-${d_3}`;
display_div[0].style.backgroundColor = yellow;

display_div[1].innerHTML = `${now.getFullYear()}-${m_}-${d_7}`;
display_div[1].style.backgroundColor = green;

for (i=0; i<date_input.length; i++) {
    InitDate(date_input[i], display_div[i], true);
}

function PickColor(elem) {
    limits = [3, 7];

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


// CALENDER

var all_dates = document.querySelectorAll('.date-sqr');
for (i=0; i<all_dates.length; i++) {
    all_dates[i].innerHTML = i + 1;
}

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
                week_box.insertAdjacentHTML('beforeend', `<div class="date-sqr">${29+i}</div>`);
            }
            else {
                week_box.insertAdjacentHTML('beforeend',
                `<div style="opacity: 0; cursor: pointer" class="date-sqr">${29+i}</div>`);
            }
        }
    }
}


// Date functionality

const month_list = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var month_elem = document.querySelector('.month');
var current_pos = 0;

month_elem.innerHTML = month_list[now.getMonth()];

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
    month_to = (now.getMonth() + current_pos) % 12;
    month_elem.innerHTML = month_list[month_to];

    FillMonth(month_to + 1, now.getFullYear());
    SetTaskToDate();
}



// Set tasks to date

function SetTaskToDate() {
    tasks = [3, 14, 24, 20];
    color = ['red', 'yellow', 'green'];
    date_list = document.querySelectorAll('.date-sqr');

    tasks.forEach((i) => {
        date_list[i-1].classList.add(color[Math.floor(Math.random() * 3)]);
    });
}


SetTaskToDate();
FillMonth(now.getMonth() + 1, now.getFullYear());
