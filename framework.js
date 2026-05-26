function toggleSoftphone() {
  const widget = document.getElementById("softphoneWidget");

  if (widget.style.display === "flex") {
    widget.style.display = "none";
  } else {
    widget.style.display = "flex";
  }
}
``
