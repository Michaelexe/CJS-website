const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const request = new XMLHttpRequest();
  request.open(
    "post",
    "https://script.google.com/macros/s/AKfycbzKxb9W6yM8fwJ7c1uKEsQkDGtUoVDrwGfgNXd2HT8Ud2rQTDmjv72fqIvZyDUW1m-zeQ/exec"
  );

  request.onload = () => {
    console.log();

    if (JSON.parse(request.response).result === "success") {
      alert("Form sent successfully!");
      form.reset();
    } else {
      alert("Something went wrong. Please try again later");
    }
  };

  request.send(new FormData(form));
});
// action="https://script.google.com/macros/s/AKfycbzKxb9W6yM8fwJ7c1uKEsQkDGtUoVDrwGfgNXd2HT8Ud2rQTDmjv72fqIvZyDUW1m-zeQ/exec"
