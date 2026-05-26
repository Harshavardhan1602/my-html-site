function toggleSoftphone() {
  const widget = document.getElementById("softphoneWidget");

  widget.style.display =
    widget.style.display === "flex" ? "none" : "flex";
}
