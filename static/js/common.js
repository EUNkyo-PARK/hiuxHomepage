function commonUI() {
  // gnb 메뉴
  let $gnbTxt = $('.commonGnb li a');
  const $title = $.trim($('#pageTit').text());
  $gnbTxt.each(function () {
    if ($(this).text() === $title) {
      var $parents = $(this).parents('li');
      $parents.addClass('active');
    }
  });

  function menuPop() {
    const openBtn = $('.header .btn-menu');

    document.addEventListener('scroll', function () {
      const scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
      const header = document.querySelector('.header');
      const headerH = header.clientHeight;

      if (scrollTopValue >= headerH) {
        header.classList.add('fixed');
      } else {
        header.classList.remove('fixed');
      }
    });

    openBtn.on('click', function () {
      const $this = $(this);
      $this.closest('body').delay().toggleClass('gnbPopup');
      if ($this.closest('body').hasClass('gnbPopup')) {
        $this.attr('aria-label', '메뉴 닫힘');
      } else {
        $this.attr('aria-label', '메뉴 열림');
      }
    });
  }

  // 스크롤 top 버튼
  function scrollTop() {
    let scrollArea;
    const scrollBtn = $('.scroll-top');
    const wrapper = document.querySelector('#container');
    const btn = scrollBtn.children();

    scrollBtn.hide();

    if ($('#wrapper').hasClass('main')) {
      scrollArea = $('.contents-group-box .inner');
    } else {
      scrollArea = $('#wrapper');
    }

    scrollArea.scroll(function () {
      if ($(this).scrollTop() > 100) {
        scrollBtn.fadeIn();
      } else if (scrollArea.scrollTop() <= 0) {
        // 스크롤 0 일때 닫기
        setTimeout(function () {
          wrapper.classList.remove('active');
        }, 100);
      } else {
        scrollBtn.fadeOut();
      }
    });

    btn.on('click', function () {
      scrollArea.animate(
        {
          scrollTop: 0
        },
        800,
        function () {
          $(this).closest('#container').removeClass('active');
        }
      );
    });
  }
  menuPop();
  scrollTop();
}
commonUI();

// 메인
let mainBanner;
function mainUI() {
  const wrapper = document.querySelector('#container');
  const dragElement = document.querySelector('.main-slide-wrap');
  const cateList = document.querySelector('.contents-box');
  document.querySelector;

  const btnMenu = document.querySelector('.contents-group-box .btn-open-career');
  let isDragging = false;
  let initialX;
  let initialY;

  // 메인 배너 스와이퍼
  const mainBanner = new Swiper('.main-swiper', {
    loop: true,
    preventInteractionOnTransition: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  });

  // 메인 work 스와이퍼
  const workSlider = new Swiper('.small-swiper', {
    slidesPerView: 'auto',
    breakpoints: {
      1024: {
        slidesPerView: 3.4
      },
      768: {
        slidesPerView: 2.2
      }
    }
  });

  // 메인 휠 스크롤,터치 무브 이벤트
  wrapper.addEventListener('mousedown', handleMouseDown);
  dragElement.addEventListener('touchstart', handleTouchStart);
  dragElement.addEventListener('wheel', handleWheel);

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleTouchMove);

  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchend', handleTouchEnd);

  btnMenu.addEventListener('click', menuToggle);
  //btnMenu.addEventListener('touchend', menuToggle);

  function menuToggle() {
    if (wrapper.classList.contains('active')) {
      wrapper.classList.remove('active');
    } else {
      wrapper.classList.add('active');
    }
  }

  function handleWheel(e) {
    const direction = e.deltaY > 0 ? 'down' : 'up';
    wrapper.classList.toggle('active', direction === 'down');
  }

  function handleMouseDown(e) {
    // 마우스 왼쪽 버튼(버튼 코드: 0)에 대한 클릭만 처리
    if (e.button === 0) {
      e.preventDefault();
      isDragging = true;
      initialX = e.clientX;
      initialY = e.clientY;
    }
  }

  function handleTouchStart(e) {
    e.preventDefault();
    isDragging = true;
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function handleDrag(e) {
    if (isDragging) {
      let currentX = e.clientX;
      let currentY = e.clientY;
      handleDragMovement(currentX, currentY);
    }
  }

  function handleTouchMove(e) {
    if (isDragging) {
      let currentX = e.touches[0].clientX;
      let currentY = e.touches[0].clientY;
      handleDragMovement(currentX, currentY);
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  function handleDragMovement(currentX, currentY) {
    let deltaX = currentX - initialX;
    let deltaY = currentY - initialY;

    const scrollArea = $('.contents-group-box .inner');

    if (isInsideCateList(currentX, currentY)) {
      isDragging = false;
    }

    if (deltaY > 120) {
      wrapper.classList.remove('active');
    } else if (deltaY < -120) {
      wrapper.classList.add('active');
      scrollArea.scrollTop(1);
    }
  }

  function isInsideCateList(currentX, currentY) {
    const cateListRect = cateList.getBoundingClientRect();
    return currentY >= cateListRect.top && currentY <= cateListRect.bottom;
  }
}
