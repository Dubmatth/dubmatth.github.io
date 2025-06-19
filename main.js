// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

// Check for saved theme preference or default to 'light'
const currentTheme = "light"; // Note: localStorage not available in this environment
document.documentElement.setAttribute("data-theme", currentTheme);

if (currentTheme === "dark") {
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme");
  const newTheme = theme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  // localStorage.setItem('theme', newTheme); // Not available in this environment

  if (newTheme === "dark") {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Project filter functionality
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// Particles animation
function createParticle() {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // Random position and animation duration
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDuration = Math.random() * 20 + 10 + "s";
  particle.style.animationDelay = Math.random() * 5 + "s";

  document.getElementById("particles").appendChild(particle);

  // Remove particle after animation
  setTimeout(() => {
    particle.remove();
  }, 25000);
}

// Create particles periodically
setInterval(createParticle, 2000);

// EmailJS Configuration
(function() {
    emailjs.init("0r1lCLOY9e_bTPMkX"); // Remplacez par votre clé publique EmailJS
})();

// Contact form submission
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const form = this;

    // Récupération des données du formulaire
    const formData = {
      from_name: form.name.value,
      from_email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
      to_email: "dubois.matthieu@live.be" // Votre adresse email
    };

    // Validation basique
    if (!formData.from_name || !formData.from_email || !formData.subject || !formData.message) {
      showNotification("Veuillez remplir tous les champs", "error");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
      showNotification("Veuillez entrer une adresse email valide", "error");
      return;
    }

    // Interface utilisateur pendant l'envoi
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    // Envoi avec EmailJS
    emailjs.send("service_i2nyuis", "template_a2rmt4j", formData)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
        showNotification("Votre message a été envoyé avec succès!", "success");
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      })
      .catch(function(error) {
        console.log('FAILED...', error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur d\'envoi';
        showNotification("Erreur lors de l'envoi. Veuillez réessayer ou me contacter directement.", "error");
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
  });

// Fonction pour afficher les notifications
function showNotification(message, type = "info") {
  // Supprimer les notifications existantes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());

  // Créer la notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  // Ajouter au DOM
  document.body.appendChild(notification);

  // Animation d'entrée
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Suppression automatique après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize typing animation when page loads
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-content h1");
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ""), 50);
  }
});

// Add hover effect to skill items
document.querySelectorAll(".skill-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05) rotate(5deg)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg)";
  });
});

// Dynamic stats counter
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.innerHTML = value + (element.dataset.suffix || "");
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize counters when about section is visible
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".stat-number");
      counters.forEach((counter) => {
        const endValue = parseInt(counter.textContent);
        counter.dataset.suffix = counter.textContent.replace(/[0-9]/g, "");
        animateCounter(counter, 0, endValue, 2000);
      });
      aboutObserver.unobserve(entry.target);
    }
  });
});

const aboutSection = document.querySelector("#about");
if (aboutSection) {
  aboutObserver.observe(aboutSection);
}
