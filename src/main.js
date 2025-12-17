document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------
  // 1. ИНИЦИАЛИЗАЦИЯ (Иконки, Скролл)
  // --------------------------------------------------------

  // Иконки
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // GSAP плагины
  gsap.registerPlugin(ScrollTrigger);

  // Lenis (Smooth Scroll)
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // --------------------------------------------------------
  // 2. UI / МОБИЛЬНОЕ МЕНЮ
  // --------------------------------------------------------
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const headerLinks = document.querySelectorAll('.header__link');

  if (burgerBtn && navMenu) {
      const menuIcon = burgerBtn.querySelector('i');

      function toggleMenu() {
          navMenu.classList.toggle('is-active');
          const isActive = navMenu.classList.contains('is-active');

          if(menuIcon) {
              menuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
              lucide.createIcons();
          }

          if (isActive) {
              lenis.stop();
              document.body.style.overflow = 'hidden';
          } else {
              lenis.start();
              document.body.style.overflow = '';
          }
      }

      burgerBtn.addEventListener('click', toggleMenu);
      headerLinks.forEach(link => {
          link.addEventListener('click', () => {
              if(navMenu.classList.contains('is-active')) toggleMenu();
          });
      });
  }

  // --------------------------------------------------------
  // 3. COOKIE POPUP
  // --------------------------------------------------------
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('accept-cookies');

  if (cookiePopup && acceptBtn) {
      if (!localStorage.getItem('cookieConsent')) {
          setTimeout(() => {
              cookiePopup.classList.add('is-visible');
          }, 2000);
      }

      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'true');
          cookiePopup.classList.remove('is-visible');
      });
  }

  // --------------------------------------------------------
  // 4. АНИМАЦИИ (GSAP)
  // --------------------------------------------------------

  // --- HERO СЕКЦИЯ ---
  const heroTitle = document.querySelector('#hero-title');
  if (heroTitle && typeof SplitType !== 'undefined') {
      const splitTitle = new SplitType('#hero-title', { types: 'chars' });

      const heroTl = gsap.timeline();
      heroTl
          .from(splitTitle.chars, {
              opacity: 0,
              y: 100,
              rotateX: -90,
              stagger: 0.05,
              duration: 1,
              ease: "power4.out",
              delay: 0.2
          })
          .from('.hero__desc', { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
          .from('.hero__cta', { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.6")
          .from('.badge', { opacity: 0, y: -20, stagger: 0.1, duration: 0.5 }, "-=1");
  }

  // --- ЗАГОЛОВКИ СЕКЦИЙ ---
  const sectionTitles = document.querySelectorAll('.split-text');
  sectionTitles.forEach(title => {
      if (typeof SplitType !== 'undefined') {
          const split = new SplitType(title, { types: 'chars' });
          gsap.from(split.chars, {
              scrollTrigger: {
                  trigger: title,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
              },
              opacity: 0,
              y: 50,
              stagger: 0.03,
              duration: 0.8,
              ease: "back.out(1.7)"
          });
      }
  });

  // --- TEKСТ "О ПЛАТФОРМЕ" ---
  const revealTexts = document.querySelectorAll('.reveal-text');
  revealTexts.forEach(text => {
      gsap.from(text, {
          scrollTrigger: {
              trigger: text,
              start: "top 90%"
          },
          opacity: 0,
          y: 30,
          duration: 1
      });
  });

  // --- КАРТОЧКИ ПРЕИМУЩЕСТВ ---
  const bCards = gsap.utils.toArray('.b-card');
  if (bCards.length > 0) {
      gsap.from(bCards, {
          scrollTrigger: {
              trigger: ".benefits__grid",
              start: "top 85%"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          clearProps: "all"
      });
  }

  // --- СЧЕТЧИК ЧИСЕЛ ---
  const counter = document.querySelector('.count-up');
  if (counter) {
      gsap.to(counter, {
          scrollTrigger: {
              trigger: counter,
              start: "top 85%"
          },
          innerText: 98,
          duration: 2.5,
          snap: { innerText: 1 },
          ease: "power1.inOut",
          onUpdate: function() {
              counter.innerHTML = Math.ceil(this.targets()[0].innerText);
          }
      });
  }

  // --- ИННОВАЦИИ ---
  const circles = document.querySelectorAll('.cyber-circle');
  if (circles.length > 0) {
      gsap.from(circles, {
          scrollTrigger: {
              trigger: '.innovation__visual',
              start: "top 75%"
          },
          scale: 0,
          opacity: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: "elastic.out(1, 0.7)"
      });
  }

  // --------------------------------------------------------
  // 5. АККОРДЕОН
  // --------------------------------------------------------
  const accordions = document.querySelectorAll('.accordion__item');
  accordions.forEach(item => {
      const header = item.querySelector('.accordion__header');
      header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          accordions.forEach(el => {
              el.classList.remove('active');
              el.querySelector('.accordion__body').style.maxHeight = null;
              const icon = el.querySelector('i');
              if(icon) icon.style.transform = 'rotate(0deg)';
          });

          if (!isActive) {
              item.classList.add('active');
              const body = item.querySelector('.accordion__body');
              body.style.maxHeight = body.scrollHeight + "px";
              const icon = item.querySelector('i');
              if(icon) icon.style.transform = 'rotate(45deg)';
          }
      });
  });

  // --------------------------------------------------------
  // 6. ФОРМА КОНТАКТОВ (ВАЛИДАЦИЯ)
  // --------------------------------------------------------
  const form = document.getElementById('lead-form');
  if(form) {
      const phoneInput = form.querySelector('input[name="phone"]');
      const captchaInput = document.getElementById('captcha-input');
      const msg = document.getElementById('form-message');
      const submitBtn = form.querySelector('button[type="submit"]');

      // А) ЗАПРЕТ ВВОДА БУКВ В РЕАЛЬНОМ ВРЕМЕНИ
      if (phoneInput) {
          phoneInput.addEventListener('input', function(e) {
              // Заменяем любые символы, кроме цифр, пробелов, скобок, +, - на пустоту
              this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
          });
      }

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          msg.textContent = "";
          msg.style.color = "inherit";

          // Б) ПРОВЕРКА КАПЧИ
          if(parseInt(captchaInput.value) !== 4) {
              msg.textContent = "Ошибка: Неверный результат примера (2+2).";
              msg.style.color = "#ff4444";
              captchaInput.style.borderColor = "#ff4444";
              return;
          } else {
              captchaInput.style.borderColor = "#333";
          }

          // В) ПРОВЕРКА ТЕЛЕФОНА (Длина)
          // Убираем всё, кроме цифр, чтобы проверить реальное количество цифр
          const digitsOnly = phoneInput.value.replace(/\D/g, '');

          if (digitsOnly.length < 7) {
              msg.textContent = "Ошибка: Введите корректный номер телефона.";
              msg.style.color = "#ff4444";
              phoneInput.style.borderColor = "#ff4444";
              return;
          } else {
              phoneInput.style.borderColor = "#333";
          }

          // Г) УСПЕШНАЯ ОТПРАВКА
          const originalBtnText = submitBtn.innerText;
          submitBtn.innerText = "Отправка...";
          submitBtn.disabled = true;

          setTimeout(() => {
              submitBtn.innerText = "Заявка отправлена!";
              submitBtn.style.background = "var(--accent-lime)";
              submitBtn.style.color = "#000";
              msg.textContent = "Мы свяжемся с вами в ближайшее время.";
              msg.style.color = "var(--accent-lime)";
              form.reset();

              setTimeout(() => {
                  submitBtn.innerText = originalBtnText;
                  submitBtn.disabled = false;
                  submitBtn.style.background = "";
                  submitBtn.style.color = "";
                  msg.textContent = "";
              }, 4000);
          }, 1500);
      });
  }
});