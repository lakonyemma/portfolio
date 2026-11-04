const links = document.querySelectorAll('nav a');
const pages = document.querySelectorAll('.page');

function showPage() {
  let pageName = window.location.hash.substring(1) || 'home';
  let pageExists = document.getElementById(pageName);

  if (!pageExists || !pageExists.classList.contains('page')) {
    pageName = 'home';
  }

  pages.forEach(function(page) {
    page.classList.toggle('active', page.id === pageName);
  });

  links.forEach(function(link) {
    link.classList.toggle('active', link.getAttribute('href') === '#' + pageName);
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
window.addEventListener('load', showPage);
document.getElementById('year').textContent = new Date().getFullYear();