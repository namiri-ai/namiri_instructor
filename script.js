/**
 * AI강사 나미리 공식 웹사이트 - 인터랙션 스크립트 (script.js)
 * 모바일 GNB 토글, 부드러운 스크롤, FAQ 아코디언, 상단 이동, 이메일 복사 등
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 헤더 스크롤 감지 및 그림자 효과
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // 헤더 그림자
    if (scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // 상단 이동 버튼 노출
    if (scrollY > 300) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  // 상단 이동 버튼 클릭
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 2. 모바일 햄버거 메뉴 토글
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !mobileNavDrawer) return;
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', '메뉴 열기');
    mobileNavDrawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    if (!hamburgerBtn || !mobileNavDrawer) return;
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
    mobileNavDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  hamburgerBtn?.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // 모바일 메뉴 링크 클릭 시 닫기
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 모바일 드로어 바깥 클릭 시 닫기
  mobileNavDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileNavDrawer) {
      closeMobileMenu();
    }
  });

  // ESC 키로 모바일 메뉴 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // 3. FAQ 아코디언 동작
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // 다른 열린 아코디언 닫기 (아코디언 일관성)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger && otherPanel) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherPanel.style.maxHeight = null;
            otherItem.classList.remove('active');
          }
        }
      });

      // 현재 아이템 토글
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        item.classList.remove('active');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.classList.add('active');
      }
    });
  });

  // 첫 번째 FAQ 기본 열림 처리 (UX 향상)
  if (faqItems.length > 0) {
    const firstTrigger = faqItems[0].querySelector('.faq-trigger');
    const firstPanel = faqItems[0].querySelector('.faq-panel');
    if (firstTrigger && firstPanel) {
      firstTrigger.setAttribute('aria-expanded', 'true');
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
      faqItems[0].classList.add('active');
    }
  }

  // 4. 스크롤 위치에 따른 GNB 활성화 (Scrollspy)
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 5. 이메일 복사 기능 및 토스트 알림
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastMsg = document.getElementById('toastMsg');

  copyEmailBtn?.addEventListener('click', () => {
    const emailToCopy = 'contact@namiri.ai';
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast('이메일 주소가 복사되었습니다: ' + emailToCopy);
      }).catch(() => {
        fallbackCopy(emailToCopy);
      });
    } else {
      fallbackCopy(emailToCopy);
    }
  });

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('이메일 주소가 복사되었습니다: ' + text);
    } catch (err) {
      showToast('복사에 실패했습니다. 직접 입력해 주세요: ' + text);
    }
    document.body.removeChild(textArea);
  };

  let toastTimer = null;
  const showToast = (message) => {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2800);
  };
});
