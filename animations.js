document.addEventListener("DOMContentLoaded", function () {
  // MOBILE MENU
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // PREMIUM SCROLL ANIMATIONS
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

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxrsdLV7WBo6wVx0rUT-LyIM8duhkUOQ6EF-7D_vuumDZFvTLFeT5k58--jKSyPnkmCSg/exec";

const WHATSAPP_URL =
  "https://wa.me/917996363133?text=Hi%2C%20I%20submitted%20the%20NVG%20Lifestyle%20form.%20Please%20share%20project%20details.";

const form = document.getElementById("leadForm");
const popupForm = document.getElementById("popupLeadForm");
const leadPopup = document.getElementById("leadPopup");
const closePopup = document.getElementById("closePopup");
const openLeadButtons = document.querySelectorAll(".openLeadPopup");

function openLeadPopup() {
  if (leadPopup) {
    leadPopup.classList.remove("hidden");
    leadPopup.classList.add("flex");
  }
}

function closeLeadPopup() {
  if (leadPopup) {
    leadPopup.classList.add("hidden");
    leadPopup.classList.remove("flex");
  }
}

openLeadButtons.forEach((btn) => {
  btn.addEventListener("click", openLeadPopup);
});

if (closePopup) {
  closePopup.addEventListener("click", closeLeadPopup);
}

if (leadPopup) {
  leadPopup.addEventListener("click", function (e) {
    if (e.target === leadPopup) {
      closeLeadPopup();
    }
  });
}

// POPUP AFTER PAGE OPENS
setTimeout(() => {
  if (leadPopup && leadPopup.classList.contains("hidden")) {
    openLeadPopup();
  }
}, 2000);

// DESKTOP EXIT INTENT
document.addEventListener("mouseleave", function (e) {
  if (
    e.clientY <= 0 &&
    leadPopup &&
    leadPopup.classList.contains("hidden")
  ) {
    openLeadPopup();
  }
});

// EXTRA DESKTOP EXIT SUPPORT
document.addEventListener("mouseout", function (e) {
  if (
    !e.relatedTarget &&
    e.clientY <= 10 &&
    leadPopup &&
    leadPopup.classList.contains("hidden")
  ) {
    openLeadPopup();
  }
});

// MOBILE POPUP AFTER 40% SCROLL
let mobilePopupShown = false;

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollPosition / pageHeight) * 100;

    if (
      scrollPercent > 40 &&
      !mobilePopupShown &&
      leadPopup &&
      leadPopup.classList.contains("hidden")
    ) {
      openLeadPopup();
      mobilePopupShown = true;
    }
  }
});

async function submitLead(formEl, intentValue) {
  showLoadingPopup();

  const formData = new FormData(formEl);
  const intent = formData.get("intent") || intentValue;
  const configuration = formData.get("configuration") || "Not Selected";

  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    intent: `${intent} | ${configuration}`
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    hideLoadingPopup();
    showSuccessPopup();

    if (typeof fbq === "function") {
      fbq("track", "Lead");
    }

    unlockLocationFlow();

    formEl.reset();
    closeLeadPopup();

    setTimeout(() => {
      window.location.href = WHATSAPP_URL;
    }, 2200);
  } catch (error) {
    hideLoadingPopup();
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitLead(form, "Main Form Lead");
  });
}

if (popupForm) {
  popupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitLead(popupForm, "Popup Lead");
  });
}

function showLoadingPopup() {
  const oldPopup = document.getElementById("loadingPopup");
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement("div");
  popup.id = "loadingPopup";

  popup.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    ">
      <div style="
        width: 320px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        backdrop-filter: blur(24px);
        border-radius: 28px;
        padding: 40px 30px;
        text-align: center;
        color: white;
        font-family: Manrope, sans-serif;
      ">
        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 4px solid rgba(255,255,255,0.15);
          border-top: 4px solid #C5A059;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        "></div>

        <h3 style="
          font-size: 24px;
          margin-bottom: 10px;
          font-family: 'Noto Serif', serif;
        ">
          Submitting...
        </h3>

        <p style="
          opacity: 0.75;
          font-size: 14px;
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

function hideLoadingPopup() {
  const popup = document.getElementById("loadingPopup");

  if (popup) {
    popup.remove();
  }
}

function showSuccessPopup() {
  const oldSuccess = document.getElementById("successSubmitPopup");
  if (oldSuccess) oldSuccess.remove();

  const popup = document.createElement("div");
  popup.id = "successSubmitPopup";

  popup.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 20px;
    ">
      <div style="
        max-width: 420px;
        width: 100%;
        background: white;
        border-radius: 28px;
        padding: 40px 30px;
        text-align: center;
        font-family: Manrope, sans-serif;
      ">
        <div style="
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #C5A059;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
        ">
          ✓
        </div>

        <h3 style="
          font-size: 28px;
          color: #1c1917;
          margin-bottom: 12px;
          font-family: 'Noto Serif', serif;
        ">
          Thank You!
        </h3>

        <p style="
          color: #57534e;
          line-height: 1.7;
          font-size: 14px;
          margin-bottom: 22px;
        ">
          Your details were submitted successfully.
          Redirecting you to WhatsApp...
        </p>

        <a href="${WHATSAPP_URL}" style="
          display: inline-block;
          background: #C5A059;
          color: white;
          padding: 14px 26px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        ">
          Continue to WhatsApp
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
}


// PAGE LOADER
window.addEventListener("load", function () {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 900);
  }
});

// SCROLL PROGRESS BAR
window.addEventListener("scroll", function () {
  const scrollProgress = document.getElementById("scrollProgress");
  if (scrollProgress) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + "%";
  }
});

// GSAP PARALLAX + PREMIUM ENTRANCE
window.addEventListener("load", function () {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".parallax-image").forEach((img) => {
      gsap.to(img, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      });
    });
  }
});

// FAQ ACCORDION
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    item.classList.toggle("active");
    answer.classList.toggle("hidden");
  });
});

// UNLOCK LOCATION AFTER LEAD
function unlockLocationFlow() {
  const overlay = document.getElementById("mapOverlay");
  const map = document.getElementById("projectMap");
  if (overlay) overlay.style.display = "none";
  if (map) {
    map.classList.remove("pointer-events-none");
    map.style.opacity = "1";
  }
}


// FORCE HERO CONTENT VISIBLE
document.addEventListener("DOMContentLoaded", function () {
  const heroContent = document.getElementById("heroContent");
  if (heroContent) {
    heroContent.classList.add("show");
    heroContent.style.opacity = "1";
    heroContent.style.transform = "none";
    heroContent.style.filter = "none";
  }
});
