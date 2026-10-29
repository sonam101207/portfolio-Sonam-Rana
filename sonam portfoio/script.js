/**
 * ============================================================================
 * SCRIPT.JS - Sonam Rana Portfolio
 * Vanilla JavaScript for Interactive UI, Navigation, Modals & Validation
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  initCurrentYear();
  initStickyNavbar();
  initMobileMenu();
  initActiveNavHighlight();
  initScrollReveal();
  initContactForm();
  initCopyEmail();
  initCopyPhone();
  initBackToTop();
  initProjectModals();
});

/**
 * ----------------------------------------------------------------------------
 * 1. Current Year in Footer
 * ----------------------------------------------------------------------------
 */
function initCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. Sticky Navbar with Scroll Styling
 * ----------------------------------------------------------------------------
 */
function initStickyNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load
}

/**
 * ----------------------------------------------------------------------------
 * 3. Mobile Navigation Menu Toggle
 * ----------------------------------------------------------------------------
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileMenu) return;

  let isMenuOpen = false;

  const toggleMenu = (open) => {
    isMenuOpen = typeof open === 'boolean' ? open : !isMenuOpen;
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');

    if (isMenuOpen) {
      mobileMenu.classList.remove('hidden');
      if (menuIcon) menuIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileMenu.classList.add('hidden');
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  };

  mobileMenuBtn.addEventListener('click', () => toggleMenu());

  // Close menu when clicking any nav link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMenu(false);
      mobileMenuBtn.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 4. Active Navigation Highlighting via Intersection Observer
 * ----------------------------------------------------------------------------
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        desktopLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * ----------------------------------------------------------------------------
 * 5. Scroll-Triggered Reveal Animations
 * ----------------------------------------------------------------------------
 */
function initScrollReveal() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Elements to reveal
  const targets = document.querySelectorAll('section > div, .project-card');
  targets.forEach((el) => el.classList.add('reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => revealObserver.observe(el));
}

/**
 * ----------------------------------------------------------------------------
 * 6. Contact Form Validation & Honest Client-Side Mailto Handler
 * ----------------------------------------------------------------------------
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  const successMessage = document.getElementById('formSuccessMessage');
  const errorMessage = document.getElementById('formErrorMessage');
  const errorText = document.getElementById('formErrorText');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, condition, message) => {
    if (!condition) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      input.classList.add('border-rose-400', 'focus:ring-rose-400');
      return false;
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
      input.classList.remove('border-rose-400', 'focus:ring-rose-400');
      return true;
    }
  };

  // Real-time blur validation
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your name (at least 2 characters).');
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
  });

  subjectInput.addEventListener('blur', () => {
    validateField(subjectInput, subjectError, subjectInput.value.trim().length >= 3, 'Please enter a subject (at least 3 characters).');
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Please write a message with at least 10 characters.');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your name (at least 2 characters).');
    const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const isSubjectValid = validateField(subjectInput, subjectError, subjectInput.value.trim().length >= 3, 'Please enter a subject (at least 3 characters).');
    const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10, 'Please write a message with at least 10 characters.');

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      errorMessage.classList.remove('hidden');
      errorText.textContent = 'Please fill out all fields accurately before sending.';
      successMessage.classList.add('hidden');
      return;
    }

    // Hide error
    errorMessage.classList.add('hidden');

    // Format mailto link directly to Sonam Rana
    const recipientEmail = 'sonamrana101207@gmail.com';
    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const mailSubject = `[Portfolio Contact] ${subjectInput.value.trim()} - from ${senderName}`;
    const mailBody = `Hi Sonam,\n\n${messageInput.value.trim()}\n\n---\nSender: ${senderName}\nEmail: ${senderEmail}`;

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // Show on-screen success/instruction toast
    successMessage.classList.remove('hidden');

    // Trigger local email client
    window.location.href = mailtoUrl;

    // Reset form after short delay
    setTimeout(() => {
      form.reset();
    }, 1500);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 7. Copy Email to Clipboard Feature
 * ----------------------------------------------------------------------------
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailDisplay = document.getElementById('emailDisplay');

  if (!copyBtn || !emailDisplay) return;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = emailDisplay.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for older contexts
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const originalText = copyBtnText.textContent;
      copyBtnText.textContent = 'Copied!';
      copyBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');

      setTimeout(() => {
        copyBtnText.textContent = originalText;
        copyBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 8. Copy Phone to Clipboard Feature
 * ----------------------------------------------------------------------------
 */
function initCopyPhone() {
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const copyPhoneBtnText = document.getElementById('copyPhoneBtnText');
  const phoneDisplay = document.getElementById('phoneDisplay');

  if (!copyPhoneBtn || !phoneDisplay) return;

  copyPhoneBtn.addEventListener('click', async () => {
    const phoneToCopy = phoneDisplay.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phoneToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = phoneToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const originalText = copyPhoneBtnText.textContent;
      copyPhoneBtnText.textContent = 'Copied!';
      copyPhoneBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');

      setTimeout(() => {
        copyPhoneBtnText.textContent = originalText;
        copyPhoneBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 8. Back to Top Button
 * ----------------------------------------------------------------------------
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * ----------------------------------------------------------------------------
 * 9. Project Details Modal Logic
 * ----------------------------------------------------------------------------
 */
const PROJECT_DATA = {
  blindStick: {
    title: 'Blind Stick — Arduino-Based Assistive Device',
    category: 'IoT · Arduino · Accessibility Prototype',
    content: `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-slate-900 text-base">Project Overview</h4>
          <p class="text-sm text-slate-600 mt-1 leading-relaxed">
            Blind Stick is an assistive-device prototype designed to help visually impaired individuals detect nearby obstacles. Built using an Arduino board, proximity/distance sensors, a buzzer, and a vibration motor, the device provides dual-sensory alerts (audio and tactile vibration) when an object enters its detection threshold.
          </p>
        </div>

        <div class="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
          <strong class="font-semibold block mb-0.5">Context & Authenticity:</strong>
          This project was developed as a student engineering laboratory prototype. It is not commercially manufactured, certified for medical safety, or deployed in clinical settings. It represents hands-on exploration of sensor integration and physical computing.
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm">Hardware & Technical Architecture</h4>
          <ul class="list-disc pl-5 text-xs text-slate-600 space-y-1.5 mt-2">
            <li><strong>Microcontroller:</strong> Arduino board executing an embedded C/C++ sketch.</li>
            <li><strong>Distance / Obstacle Sensing:</strong> Sensor continuously calculates proximity based on pulse reflection.</li>
            <li><strong>Audio Alert (Buzzer):</strong> Triggers an audible warning sound when obstacles are within immediate walking distance.</li>
            <li><strong>Tactile Alert (Vibration Motor):</strong> Implemented to provide discrete physical vibration feedback through the handle, ensuring usability in noisy outdoor environments.</li>
            <li><strong>Power Management:</strong> Powered via a portable battery cell with power-efficiency considerations.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm">Key Practical Learnings</h4>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">
            Working on this project taught me how to read and interpret hardware sensor thresholds, handle real-world physical noise in sensor data, debug circuit connections on a breadboard, and write deterministic control loops in C.
          </p>
        </div>

        <div class="pt-2">
          <h4 class="font-bold text-slate-900 text-sm mb-2">Technologies Used</h4>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Arduino Uno/Nano</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Embedded C</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Ultrasonic Sensor</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Piezo Buzzer</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">DC Vibration Motor</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Basic IoT</span>
          </div>
        </div>
      </div>
    `
  },
  agriLink: {
    title: 'AgriLink — Farmer-to-Customer Website Concept',
    category: 'Web Development · Hackathon Project',
    content: `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-slate-900 text-base">Project Overview</h4>
          <p class="text-sm text-slate-600 mt-1 leading-relaxed">
            AgriLink is a web application concept conceptualized and developed during a college hackathon. The platform aims to bridge the gap between farmers and consumers by offering a direct digital showcase for farm produce, eliminating unnecessary supply chain intermediaries.
          </p>
        </div>

        <div class="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-900">
          <strong class="font-semibold block mb-0.5">Hackathon Experience:</strong>
          Built collaboratively under strict time constraints, this project focused on rapid UI prototyping, responsive layout structuring, and practical empathy for rural and everyday users.
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm">Core Features & Concept Flow</h4>
          <ul class="list-disc pl-5 text-xs text-slate-600 space-y-1.5 mt-2">
            <li><strong>Produce Catalog:</strong> Organized views of seasonal crops, vegetables, and grains with clear pricing.</li>
            <li><strong>Direct Communication:</strong> Designed to facilitate phone/chat inquiries directly between customer and grower.</li>
            <li><strong>Accessible UI:</strong> Large typography, high-contrast buttons, and uncluttered layout designed for easy viewing on basic mobile devices.</li>
            <li><strong>Responsive Design:</strong> Tested across various device screen sizes to ensure seamless mobile-first access.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm">Key Practical Learnings</h4>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">
            Collaborating with teammates under hackathon deadlines taught me how to communicate effectively, divide frontend tasks, make fast design decisions, and appreciate the value of simple, functional user interfaces over bloated architectures.
          </p>
        </div>

        <div class="pt-2">
          <h4 class="font-bold text-slate-900 text-sm mb-2">Technologies Used</h4>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">HTML5</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">CSS3</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">JavaScript</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Tailwind CSS</span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">Git & GitHub</span>
          </div>
        </div>
      </div>
    `
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-locked');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Expose openProjectModal globally for onclick handlers in index.html
  window.openProjectModal = (projectId) => {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    const modalBadge = document.getElementById('modalBadge');
    const modalBody = document.getElementById('modalBody');

    if (modalBadge) modalBadge.textContent = data.category;
    if (modalBody) modalBody.innerHTML = data.content;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-locked');

    // Re-render any icons inside modal if necessary
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  };
}

