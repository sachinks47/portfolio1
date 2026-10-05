// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Smooth Scrolling & Active Link State (Scrollspy)
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id], main[id]');
  const nav = document.querySelector('.nav');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Close mobile menu if open
          document.querySelector('.mobile-menu').classList.remove('open');
          const toggleIcon = document.querySelector('.menu-toggle i');
          toggleIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();

          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    // Navbar styling on scroll
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scrollspy
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 2. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  const revealItems = document.querySelectorAll('.reveal-item');
  const timelineContainer = document.querySelector('.timeline-container');
  
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
    revealItems.forEach(el => revealObserver.observe(el));
    if (timelineContainer) revealObserver.observe(timelineContainer);
  } else {
    // If reduced motion is preferred, reveal everything immediately
    revealElements.forEach(el => el.classList.add('active'));
    revealItems.forEach(el => el.classList.add('active'));
    if (timelineContainer) timelineContainer.classList.add('active');
  }

  // 3. Desktop Parallax & Cursor Spotlight
  const cursorSpotlight = document.querySelector('.cursor-spotlight');
  const heroCard = document.getElementById('heroCard');
  let isDesktop = window.innerWidth > 768;

  window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 768;
    if (!isDesktop && heroCard) {
      heroCard.style.transform = 'none';
    }
  });

  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      if (!isDesktop) return;

      // Spotlight
      if (cursorSpotlight) {
        cursorSpotlight.style.opacity = '1';
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
          cursorSpotlight.style.left = `${e.clientX}px`;
          cursorSpotlight.style.top = `${e.clientY}px`;
        });
      }

      // Hero Card Parallax
      if (heroCard) {
        const x = (window.innerWidth / 2 - e.clientX) / 40;
        const y = (window.innerHeight / 2 - e.clientY) / 40;
        requestAnimationFrame(() => {
          heroCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });
      }
    });

    // Reset styles when mouse leaves window
    document.addEventListener('mouseleave', () => {
      if (cursorSpotlight) cursorSpotlight.style.opacity = '0';
      if (heroCard) heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 4. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', !isOpen);
      
      const icon = isOpen ? 'menu' : 'x';
      menuToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
      lucide.createIcons();
    });
  }
});
