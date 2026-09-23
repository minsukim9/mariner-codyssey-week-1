/* =========================
   Dark Mode
========================= */

const themeToggle =
    document.querySelector('.theme-toggle');


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

    navMenu.classList.toggle('active');


    const isOpen =
        navMenu.classList.contains('active');


    menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
    );


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

const GITHUB_USERNAME = 'minsukim9';

const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;


const projectStatus =
    document.querySelector('.project-status');

const projectList =
    document.querySelector('.project-list');


/*
    Projects 영역에서 관리할 상태

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

/*
    GitHub에서 받은 문자열을 innerHTML에
    안전하게 출력하기 위한 함수
*/
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
        (character) => htmlEntities[character]
    );

};


/* =========================
   Project Card Render
========================= */

const createProjectCards = (projects) => {

    return projects.map((project) => {

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
                description || '등록된 프로젝트 설명이 없습니다.'
            );

        const safeLanguage =
            escapeHtml(
                language || 'Other'
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

    }).join('');

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
        렌더링할 때 이전 화면을 정리한다.
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
            document.querySelector('.retry-projects');


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
            HTTP 응답이 2xx가 아닌 경우
            직접 Error를 발생시킨다.
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
            Repository가 하나도 없는 경우
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
            정상적으로 데이터를 가져온 경우
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