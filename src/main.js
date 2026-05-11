/* ============================================================
   Hudson Valley Chimney Help — Main JavaScript
   ============================================================ */

/* ── Analytics helper ── */
function track(eventName, params) {
  try {
    if (typeof gtag === 'function') gtag('event', eventName, params || {});
  } catch (e) {}
  try {
    if (typeof clarity === 'function') clarity('event', eventName);
  } catch (e) {}
}

/* ── Mobile nav toggle ── */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

/* ── FAQ accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
        track('faq_interaction', { question: btn.textContent.trim().replace('▼', '').trim() });
      }
    });
  });
}

/* ── Lead form dynamic subject + validation + submission ── */
function initForm() {
  const forms = document.querySelectorAll('.lead-form');
  forms.forEach(form => {
    const serviceField = form.querySelector('[name="service_needed"]');
    const townField = form.querySelector('[name="town_city"]');
    const subjectField = form.querySelector('[name="_subject"]');
    const sourcePageField = form.querySelector('[name="source_page"]');
    const pageUrlField = form.querySelector('[name="page_url"]');

    if (sourcePageField) sourcePageField.value = document.title;
    if (pageUrlField) pageUrlField.value = window.location.href;

    function updateSubject() {
      if (!subjectField) return;
      const svc = serviceField ? serviceField.value.toUpperCase() : 'CHIMNEY SERVICE';
      const town = townField ? (townField.value.trim().toUpperCase() || 'HUDSON VALLEY') : 'HUDSON VALLEY';
      subjectField.value = `NEW CHIMNEY LEAD - ${svc} - ${town}`;
    }

    if (serviceField) serviceField.addEventListener('change', updateSubject);
    if (townField) townField.addEventListener('input', updateSubject);
    updateSubject();

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm(form)) {
        track('form_error', { form_location: window.location.pathname });
        return;
      }

      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting\u2026';

      const data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          track('lead_form_submit', {
            service: serviceField ? serviceField.value : '',
            town: townField ? townField.value.trim() : '',
            page: window.location.pathname
          });
          showSuccess(form);
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Chimney Request';
          track('form_error', { form_location: window.location.pathname, reason: 'server_error' });
          showFormError(form, 'There was a problem submitting your request. Please try again.');
        }
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Chimney Request';
        track('form_error', { form_location: window.location.pathname, reason: 'network_error' });
        showFormError(form, 'There was a problem submitting your request. Please try again.');
      });
    });
  });
}

function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    const fieldEl = field.closest('.field');
    const errMsg = fieldEl ? fieldEl.querySelector('.error-msg') : null;
    if (!field.value.trim()) {
      field.classList.add('error');
      if (errMsg) errMsg.classList.add('show');
      valid = false;
    } else {
      field.classList.remove('error');
      if (errMsg) errMsg.classList.remove('show');
    }
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('error');
        if (errMsg) errMsg.classList.remove('show');
      }
    }, { once: true });
  });

  const serviceField = form.querySelector('[name="service_needed"]');
  const townField = form.querySelector('[name="town_city"]');
  if (serviceField && !serviceField.value) {
    serviceField.classList.add('error');
    valid = false;
  }
  if (townField && !townField.value.trim()) {
    townField.classList.add('error');
    valid = false;
  }

  if (!valid) {
    const firstErr = form.querySelector('.error');
    if (firstErr) firstErr.focus();
  }
  return valid;
}

function showSuccess(form) {
  const success = form.querySelector('.form-success');
  const formBody = form.querySelector('.form-body');
  if (formBody) formBody.style.display = 'none';
  if (success) success.classList.add('show');
}

function showFormError(form, msg) {
  let el = form.querySelector('.form-general-error');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-general-error';
    el.style.cssText = 'color:#D0251A;font-size:0.85rem;margin-top:0.5rem;';
    form.appendChild(el);
  }
  el.textContent = msg;
}

/* ── CTA / card click tracking ── */
function initClickTracking() {
  document.querySelectorAll('[data-main-cta-click]').forEach(el => {
    el.addEventListener('click', () => track('main_cta_click', { page: window.location.pathname }));
  });

  document.querySelectorAll('[data-secondary-cta-click]').forEach(el => {
    el.addEventListener('click', () => track('secondary_cta_click', { page: window.location.pathname }));
  });

  document.querySelectorAll('[data-service-card-click]').forEach(el => {
    el.addEventListener('click', () => {
      const label = el.querySelector('h3') ? el.querySelector('h3').textContent.trim() : '';
      track('service_card_click', { service: label, page: window.location.pathname });
    });
  });

  document.querySelectorAll('[data-county-card-click]').forEach(el => {
    el.addEventListener('click', () => {
      const label = el.querySelector('h3') ? el.querySelector('h3').textContent.trim() : '';
      track('county_card_click', { county: label, page: window.location.pathname });
    });
  });
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFAQ();
  initForm();
  initClickTracking();
  initSmoothScroll();
});
