const pages = document.querySelectorAll('main section');
const links = document.querySelectorAll('nav a');

function showPage() {
  const name = location.hash.slice(1) || 'home';
  const current = document.getElementById(name);
  const page = current && current.tagName === 'SECTION' ? name : 'home';

  pages.forEach(section => section.classList.toggle('active', section.id === page));
  links.forEach(link => link.classList.toggle('active', link.hash === '#' + page));
}

window.addEventListener('hashchange', showPage);
showPage();