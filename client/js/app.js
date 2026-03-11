/* ============================================================
   KOMAL KISHORE — RESUME WEBSITE
   Subtle animations & interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSmoothScroll();
  initResumeDownload();
});


/* ---- Scroll Reveal Animations ---- */

function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.sidebar-section, .main-section, .project-card, .hero-content'
  );

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


/* ---- Resume PDF Download ---- */

function initResumeDownload() {
  const btn = document.getElementById('download-resume');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Generating...';

    // Clone the page content for PDF
    const clone = document.createElement('div');

    // Build a clean resume layout for the PDF
    const sidebar = document.querySelector('.resume-sidebar');
    const main = document.querySelector('.resume-main');
    const hero = document.querySelector('.hero-content');

    if (!sidebar || !main || !hero) return;

    // Clone hero (name + title + tagline only)
    const heroClone = hero.cloneNode(true);
    const heroActions = heroClone.querySelector('.hero-actions');
    if (heroActions) heroActions.remove();
    const heroName = heroClone.querySelector('.hero-name');
    if (heroName) { heroName.style.fontSize = '1.75rem'; heroName.style.marginBottom = '4px'; }
    const heroTitle = heroClone.querySelector('.hero-title');
    if (heroTitle) { heroTitle.style.fontSize = '0.9rem'; heroTitle.style.marginBottom = '6px'; }
    const heroTagline = heroClone.querySelector('.hero-tagline');
    if (heroTagline) { heroTagline.style.fontSize = '0.8rem'; heroTagline.style.marginBottom = '0'; }

    // Clone sidebar
    const sidebarClone = sidebar.cloneNode(true);

    // Clone main but remove the Featured Projects section
    const mainClone = main.cloneNode(true);
    const projectsSection = mainClone.querySelector('.main-section:nth-child(2)');
    if (projectsSection) {
      const heading = projectsSection.querySelector('.section-heading');
      if (heading && heading.textContent.trim() === 'Featured Projects') {
        projectsSection.remove();
      }
    }

    // Remove fade-in classes so content is visible
    [heroClone, sidebarClone, mainClone].forEach(el => {
      el.querySelectorAll('.fade-in').forEach(f => {
        f.classList.remove('fade-in');
        f.classList.add('visible');
      });
      el.classList.remove('fade-in');
    });

    // Compact skill pills and section spacing for single-page PDF
    sidebarClone.querySelectorAll('.skill-pill').forEach(pill => {
      pill.style.padding = '2px 8px';
      pill.style.fontSize = '0.625rem';
      pill.style.margin = '0';
    });
    sidebarClone.querySelectorAll('.skills-list').forEach(list => {
      list.style.gap = '4px';
    });
    sidebarClone.querySelectorAll('.sidebar-section').forEach(sec => {
      sec.style.marginBottom = '16px';
      sec.style.paddingBottom = '16px';
    });
    sidebarClone.querySelectorAll('.sidebar-heading').forEach(h => {
      h.style.marginBottom = '8px';
      h.style.fontSize = '0.6rem';
    });
    sidebarClone.querySelectorAll('.education-list').forEach(list => {
      list.style.gap = '12px';
    });
    sidebarClone.querySelectorAll('.contact-list').forEach(list => {
      list.style.gap = '6px';
    });
    sidebarClone.querySelectorAll('.contact-item').forEach(item => {
      item.style.fontSize = '0.75rem';
    });

    // Compact main content
    mainClone.querySelectorAll('.main-section').forEach(sec => {
      sec.style.marginBottom = '20px';
      sec.style.paddingBottom = '20px';
    });
    mainClone.querySelectorAll('.section-heading').forEach(h => {
      h.style.marginBottom = '10px';
      h.style.fontSize = '0.6rem';
    });
    mainClone.querySelectorAll('.summary-text').forEach(p => {
      p.style.fontSize = '0.8125rem';
      p.style.lineHeight = '1.6';
    });
    mainClone.querySelectorAll('.experience-list li').forEach(li => {
      li.style.fontSize = '0.75rem';
      li.style.lineHeight = '1.5';
    });

    // Build the PDF container
    clone.innerHTML = `
      <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1a1a1a; padding: 24px 32px; max-width: 800px; margin: 0 auto;">
        <div id="pdf-hero" style="margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #e8e8e8;"></div>
        <div style="display: flex; gap: 32px;">
          <div id="pdf-sidebar" style="width: 210px; flex-shrink: 0;"></div>
          <div id="pdf-main" style="flex: 1;"></div>
        </div>
      </div>
    `;

    clone.querySelector('#pdf-hero').appendChild(heroClone);
    clone.querySelector('#pdf-sidebar').appendChild(sidebarClone);
    clone.querySelector('#pdf-main').appendChild(mainClone);

    const opt = {
      margin: [6, 6, 6, 6],
      filename: 'Komal_Kishore_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download Resume
      `;
    });
  });
}


/* ---- Smooth Anchor Scrolling ---- */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
