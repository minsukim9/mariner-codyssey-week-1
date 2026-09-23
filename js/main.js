/* =========================
   Dark Mode
========================= */

const THEME_STORAGE_KEY = 'theme';

const themeToggle =
    document.querySelector('.theme-toggle');

const systemTheme =
    window.matchMedia('(prefers-color-scheme: dark)');


/*
    실제 화면에 테마를 적용하는 함수
*/
const applyTheme = (theme) => {

    document.documentElement.dataset.theme = theme;


    const isDark =
        theme === 'dark';


    /*
        현재 테마에 맞춰
        버튼 아이콘과 접근성 텍스트 변경
    */
    themeToggle.textContent =
        isDark ? '☀️' : '🌙';


    themeToggle.setAttribute(
        'aria-label',
        isDark
            ? '라이트 모드로 전환'
            : '다크 모드로 전환'
    );

};


/*
    초기 테마 결정

    우선순위

    1. localStorage
    2. 시스템 설정
    3. light
*/
const getInitialTheme = () => {

    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);


    if (
        savedTheme === 'dark' ||
        savedTheme === 'light'
    ) {

        return savedTheme;

    }


    if (systemTheme.matches) {

        return 'dark';

    }


    return 'light';

};


/*
    페이지 최초 로드 시
    저장된 테마 적용
*/
applyTheme(
    getInitialTheme()
);


/*
    테마 버튼 클릭
*/
themeToggle.addEventListener('click', () => {

    const currentTheme =
        document.documentElement.dataset.theme;


    const nextTheme =
        currentTheme === 'dark'
            ? 'light'
            : 'dark';


    /*
        상태 저장
    */
    localStorage.setItem(
        THEME_STORAGE_KEY,
        nextTheme
    );


    /*
        화면 변경
    */
    applyTheme(nextTheme);

});


/*
    사용자가 직접 테마를 선택한 적이 없다면
    시스템 테마 변경을 자동으로 반영한다.
*/
systemTheme.addEventListener('change', (event) => {

    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);


    /*
        사용자가 직접 선택한 테마가 있다면
        시스템 설정으로 덮어쓰지 않는다.
    */
    if (savedTheme) {

        return;

    }


    const nextTheme =
        event.matches
            ? 'dark'
            : 'light';


    applyTheme(nextTheme);

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

    navMenu.classList.toggle('active');


    const isOpen =
        navMenu.classList.contains('active');


    menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
    );


    menuToggle.setAttribute(
        'aria-label',
        isOpen
            ? '메뉴 닫기'
            : '메뉴 열기'
    );

});


/* =========================
   Smooth Scroll
========================= */

navLinks.forEach((link) => {

    link.addEventListener('click', (event) => {

        event.preventDefault();


        const targetId =
            link.getAttribute('href');


        const targetSection =
            document.querySelector(targetId);


        if (!targetSection) {

            return;

        }


        targetSection.scrollIntoView({
            behavior: 'smooth'
        });


        navMenu.classList.remove('active');


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

    if (window.scrollY >= 60) {

        header.classList.add('scrolled');

    } else {

        header.classList.remove('scrolled');

    }

});


/* =========================
   GitHub Projects
========================= */

const GITHUB_USERNAME =
    'minsukim9';

const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;


const projectStatus =
    document.querySelector('.project-status');

const projectList =
    document.querySelector('.project-list');


/*
    Projects 상태

    idle
    loading
    success
    error
    empty
*/
let projectState = {
    status: 'idle',
    projects: [],
    errorMessage: ''
};


/* =========================
   Project State
========================= */

const updateProjectState = (nextState) => {

    projectState = {
        ...projectState,
        ...nextState
    };


    renderProjects();

};


/* =========================
   HTML Escape
========================= */

const escapeHtml = (value) => {

    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };


    return String(value).replace(
        /[&<>"']/g,
        (character) =>
            htmlEntities[character]
    );

};


/* =========================
   Project Card Render
========================= */

const createProjectCards = (projects) => {

    return projects
        .map((project) => {

            const {
                name,
                description,
                language,
                stargazers_count,
                html_url
            } = project;


            const safeName =
                escapeHtml(name);


            const safeDescription =
                escapeHtml(
                    description ||
                    '등록된 프로젝트 설명이 없습니다.'
                );


            const safeLanguage =
                escapeHtml(
                    language ||
                    'Other'
                );


            const safeUrl =
                escapeHtml(html_url);


            return `
                <article class="project-card">

                    <div class="project-card-header">

                        <h3>
                            ${safeName}
                        </h3>

                        <span class="project-language">
                            ${safeLanguage}
                        </span>

                    </div>


                    <p class="project-description">
                        ${safeDescription}
                    </p>


                    <div class="project-meta">

                        <span>
                            ⭐ ${stargazers_count}
                        </span>

                        <a
                            href="${safeUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Repository
                        </a>

                    </div>

                </article>
            `;

        })
        .join('');

};


/* =========================
   Projects Render
========================= */

const renderProjects = () => {

    const {
        status,
        projects,
        errorMessage
    } = projectState;


    /*
        이전 렌더링 결과 초기화
    */
    projectList.innerHTML = '';

    projectStatus.hidden = false;


    /*
        Loading
    */
    if (status === 'loading') {

        projectStatus.innerHTML = `
            <div
                class="loading-spinner"
                aria-hidden="true"
            ></div>

            <p>
                프로젝트를 불러오는 중입니다...
            </p>
        `;

        return;

    }


    /*
        Error
    */
    if (status === 'error') {

        projectStatus.innerHTML = `
            <p>
                ${escapeHtml(errorMessage)}
            </p>

            <button
                class="retry-projects"
                type="button"
            >
                다시 시도
            </button>
        `;


        const retryButton =
            document.querySelector(
                '.retry-projects'
            );


        retryButton.addEventListener(
            'click',
            fetchProjects
        );


        return;

    }


    /*
        Empty
    */
    if (status === 'empty') {

        projectStatus.textContent =
            '표시할 프로젝트가 없습니다.';

        return;

    }


    /*
        Success
    */
    if (status === 'success') {

        projectStatus.hidden = true;

        projectStatus.innerHTML = '';


        projectList.innerHTML =
            createProjectCards(projects);


        return;

    }


    /*
        Idle
    */
    projectStatus.hidden = true;

};


/* =========================
   GitHub API
========================= */

async function fetchProjects() {

    updateProjectState({
        status: 'loading',
        projects: [],
        errorMessage: ''
    });


    try {

        const response =
            await fetch(GITHUB_API_URL);


        /*
            fetch는 404, 500 등의 응답만으로
            catch가 실행되지 않으므로
            response.ok를 직접 확인한다.
        */
        if (!response.ok) {

            if (response.status === 403) {

                throw new Error(
                    'GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
                );

            }


            throw new Error(
                '프로젝트를 불러올 수 없습니다.'
            );

        }


        const projects =
            await response.json();


        /*
            Repository가 존재하지 않는 경우
        */
        if (projects.length === 0) {

            updateProjectState({
                status: 'empty',
                projects: [],
                errorMessage: ''
            });


            return;

        }


        /*
            정상 응답
        */
        updateProjectState({
            status: 'success',
            projects,
            errorMessage: ''
        });


    } catch (error) {

        console.error(
            'GitHub API Error:',
            error
        );


        updateProjectState({
            status: 'error',
            projects: [],
            errorMessage:
                error.message ||
                '프로젝트를 불러올 수 없습니다.'
        });

    }

}


/* =========================
   Initial Load
========================= */

fetchProjects();