//القيم الابتدائية للفلاتر
let selectedCategory = 'all';
let selectedStatus = 'all';
let selectedDate = '';
document.addEventListener('DOMContentLoaded', function () {
  // استرجاع القيم المحفوظة
  const savedCategory = localStorage.getItem('eventFilter_category');
  const savedStatus = localStorage.getItem('eventFilter_status');

  // تعيين القيم للمتغيرات
  selectedCategory = savedCategory || 'all';
  selectedStatus = savedStatus || 'all';

  // تحديث واجهة المستخدم للتصنيف
  const categoryBtn = document.querySelector('.filter-category-dropdown button');
  if (selectedCategory !== 'all') {
    const selectedItem = document.querySelector(`.filter-category-dropdown .dropdown-item[data-value="${savedCategory}"]`);
    if(selectedItem){
    categoryBtn.innerHTML = `التصنيف: ${selectedItem.textContent.trim()} <span class="caret"></span>`;
    selectedItem.classList.add('active');
    document.querySelector('.filter-category-dropdown .dropdown-item[data-value="all"]').classList.remove('active');
  }
}

  // تحديث واجهة المستخدم للحالة
  const statusBtn = document.querySelector('.filter-status-dropdown button');
  if (selectedStatus !== 'all') {
    const selectedItem = document.querySelector(`.filter-status-dropdown .dropdown-item[data-value="${savedStatus}"]`);
    if(selectedItem){
    statusBtn.innerHTML = `الحالة: ${selectedItem.textContent.trim()} <span class="caret"></span>`;
    selectedItem.classList.add('active');
    document.querySelector('.filter-status-dropdown .dropdown-item[data-value="all"]').classList.remove('active');
  }
}

  // معالجة اختيار التصنيف
  document.querySelectorAll('.dropdown-menu[data-filter="category"] .dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      this.closest('.dropdown-menu').querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.remove('active');
      });
      this.classList.add('active');

      const button = this.closest('.dropdown').querySelector('button');
      const selectedText = this.textContent.trim();
      button.innerHTML = `التصنيف: ${selectedText} <span class="caret"></span>`;

      selectedCategory = this.getAttribute('data-value');
      localStorage.setItem('eventFilter_category', selectedCategory);
      applyFilters();
    });
  });

  // معالجة اختيار الحالة
  document.querySelectorAll('.dropdown-menu[data-filter="status"] .dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      this.closest('.dropdown-menu').querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.remove('active');
      });
      this.classList.add('active');

      const button = this.closest('.dropdown').querySelector('button');
      const selectedText = this.textContent.trim();
      button.innerHTML = `الحالة: ${selectedText} <span class="caret"></span>`;

      selectedStatus = this.getAttribute('data-value');
      localStorage.setItem('eventFilter_status', selectedStatus);
      applyFilters();
    });
  });

  // تطبيق الفلاتر عند النقر على بحث
  const applyBtn = document.getElementById('applyFiltersBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      selectedDate = document.getElementById('dateInput').value;
      applyFilters();
    });
  }

  // ↑ زر العودة إلى الأعلى
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('d-none');
      } else {
        scrollToTopBtn.classList.add('d-none');
      }
    });
    scrollToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // تطبيق الفلاتر عند التحميل
  applyFilters();
});
//  معالجة نموذج الاتصال
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    if (!name || name.length < 5) {
      showError('الاسم مطلوب ويجب أن لا يقل عن 5 أحرف.');
      return;
    }
    if (email.search(/^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/)<0) {
      showError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    
    if (!message || message.length < 10) {
      showError('الرسالة مطلوبة ويجب أن لا تقل عن 10 أحرف.');
      return;
    }
    
    showSuccess(`تم إرسال رسالتك! سنرد على: <strong>${email}</strong>`);
    this.reset();
  });

  
}
function showError(message) {
  const alertDiv = createAlert('danger', message);
  const alertContainer = document.getElementById('contactAlert');
  if (alertContainer) {
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    alertContainer.classList.remove('d-none');
  }
}
function setupFieldValidation(id) {
  document.getElementById(id).addEventListener('blur', function() {
    if (!this.value.trim()) {
      this.classList.add('is-invalid');
    } else {
      this.classList.remove('is-invalid');
    }
  });
}

function showSuccess(message) {
  const alertDiv = createAlert('success', message);
  const alertContainer = document.getElementById('contactAlert');
  if (alertContainer) {
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    alertContainer.classList.remove('d-none');
  }
}

function createAlert(type, message) {
  const div = document.createElement('div');
  div.className = `alert alert-${type} alert-dismissible fade show`;
  div.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  return div;
}

// دالة تحديث عرض البطاقات
function applyFilters() {
  const cards = document.querySelectorAll('.event-card');
  
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    const statusList = (card.getAttribute('data-status') || '').split(' ');
    const date = card.getAttribute('data-date');

    const matchCategory = (selectedCategory === 'all' || category === selectedCategory);
    const matchStatus = (selectedStatus === 'all' || statusList.includes(selectedStatus));
    const matchDate = (!selectedDate || date === selectedDate);

    card.style.display = (matchCategory && matchStatus && matchDate) ? 'block' : 'none';
  });

  // تحديث رسالة "لا توجد نتائج"
  const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
  const noResultsMsg = document.getElementById('noResultsMessage');
  if (noResultsMsg) {
    if (visibleCards.length === 0) {
      noResultsMsg.classList.remove('d-none');
    } else {
      noResultsMsg.classList.add('d-none');
    }
  }
}
// 🌙 تبديل الوضع الليلي/النهاري
const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    this.textContent = isDark ? '☀️' : '🌙';
  });