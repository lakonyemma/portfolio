function showPage(pageName) {
  let pages = document.querySelectorAll("main section");

  for (let page of pages) {
    page.hidden = page.id !== pageName;
  }
}

function sendMessage(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("message").value;

  let subject = encodeURIComponent("Portfolio inquiry from " + name);
  let body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);

  window.location.href = "mailto:lakonyemmanuel92@gmail.com?subject=" + subject + "&body=" + body;
}