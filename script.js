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

document.getElementById('explore').addEventListener('click', () => {
  location.hash = 'work';
});

document.querySelectorAll('.project-button').forEach(button => {
  button.addEventListener('click', () => {
    const article = button.closest('article');
    const details = article.querySelector('.details');

    if (details) {
      details.remove();
      button.textContent = 'View project';
    } else {
      const info = document.createElement('p');
      info.className = 'details';
      info.textContent = article.querySelector('p').textContent;
      article.appendChild(info);
      button.textContent = 'Hide details';
    }
  });
});

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const fields = event.currentTarget.elements;
  const name = fields[0].value.trim();
  const email = fields[1].value.trim();
  const message = fields[2].value.trim();
  const subject = encodeURIComponent('Portfolio inquiry from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
  location.href = 'mailto:lakonyemmanuel92@gmail.com?subject=' + subject + '&body=' + body;
});