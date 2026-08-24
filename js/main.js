document.addEventListener('DOMContentLoaded', () => {
  /* 1. Page Transition (Fade-In on Load) */
  document.body.classList.add('fade-transition');
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);

  /* --- Premium Preloader Intro --- */
  const preloader = document.getElementById('intro-preloader');
  const introLogo = document.querySelector('.intro-logo');
  const navLogo = document.querySelector('.navbar .logo');
  
  if (preloader && introLogo && navLogo) {
    document.body.classList.add('no-scroll');
    
    // After typing animation completes (approx 2.2s)
    setTimeout(() => {
      // Remove caret border so it matches navLogo perfectly
      introLogo.style.borderRight = 'none';
      
      // Remove no-scroll to show scrollbar and prevent layout shifts during coordinate calculation
      document.body.classList.remove('no-scroll');
      
      // Get positions for FLIP animation
      const introRect = introLogo.getBoundingClientRect();
      const navRect = navLogo.getBoundingClientRect();
      
      const deltaX = navRect.left - introRect.left;
      const deltaY = navRect.top - introRect.top;
      const scaleX = navRect.width / introRect.width;
      const scaleY = navRect.height / introRect.height;
      
      // Step 1: Translate to the corner at full size
      introLogo.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      introLogo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      introLogo.style.transformOrigin = 'top left';
      
      // Start fading the background to reveal the homepage smoothly
      preloader.style.transition = 'background-color 1.3s ease';
      preloader.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Fade to transparent white
      
      // Step 2: After reaching corner, scale down
      setTimeout(() => {
        introLogo.style.transition = 'transform 0.5s ease-in-out'; // No opacity transition!
        introLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
        
        setTimeout(() => {
          // Crossfade smoothly at rest to hide any subpixel font rendering differences
          introLogo.style.transition = 'opacity 0.4s ease';
          introLogo.style.opacity = '0';
          navLogo.style.transition = 'opacity 0.4s ease';
          navLogo.style.opacity = '1';
          
          preloader.style.pointerEvents = 'none';
          
          setTimeout(() => {
            preloader.classList.add('hidden');
          }, 400); // Wait for crossfade to finish
        }, 500); // Wait for scale transition to finish
      }, 850);
    }, 2400);
  }

  /* --- Top Creative Inspired Interactions --- */
  
  /* A. Glassmorphism Sticky Header Scroll */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* B. Overlay Menu */
  const hamburger = document.getElementById('hamburger-menu');
  const overlay = document.getElementById('menu-overlay');


  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      overlay.classList.toggle('open');
      navbar.classList.toggle('menu-open');
    });
  }

  /* C. Hero Image Parallax & Cycling */
  const heroImages = document.querySelectorAll('.hero-image');
  if (heroImages.length > 0) {
    let currentImg = 0;
    // Cycle every 4 seconds
    setInterval(() => {
      heroImages[currentImg].classList.remove('active');
      currentImg = (currentImg + 1) % heroImages.length;
      heroImages[currentImg].classList.add('active');
    }, 4000);
    
    // Slight parallax on the image wrapper
    const imageWrapper = document.querySelector('.hero-image-wrapper');
    window.addEventListener('mousemove', (e) => {
      if (!imageWrapper) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px offset
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      imageWrapper.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
  
  /* ------------------------------------------ */

  /* Page Transition (Fade-Out on Link Click) */
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only intercept internal links that are not hash links or target="_blank"
      const target = link.getAttribute('target');
      const href = link.getAttribute('href');
      if (
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        target !== '_blank'
      ) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 400); // Matches the CSS transition duration roughly
      }
    });
  });

  /* 2. Scroll Animations (Intersection Observer) */
  const fadeElements = document.querySelectorAll('.fade-in-section');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  /* 3. FAQ Accordion Logic */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });

  /* 4. URL Parsing for Booking Form */
  const bookingForm = document.getElementById('reservation-form');
  if (bookingForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property');
    const propertySelect = document.getElementById('property-select');
    
    if (propertyId && propertySelect) {
      const optionExists = Array.from(propertySelect.options).some(opt => opt.value === propertyId);
      if (optionExists) {
        propertySelect.value = propertyId;
      }
    }

    /* 5. Real-Time Form Validation */
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const email = document.getElementById('email');

    const validateDates = () => {
      if (checkin.value && checkout.value) {
        const ciDate = new Date(checkin.value);
        const coDate = new Date(checkout.value);
        if (coDate <= ciDate) {
          checkout.classList.add('is-invalid');
          checkout.classList.remove('is-valid');
        } else {
          checkout.classList.remove('is-invalid');
          checkout.classList.add('is-valid');
        }
      }
    };

    const validateEmail = () => {
      if (email.value) {
        // Basic email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.value)) {
          email.classList.add('is-invalid');
          email.classList.remove('is-valid');
        } else {
          email.classList.remove('is-invalid');
          email.classList.add('is-valid');
        }
      }
    };

    if (checkin && checkout) {
      checkin.addEventListener('change', validateDates);
      checkout.addEventListener('change', validateDates);
    }

    if (email) {
      email.addEventListener('blur', validateEmail);
      email.addEventListener('input', () => {
        if(email.classList.contains('is-invalid')) validateEmail();
      });
    }

    bookingForm.addEventListener('submit', (e) => {
      validateDates();
      validateEmail();
      if (checkout.classList.contains('is-invalid') || email.classList.contains('is-invalid')) {
        e.preventDefault();
        alert('Please correct the highlighted errors before submitting.');
      }
    });
  }

  /* 6. Custom JS Lightbox */
  const lightboxTriggers = document.querySelectorAll('.gallery-lightbox-trigger');
  if (lightboxTriggers.length > 0) {
    // Inject HTML
    const lightboxHTML = `
      <div class="mc-lightbox" id="mc-lightbox">
        <span class="mc-lightbox-close material-symbols-outlined">close</span>
        <span class="mc-lightbox-prev material-symbols-outlined">chevron_left</span>
        <img src="" class="mc-lightbox-content" id="mc-lightbox-img">
        <span class="mc-lightbox-next material-symbols-outlined">chevron_right</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('mc-lightbox');
    const lightboxImg = document.getElementById('mc-lightbox-img');
    const closeBtn = document.querySelector('.mc-lightbox-close');
    const prevBtn = document.querySelector('.mc-lightbox-prev');
    const nextBtn = document.querySelector('.mc-lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(lightboxTriggers).map(t => t.getAttribute('data-img') || t.getAttribute('src') || t.querySelector('img').getAttribute('src'));

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const nextImg = () => {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    };

    const prevImg = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    };

    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImg);
    prevBtn.addEventListener('click', prevImg);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
    });
  }

});
