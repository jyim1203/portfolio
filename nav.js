// makes nav relative to this file, not page loading it
// path works from any subdirectory
const navUrl = new URL('nav.html', document.currentScript.src);

fetch(navUrl)
    .then(res => res.text())
    .then(data => {
        const placeholder = document.getElementById('nav-placeholder');
        placeholder.innerHTML = data;

        // makes all relative hrefs absolute (anchored to nav.html's location)
        placeholder.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href.startsWith('http')) {
                link.href = new URL(href, navUrl).href;
            }
        });

        // mark the link that matches the current page
        placeholder.querySelectorAll('a').forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('current');
            }
        });
    });
