/* =========================
   Dark Mode
========================= */

const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {

    const currentTheme =
        document.documentElement.dataset.theme;

    if (currentTheme === 'dark') {

        document.documentElement.dataset.theme = 'light';

    } else {

        document.documentElement.dataset.theme = 'dark';

    }

});


/* =========================
   Mobile Navigation
========================= */

const menuToggle =
    document.querySelector('.menu-toggle');

const navMenu =
    document.querySelector('.nav-menu');

const navLinks =
    document.querySelectorAll('.nav-menu a');


menuToggle.addEventListener('click', () => {

    /*
        active 클래스가 없으면 추가하고,
        있으면 제거한다.
    */
    navMenu.classList.toggle('active');


    /*
        현재 메뉴가 열려있는지 확인
    */
    const isOpen =
        navMenu.classList.contains('active');


    /*
        접근성을 위한 상태 변경
    */
    menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
    );


    /*
        버튼의 설명도 현재 상태에 맞게 변경
    */
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? '메뉴 닫기' : '메뉴 열기'
    );

});


/* =========================
   Smooth Scroll
========================= */

navLinks.forEach((link) => {

    link.addEventListener('click', (event) => {

        /*
            <a href="#about">의
            기본 이동 동작을 막는다.
        */
        event.preventDefault();


        /*
            클릭한 링크의 href 값을 가져온다.

            About의 경우:
            "#about"
        */
        const targetId =
            link.getAttribute('href');


        /*
            href와 같은 id를 가진
            section을 찾는다.
        */
        const targetSection =
            document.querySelector(targetId);


        /*
            해당 section으로
            부드럽게 이동한다.
        */
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });


        /*
            모바일 메뉴가 열려 있다면 닫는다.
        */
        navMenu.classList.remove('active');


        /*
            접근성 상태도 닫힌 상태로 변경한다.
        */
        menuToggle.setAttribute(
            'aria-expanded',
            'false'
        );


        menuToggle.setAttribute(
            'aria-label',
            '메뉴 열기'
        );

    });

});


/* =========================
   Header Scroll
========================= */

const header =
    document.querySelector('.header');


window.addEventListener('scroll', () => {

    /*
        현재 페이지가 위에서부터
        얼마나 스크롤됐는지를 확인한다.
    */
    if (window.scrollY >= 60) {

        header.classList.add('scrolled');

    } else {

        header.classList.remove('scrolled');

    }

});