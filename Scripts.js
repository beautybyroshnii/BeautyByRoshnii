document.addEventListener("DOMContentLoaded", function () {
  const imageCount = 8;
  const imagePaths = Array.from({ length: imageCount }, (_, i) => `Images/Hero/${i + 1}.jpeg`);

  const heroElement = document.querySelector('.hero');
  const preloadedImages = [];
  let currentIndex = 0;

  let allImagesLoaded = 1;

  // Preload images
  imagePaths.forEach((path, i) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      preloadedImages[i] = img;
      allImagesLoaded++;
      if (allImagesLoaded === imagePaths.length) {
        startBackgroundRotation();
      }
    };
  });

  function startBackgroundRotation() {
    updateBackground(); // Show first image immediately
    setInterval(updateBackground, 5000); // Change every 5 seconds
  }

  function updateBackground() {
    if (!heroElement) return;

    // Choose a random image (avoid repeating the same one)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * imagePaths.length);
    } while (newIndex === currentIndex);
    currentIndex = newIndex;

    // Start fade-out
    heroElement.classList.remove('loaded');

    // Wait for fade-out before changing image
    setTimeout(() => {
      heroElement.style.backgroundImage = `url("${imagePaths[currentIndex]}")`;

      // Fade-in after short delay
      requestAnimationFrame(() => {
        heroElement.classList.add('loaded');
      });
    }, 300);
  }

  const form = document.getElementById("bookingForm");
  const confirmationMessage = document.getElementById("confirmationMessage");

  // Disable past dates
  const dateInput = document.getElementById("appointmentDate");
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const service = document.getElementById("serviceSelect").value;

    // Phone validation
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(contactNumber)) {
      alert("Please enter a valid 10-digit Indian phone number starting with 6-9.");
      return;
    }

    if (new Date(appointmentDate) < new Date(today)) {
      alert("Appointment date cannot be in the past.");
      return;
    }

    const apiUrl = "https://script.google.com/macros/s/AKfycbwxKLozwJdHcmiHO2qDynyt-FveNpyL39D8teqeMnll8KP-NzgPt9F7f3V8h9JRx-M2/exec";

    const formData = {
      fullName,
      contactNumber,
      appointmentDate,
      service,
    };

    fetch(apiUrl, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to send booking.");
        }
        return response.text(); // Changed from .json()
      })
      .then(data => {
        confirmationMessage.style.display = "block";
        form.reset();
      })
      .catch(error => {
        alert("There was an error submitting the form. Please try again later.");
        console.error("Submission error:", error);
      });
  });

  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    navbar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle.classList.add("hide"); // Hide ☰
  }

  function closeMenu() {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.classList.remove("hide"); // Show ☰ again
  }

  menuToggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

});