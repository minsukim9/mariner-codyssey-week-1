/* =========================
   Dark Mode
========================= */

const THEME_STORAGE_KEY =
    'theme';


const themeToggle =
    document.querySelector(
        '.theme-toggle'
    );


const systemTheme =
    window.matchMedia(
        '(prefers-color-scheme: dark)'
    );


const applyTheme = (
    theme
) => {

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


    if (
        systemTheme.matches
    ) {

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
            document.documentElement
                .dataset
                .theme;


        const nextTheme =
            currentTheme === 'dark'
                ? 'light'
                : 'dark';


        localStorage.setItem(
            THEME_STORAGE_KEY,
            nextTheme
        );


        applyTheme(
            nextTheme
        );

    }
);


systemTheme.addEventListener(
    'change',
    (event) => {

        const savedTheme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );


        if (
            savedTheme
        ) {

            return;

        }


        const nextTheme =
            event.matches
                ? 'dark'
                : 'light';


        applyTheme(
            nextTheme
        );

    }
);


/* =========================
   Mobile Navigation
========================= */

const menuToggle =
    document.querySelector(
        '.menu-toggle'
    );


const navMenu =
    document.querySelector(
        '.nav-menu'
    );


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

navLinks.forEach(
    (link) => {

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


                if (
                    !targetSection
                ) {

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

    }
);


/* =========================
   Header & Scroll Top
========================= */

const header =
    document.querySelector(
        '.header'
    );


const scrollTopButton =
    document.querySelector(
        '.scroll-top'
    );


const updateScrollState = () => {

    header.classList.toggle(
        'scrolled',
        window.scrollY >= 60
    );


    scrollTopButton.classList.toggle(
        'visible',
        window.scrollY >= 300
    );

};


window.addEventListener(
    'scroll',
    updateScrollState
);


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


if (
    prefersReducedMotion ||
    !(
        'IntersectionObserver'
        in window
    )
) {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                'revealed'
            );

        }
    );

} else {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                'reveal'
            );

        }
    );


    const revealObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target
                            .classList
                            .add(
                                'revealed'
                            );


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
   Project Data
========================= */

const PROJECT_DATA_URL =
    './data/repos.json';


const projectStatus =
    document.querySelector(
        '.project-status'
    );


const projectList =
    document.querySelector(
        '.project-list'
    );


const projectFilters =
    document.querySelector(
        '.project-filters'
    );


let projectState = {

    status: 'idle',

    projects: [],

    selectedLanguage: 'all',

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

const escapeHtml = (
    value
) => {

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
            htmlEntities[
                character
            ]
    );

};


/* =========================
   Project Languages
========================= */

const getProjectLanguages = (
    projects
) => {

    const languages =
        projects.map(
            ({
                language
            }) =>
                language ||
                'Other'
        );


    return [
        ...new Set(
            languages
        )
    ].sort(
        (
            firstLanguage,
            secondLanguage
        ) =>
            firstLanguage.localeCompare(
                secondLanguage
            )
    );

};


/* =========================
   Project Filters
========================= */

const renderProjectFilters = (
    projects,
    selectedLanguage
) => {

    const languages =
        getProjectLanguages(
            projects
        );


    const filters = [
        'all',
        ...languages
    ];


    projectFilters.innerHTML =
        filters
            .map(
                (language) => {

                    const isAll =
                        language === 'all';


                    const label =
                        isAll
                            ? 'All'
                            : language;


                    const isActive =
                        selectedLanguage
                        === language;


                    return `
                        <button
                            class="
                                project-filter
                                ${
                                    isActive
                                        ? 'active'
                                        : ''
                                }
                            "
                            type="button"
                            data-language="${
                                escapeHtml(
                                    language
                                )
                            }"
                            aria-pressed="${
                                String(
                                    isActive
                                )
                            }"
                        >
                            ${
                                escapeHtml(
                                    label
                                )
                            }
                        </button>
                    `;

                }
            )
            .join('');


    projectFilters.hidden =
        false;

};


/* =========================
   Project Filter Event
========================= */

projectFilters.addEventListener(
    'click',
    (event) => {

        const filterButton =
            event.target.closest(
                '.project-filter'
            );


        if (
            !filterButton
        ) {

            return;

        }


        const selectedLanguage =
            filterButton.dataset
                .language;


        updateProjectState({

            selectedLanguage

        });

    }
);


/* =========================
   Project Card Render
========================= */

const createProjectCards = (
    projects
) => {

    return projects
        .map(
            (project) => {

                const {
                    name,
                    description,
                    language,
                    stargazers_count,
                    html_url
                } = project;


                const safeName =
                    escapeHtml(
                        name
                    );


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
                    <article
                        class="project-card"
                    >

                        <div
                            class="
                                project-card-header
                            "
                        >

                            <h3>
                                ${safeName}
                            </h3>

                            <span
                                class="
                                    project-language
                                "
                            >
                                ${safeLanguage}
                            </span>

                        </div>


                        <p
                            class="
                                project-description
                            "
                        >
                            ${safeDescription}
                        </p>


                        <div
                            class="
                                project-meta
                            "
                        >

                            <span>
                                ⭐ ${stargazers_count}
                            </span>

                            <a
                                href="${safeUrl}"
                                target="_blank"
                                rel="
                                    noopener
                                    noreferrer
                                "
                            >
                                View Repository
                            </a>

                        </div>

                    </article>
                `;

            }
        )
        .join('');

};


/* =========================
   Projects Render
========================= */

const renderProjects = () => {

    const {
        status,
        projects,
        selectedLanguage,
        errorMessage
    } = projectState;


    projectList.innerHTML =
        '';


    projectStatus.hidden =
        false;


    projectFilters.hidden =
        true;


    /* Loading */

    if (
        status === 'loading'
    ) {

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

    if (
        status === 'error'
    ) {

        projectStatus.innerHTML = `
            <p>
                ${
                    escapeHtml(
                        errorMessage
                    )
                }
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

    if (
        status === 'empty'
    ) {

        projectStatus.textContent =
            '표시할 프로젝트가 없습니다.';


        return;

    }


    /* Success */

    if (
        status === 'success'
    ) {

        renderProjectFilters(
            projects,
            selectedLanguage
        );


        const filteredProjects =
            selectedLanguage === 'all'
                ? projects
                : projects.filter(
                    ({
                        language
                    }) => {

                        const projectLanguage =
                            language ||
                            'Other';


                        return (
                            projectLanguage
                            === selectedLanguage
                        );

                    }
                );


        projectStatus.hidden =
            true;


        projectStatus.innerHTML =
            '';


        projectList.innerHTML =
            createProjectCards(
                filteredProjects
            );


        return;

    }


    projectStatus.hidden =
        true;

};


/* =========================
   Repository Data Fetch
========================= */

async function fetchProjects() {

    updateProjectState({

        status: 'loading',

        projects: [],

        selectedLanguage: 'all',

        errorMessage: ''

    });


    try {

        const response =
            await fetch(
                PROJECT_DATA_URL,
                {
                    cache: 'no-store'
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                '프로젝트 데이터를 불러올 수 없습니다.'
            );

        }


        const projects =
            await response.json();


        if (
            !Array.isArray(
                projects
            )
        ) {

            throw new Error(
                '프로젝트 데이터 형식이 올바르지 않습니다.'
            );

        }


        if (
            projects.length === 0
        ) {

            updateProjectState({

                status: 'empty',

                projects: [],

                selectedLanguage:
                    'all',

                errorMessage: ''

            });


            return;

        }


        updateProjectState({

            status: 'success',

            projects,

            selectedLanguage:
                'all',

            errorMessage: ''

        });


    } catch (
        error
    ) {

        console.error(
            'Project Data Error:',
            error
        );


        updateProjectState({

            status: 'error',

            projects: [],

            selectedLanguage:
                'all',

            errorMessage:
                error.message ||
                '프로젝트 데이터를 불러올 수 없습니다.'

        });

    }

}


/* =========================
   Contact Form
========================= */

const contactForm =
    document.querySelector(
        '.contact-form'
    );


const formFields = {

    name:
        document.querySelector(
            '#name'
        ),

    email:
        document.querySelector(
            '#email'
        ),

    message:
        document.querySelector(
            '#message'
        )

};


const formErrorElements = {

    name:
        document.querySelector(
            '#name-error'
        ),

    email:
        document.querySelector(
            '#email-error'
        ),

    message:
        document.querySelector(
            '#message-error'
        )

};


const formSuccess =
    document.querySelector(
        '.form-success'
    );


const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


let formState = {

    values: {

        name: '',

        email: '',

        message: ''

    },

    errors: {

        name: '',

        email: '',

        message: ''

    },

    successMessage: ''

};


/* =========================
   Contact Validation
========================= */

const validateContactField = (
    fieldName,
    value
) => {

    const trimmedValue =
        value.trim();


    if (
        fieldName === 'name'
    ) {

        if (
            !trimmedValue
        ) {

            return '이름을 입력해주세요.';

        }

    }


    if (
        fieldName === 'email'
    ) {

        if (
            !trimmedValue
        ) {

            return '이메일을 입력해주세요.';

        }


        if (
            !EMAIL_PATTERN.test(
                trimmedValue
            )
        ) {

            return '올바른 이메일 형식을 입력해주세요.';

        }

    }


    if (
        fieldName === 'message'
    ) {

        if (
            !trimmedValue
        ) {

            return '메시지를 입력해주세요.';

        }

    }


    return '';

};


/* =========================
   Contact Render
========================= */

const renderContactField = (
    fieldName
) => {

    const field =
        formFields[
            fieldName
        ];


    const errorElement =
        formErrorElements[
            fieldName
        ];


    const errorMessage =
        formState.errors[
            fieldName
        ];


    errorElement.textContent =
        errorMessage;


    field.setAttribute(
        'aria-invalid',
        String(
            Boolean(
                errorMessage
            )
        )
    );

};


const renderContactForm = () => {

    Object.keys(
        formFields
    ).forEach(
        renderContactField
    );


    formSuccess.textContent =
        formState.successMessage;

};


/* =========================
   Contact State
========================= */

const updateContactField = (
    fieldName,
    value
) => {

    formState = {

        ...formState,

        values: {

            ...formState.values,

            [fieldName]:
                value

        },

        errors: {

            ...formState.errors,

            [fieldName]:
                validateContactField(
                    fieldName,
                    value
                )

        },

        successMessage: ''

    };


    renderContactForm();

};


/* =========================
   Contact Input Event
========================= */

Object.entries(
    formFields
).forEach(
    (
        [
            fieldName,
            field
        ]
    ) => {

        field.addEventListener(
            'input',
            (event) => {

                updateContactField(
                    fieldName,
                    event.target.value
                );

            }
        );

    }
);


/* =========================
   Contact Submit Event
========================= */

contactForm.addEventListener(
    'submit',
    (event) => {

        event.preventDefault();


        const errors =
            Object.fromEntries(

                Object.entries(
                    formState.values
                )
                    .map(
                        (
                            [
                                fieldName,
                                value
                            ]
                        ) => [

                            fieldName,

                            validateContactField(
                                fieldName,
                                value
                            )

                        ]
                    )

            );


        const hasError =
            Object.values(
                errors
            )
                .some(
                    (
                        errorMessage
                    ) =>
                        Boolean(
                            errorMessage
                        )
                );


        formState = {

            ...formState,

            errors,

            successMessage: ''

        };


        renderContactForm();


        if (
            hasError
        ) {

            const firstInvalidFieldName =
                Object.keys(
                    errors
                )
                    .find(
                        (
                            fieldName
                        ) =>
                            Boolean(
                                errors[
                                    fieldName
                                ]
                            )
                    );


            formFields[
                firstInvalidFieldName
            ].focus();


            return;

        }


        contactForm.reset();


        formState = {

            values: {

                name: '',

                email: '',

                message: ''

            },

            errors: {

                name: '',

                email: '',

                message: ''

            },

            successMessage:
                '입력 내용이 정상적으로 확인되었습니다.'

        };


        renderContactForm();

    }
);


renderContactForm();


/* =========================
   Initial Load
========================= */

fetchProjects();