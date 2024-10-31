const form = document.querySelector("form");
submitButton = form.querySelector("button");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.innerText = "Sending...";
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
      submitButton.innerText = "Submitted!";
    } else {
      alert("Something went wrong. Please try again later");
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    }
  };

  request.send(new FormData(form));
});
// action="https://script.google.com/macros/s/AKfycbzKxb9W6yM8fwJ7c1uKEsQkDGtUoVDrwGfgNXd2HT8Ud2rQTDmjv72fqIvZyDUW1m-zeQ/exec"
