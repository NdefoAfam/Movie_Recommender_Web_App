document.addEventListener("DOMContentLoaded", function () {
  // Select elements once the DOM is fully loaded
  const body = document.querySelector("body");
  const nav = document.querySelector("nav");
  const modeToggle = document.querySelector(".dark-light");
  const searchToggle = document.querySelector(".searchToggle");
  const sidebarOpen = document.querySelector(".sidebarOpen");

  // Check and apply the user's preferred mode (dark/light) from local storage
  const getMode = localStorage.getItem("mode");
  if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
    modeToggle.classList.add("active");
  }

  // Event listener for toggling dark/light mode
  modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    modeToggle.classList.toggle("active");

    // Store the user's selected mode in local storage
    const currentMode = body.classList.contains("dark") ? "dark-mode" : "light-mode";
    localStorage.setItem("mode", currentMode);
  });

  // Event listener for toggling the search box (you can add your logic here)
  searchToggle.addEventListener("click", () => {
    // Add your code to show/hide the search box here
  });

  // Event listener for opening the sidebar menu
  sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
  });

  // Event listener to close the sidebar when clicking outside of it
  document.addEventListener("click", (e) => {
    const clickedElm = e.target;
    if (!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")) {
      nav.classList.remove("active");
    }
  });
});
