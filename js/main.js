/* =========================
   Dark Mode
========================= */

const THEME_STORAGE_KEY = 'theme';

const themeToggle =
    document.querySelector('.theme-toggle');

const systemTheme =
    window.matchMedia('(prefers-color-scheme: dark)');


const applyTheme = (theme) => {

    document.documentElement.dataset.theme =
        theme;


    const isDark =
        theme === 'dark';


    themeToggle.textContent =
        isDark
            ? '☀️'
            : '🌙';


    themeToggle.setAttribute(
        'aria-label',
        isDark
            ? '라이트 모드로 전환'
            : '다크 모드로 전환'
    );

};


const getInitialTheme = () => {

    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );


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


applyTheme(
    getInitialTheme()
);


themeToggle.addEventListener(
    'click',
    () => {

        const currentTheme =
            document.documentElement.dataset.theme;


        const nextTheme =
            currentTheme === 'dark'
                ? 'light'
                : 'dark';


        localStorage.setItem(
            THEME_STORAGE_KEY,
            nextTheme
        );


        applyTheme(nextTheme);

    }
);


systemTheme.addEventListener(
    'change',
    (event) => {

        const savedTheme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );


        if (savedTheme) {

            return;

        }


        const nextTheme =
            event.matches
                ? 'dark'
                : 'light';


        applyTheme(nextTheme);

    }
);


/* =========================
   Mobile Navigation
========================= */

const menuToggle =
    document.querySelector('.menu-toggle');

const navMenu =
    document.querySelector('.nav-menu');

const navLinks =
    document.querySelectorAll(
        '.nav-menu a'
    );


menuToggle.addEventListener(
    'click',
    () => {

        navMenu.classList.toggle(
            'active'
        );


        const isOpen =
            navMenu.classList.contains(
                'active'
            );


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

    }
);


/* =========================
   Smooth Scroll
========================= */

navLinks.forEach((link) => {

    link.addEventListener(
        'click',
        (event) => {

            event.preventDefault();


            const targetId =
                link.getAttribute(
                    'href'
                );


            const targetSection =
                document.querySelector(
                    targetId
                );


            if (!targetSection) {

                return;

            }


            targetSection.scrollIntoView({
                behavior: 'smooth'
            });


            navMenu.classList.remove(
                'active'
            );


            menuToggle.setAttribute(
                'aria-expanded',
                'false'
            );


            menuToggle.setAttribute(
                'aria-label',
                '메뉴 열기'
            );

        }
    );

});


/* =========================
   Header & Scroll Top
========================= */

const header =
    document.querySelector('.header');

const scrollTopButton =
    document.querySelector('.scroll-top');


const updateScrollState = () => {

    /*
        60px 이상 스크롤하면
        Header 스타일 변경
    */
    header.classList.toggle(
        'scrolled',
        window.scrollY >= 60
    );


    /*
        300px 이상 스크롤하면
        Scroll Top 버튼 표시
    */
    scrollTopButton.classList.toggle(
        'visible',
        window.scrollY >= 300
    );

};


window.addEventListener(
    'scroll',
    updateScrollState
);


/*
    새로고침 당시 이미 스크롤된 상태일 수도 있으므로
    최초 한 번 실행한다.
*/
updateScrollState();


scrollTopButton.addEventListener(
    'click',
    () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }
);


/* =========================
   Scroll Reveal
========================= */

const revealElements =
    document.querySelectorAll(
        'main section'
    );

const prefersReducedMotion =
    window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


/*
    모션 감소 설정을 사용하거나
    IntersectionObserver를 지원하지 않는 경우
    콘텐츠를 바로 표시한다.
*/
if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window)
) {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                'revealed'
            );

        }
    );

} else {

    /*
        JavaScript가 실행됐을 때만
        reveal 클래스를 추가한다.

        JS가 동작하지 않는 환경에서도
        기본 콘텐츠가 숨겨지지 않게 하기 위함이다.
    */
    revealElements.forEach(
        (element) => {

            element.classList.add(
                'reveal'
            );

        }
    );


    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.classList.add(
                            'revealed'
                        );


                        /*
                            한 번 나타난 요소는
                            다시 감시할 필요가 없으므로 해제한다.
                        */
                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.2
            }
        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================
   GitHub Projects
========================= */

const GITHUB_USERNAME =
    'minsukim9';

const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;


const projectStatus =
    document.querySelector(
        '.project-status'
    );

const projectList =
    document.querySelector(
        '.project-list'
    );


let projectState = {
    status: 'idle',
    projects: [],
    errorMessage: ''
};


/* =========================
   Project State
========================= */

const updateProjectState = (
    nextState
) => {

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

const createProjectCards = (
    projects
) => {

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
                escapeHtml(
                    html_url
                );


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


    projectList.innerHTML = '';

    projectStatus.hidden = false;


    /* Loading */
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


    /* Error */
    if (status === 'error') {

        projectStatus.innerHTML = `
            <p>
                ${escapeHtml(
                    errorMessage
                )}
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


    /* Empty */
    if (status === 'empty') {

        projectStatus.textContent =
            '표시할 프로젝트가 없습니다.';


        return;

    }


    /* Success */
    if (status === 'success') {

        projectStatus.hidden = true;

        projectStatus.innerHTML = '';


        projectList.innerHTML =
            createProjectCards(
                projects
            );


        return;

    }


    /* Idle */
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
            await fetch(
                GITHUB_API_URL
            );


        if (!response.ok) {

            if (
                response.status === 403
            ) {

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


        if (
            projects.length === 0
        ) {

            updateProjectState({
                status: 'empty',
                projects: [],
                errorMessage: ''
            });


            return;

        }


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