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

    // Helper: build a LaTeX-style section heading with rule
    const sectionHead = (title) =>
      `<div style="margin-bottom:6px;">
        <div style="font-size:11pt; font-weight:700; color:#000; text-transform:uppercase; letter-spacing:0.05em; padding-bottom:3px; border-bottom:1.5px solid #000;">${title}</div>
      </div>`;

    // Extract data from the page
    const cards = document.querySelectorAll('.project-card');
    const eduItems = document.querySelectorAll('.education-item');
    const skills = Array.from(document.querySelectorAll('.sidebar-section')).find(s => s.querySelector('.sidebar-heading')?.textContent.trim() === 'Technical Skills');
    const tools = Array.from(document.querySelectorAll('.sidebar-section')).find(s => s.querySelector('.sidebar-heading')?.textContent.trim() === 'Tools');
    const expItems = document.querySelectorAll('.experience-item');

    const skillsList = skills ? Array.from(skills.querySelectorAll('.skill-pill')).map(p => p.textContent) : [];
    const toolsList = tools ? Array.from(tools.querySelectorAll('.skill-pill')).map(p => p.textContent) : [];
    const summary = document.querySelector('.summary-text')?.textContent?.trim() || '';

    // Build Overleaf-style PDF
    const clone = document.createElement('div');
    clone.innerHTML = `
      <div style="font-family: 'Times New Roman', Georgia, 'DejaVu Serif', serif; color:#000; padding:28px 36px; max-width:800px; margin:0 auto; line-height:1.4;">

        <!-- Header -->
        <div style="text-align:center; margin-bottom:12px;">
          <div style="font-size:22pt; font-weight:700; letter-spacing:0.02em;">Komal Kishore</div>
          <div style="font-size:10pt; color:#333; margin-top:4px;">
            Chennai, Tamil Nadu &nbsp;|&nbsp; kk2141998@gmail.com &nbsp;|&nbsp; github.com/komalkishore13
          </div>
        </div>

        <!-- Summary -->
        ${sectionHead('Summary')}
        <div style="font-size:9.5pt; color:#222; margin-bottom:14px; line-height:1.5;">${summary}</div>

        <!-- Education -->
        ${sectionHead('Education')}
        <div style="margin-bottom:14px;">
          ${Array.from(eduItems).map(item => {
            const degree = item.querySelector('.education-degree')?.textContent || '';
            const school = item.querySelector('.education-school')?.textContent || '';
            const year = item.querySelector('.education-year')?.textContent || '';
            return `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <div><span style="font-size:10pt; font-weight:700;">${degree}</span> — <span style="font-size:9.5pt; color:#444;">${school}</span></div>
              <div style="font-size:9pt; color:#666; flex-shrink:0;">${year}</div>
            </div>`;
          }).join('')}
        </div>

        <!-- Technical Skills -->
        ${sectionHead('Technical Skills')}
        <div style="font-size:9.5pt; margin-bottom:14px; line-height:1.6;">
          <div><span style="font-weight:700;">Languages & Frameworks:</span> ${skillsList.join(', ')}</div>
          <div><span style="font-weight:700;">Tools:</span> ${toolsList.join(', ')}</div>
        </div>

        <!-- Projects -->
        ${sectionHead('Projects')}
        <div style="margin-bottom:14px;">
          ${Array.from(cards).map(card => {
            const title = card.querySelector('.project-title')?.textContent || '';
            const desc = card.querySelector('.project-description')?.textContent?.trim() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
            return `<div style="margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between;">
                <span style="font-size:10pt; font-weight:700;">${title}</span>
                <span style="font-size:8.5pt; color:#666; font-style:italic;">${tags.join(', ')}</span>
              </div>
              <div style="font-size:9pt; color:#333; line-height:1.5; margin-top:2px;">${desc}</div>
            </div>`;
          }).join('')}
        </div>

        <!-- Experience -->
        ${sectionHead('Experience')}
        <div>
          ${Array.from(expItems).map(item => {
            const role = item.querySelector('.experience-role')?.textContent || '';
            const company = item.querySelector('.experience-company')?.textContent || '';
            const date = item.querySelector('.experience-date')?.textContent || '';
            const bullets = Array.from(item.querySelectorAll('.experience-list li')).map(li => li.textContent);
            return `<div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between;">
                <span style="font-size:10pt; font-weight:700;">${role}</span>
                <span style="font-size:9pt; color:#666;">${date}</span>
              </div>
              <div style="font-size:9pt; color:#555; font-style:italic; margin-bottom:3px;">${company}</div>
              <ul style="margin:0; padding-left:16px; font-size:9pt; color:#222; line-height:1.5;">
                ${bullets.map(b => `<li style="margin-bottom:2px;">${b}</li>`).join('')}
              </ul>
            </div>`;
          }).join('')}
        </div>

      </div>
    `;

    const opt = {
      margin: [8, 10, 8, 10],
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
