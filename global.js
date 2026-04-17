console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/portfolio/"        // Local server
    : "/portfolio/";       // GitHub Pages repo name


// nav menu setup
let pages = [
    { url: 'index.html',  title: 'Home' },
    { url: 'resume.html', title: 'Resume' },
    { url: 'projects/',   title: 'Projects' },
    { url: 'contact/',    title: 'Contact' },
    { url: 'https://github.com/jyim1203', title: 'Github' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (p.url.startsWith('http')) a.target = '_blank';
    a.classList.toggle(
        'current', 
        a.host === location.host && a.pathname === location.pathname
    );
    nav.append(a);
}

// color scheme selector
document.body.insertAdjacentHTML('afterbegin', `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`);

// color scheme selector
let select = document.querySelector('.color-scheme select');

select.addEventListener('input', function (event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

// contact form
let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(form);
    let url = form.action + '?';
    let first = true;
    for (let [name, value] of data) {
        console.log(name, value);
        if (!first) url += '&';
        url += name + '=' + encodeURIComponent(value);
        first = false;
    }
    location.href = url;
});
