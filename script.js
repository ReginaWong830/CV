// Interactive behaviors for the resume page
// - mobile nav toggle
// - smooth scrolling for internal links
// - reveal-on-scroll animations
// - animate skill bars when visible
// - subtle project card mouse parallax
// - simple contact form handling (frontend only)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle') || document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links') || document.querySelector('.nav-menu');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile nav after click
          if (navLinks && navLinks.classList.contains('open')) navLinks.classList.remove('open');
        }
      }
    });
  });

  // Reveal on scroll and animate skill bars
  const revealEls = document.querySelectorAll('.reveal, .fade-in-up, .fade-in-left, .fade-in-right');
  const skillBars = document.querySelectorAll('.bar');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // animate skill bars when parent section appears
        if (entry.target.classList.contains('skills') || entry.target.id === 'skills') {
          animateSkillBars();
        }

        // if individual bar enters
        if (entry.target.classList.contains('bar')) {
          setTimeout(() => setBarWidth(entry.target), 80);
        }

        // unobserve once visible for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
  skillBars.forEach(bar => revealObserver.observe(bar));

  function setBarWidth(barEl) {
    const p = parseInt(barEl.dataset.percent || '0', 10);
    const span = barEl.querySelector('span');
    if (span) {
      span.style.transition = 'width 1000ms cubic-bezier(.2,.9,.3,1)';
      span.style.width = p + '%';
    }
  }

  function animateSkillBars() {
    document.querySelectorAll('.bar').forEach(bar => setBarWidth(bar));
  }

  // Project card subtle parallax
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const media = card.querySelector('.project-media, .project-image');
    if (!media) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tx = x * 10; // translate range
      const ty = y * 10;
      media.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      media.style.transform = '';
    });
    // keyboard focus visual feedback
    card.addEventListener('focus', () => card.classList.add('focus'));
    card.addEventListener('blur', () => card.classList.remove('focus'));
  });

  // Contact form handling (frontend demo)
  const contactForm = document.querySelector('#contactForm') || document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.submit-button');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerText;
        submitBtn.innerText = '发送中...';
        setTimeout(() => {
          submitBtn.innerText = '已发送 ✓';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
          }, 1800);
        }, 900);
      }
    });
  }

  // Accessibility: reduce motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced && prefersReduced.matches) {
    document.documentElement.classList.add('reduce-motion');
  }
});
