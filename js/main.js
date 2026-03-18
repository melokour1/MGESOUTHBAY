/* ============================================
   AutoWorks - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 500);
  });
  // Fallback: hide preloader after 3s
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ---------- Header Scroll Effect ----------
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header background
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ---------- Back to Top ----------
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Mobile Navigation ----------
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---------- Active Navigation Link ----------
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ---------- Gallery Filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---------- Testimonial Slider ----------
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimonialDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
    });

    // Auto-play
    let autoPlay = setInterval(() => {
      goToSlide(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
    }, 5000);

    // Pause auto-play on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        goToSlide(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
      }, 5000);
    });
  }

  // ---------- Scroll Animations ----------
  const animateElements = document.querySelectorAll(
    '.service-card, .about-feature, .pricing-card, .blog-card, .contact-info-card, .cta-feature, .gallery-item'
  );

  animateElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // ---------- Counter Animation ----------
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    let current = 0;
    const increment = Math.ceil(target / 60);
    const duration = 2000;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, stepTime);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  // ---------- Appointment Form ----------
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple form validation visual feedback
      const btn = appointmentForm.querySelector('.btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Appointment Submitted!';
      btn.style.background = '#28a745';
      btn.style.borderColor = '#28a745';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        appointmentForm.reset();
      }, 3000);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

// CSS animation keyframe for gallery filter
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
