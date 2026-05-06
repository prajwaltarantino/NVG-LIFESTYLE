document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Scroll animations
  const elements = document.querySelectorAll(
    ".luxury-reveal, .luxury-left, .luxury-right, .luxury-zoom"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
});
// GOOGLE SHEETS FORM SUBMIT
const form = document.getElementById("leadForm");

if (form) {

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    showLoadingPopup();

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      intent: formData.get("intent")
    };

    fetch("https://script.google.com/macros/s/AKfycbxrsdLV7WBo6wVx0rUT-LyIM8duhkUOQ6EF-7D_vuumDZFvTLFeT5k58--jKSyPnkmCSg/exec", {
      method: "POST",
      body: JSON.stringify(data)
    })

    .then(response => response.json())

    .then(() => {

      hideLoadingPopup();

      showSuccessPopup();

      form.reset();

      setTimeout(() => {

        window.location.href =
          "https://wa.me/917996363133?text=Hi%2C%20I%20submitted%20the%20NVG%20Lifestyle%20form.%20Please%20share%20project%20details.";

      }, 2500);

    })

    .catch(error => {

      hideLoadingPopup();

      console.error("Error!", error);

      alert("Something went wrong.");

    });

  });

}


// LOADING POPUP
function showLoadingPopup() {

  const popup = document.createElement("div");

  popup.id = "loadingPopup";

  popup.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(8px);
    ">

      <div style="
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        backdrop-filter: blur(20px);
        padding: 40px 30px;
        border-radius: 24px;
        text-align: center;
        width: 320px;
        color: white;
        font-family: Manrope, sans-serif;
      ">

        <div style="
          width: 54px;
          height: 54px;
          border: 4px solid rgba(255,255,255,0.2);
          border-top: 4px solid #C5A059;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        "></div>

        <h3 style="
          font-size: 22px;
          margin-bottom: 10px;
          font-family: 'Noto Serif', serif;
        ">
          Submitting...
        </h3>

        <p style="
          font-size: 14px;
          opacity: 0.8;
          line-height: 1.6;
        ">
          Please wait while we connect you with our experts.
        </p>

      </div>

    </div>

    <style>
      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  `;

  document.body.appendChild(popup);

}


// HIDE LOADING
function hideLoadingPopup() {

  const popup = document.getElementById("loadingPopup");

  if (popup) {
    popup.remove();
  }

}


// SUCCESS POPUP
function showSuccessPopup() {

  const popup = document.createElement("div");

  popup.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(10px);
    ">

      <div style="
        background: white;
        max-width: 420px;
        width: 100%;
        padding: 36px 28px;
        border-radius: 22px;
        text-align: center;
        font-family: Manrope, sans-serif;
      ">

        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #C5A059;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          font-size: 30px;
        ">
          ✓
        </div>

        <h3 style="
          font-size: 24px;
          color: #1c1917;
          margin-bottom: 12px;
          font-family: 'Noto Serif', serif;
        ">
          Thank You!
        </h3>

        <p style="
          color: #57534e;
          line-height: 1.6;
          font-size: 14px;
        ">
          Your details were submitted successfully.
          Redirecting you to WhatsApp...
        </p>

      </div>

    </div>
  `;

  document.body.appendChild(popup);

}