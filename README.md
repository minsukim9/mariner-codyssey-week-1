# MINSU Portfolio

Vanilla HTML, CSS, JavaScript로 구현한 반응형 개인 포트폴리오 웹사이트입니다.

프레임워크나 UI 라이브러리를 사용하지 않고
시맨틱 HTML, 반응형 CSS, DOM API, Web API를 활용해 구현했습니다.

GitHub Actions에서 인증된 GitHub REST API를 호출해
Repository 데이터를 정적 JSON으로 생성하고,
GitHub Pages를 통해 포트폴리오를 배포합니다.

---

## 프로젝트 소개

개인 소개와 기술 스택, GitHub 프로젝트, 연락처 정보를
하나의 페이지에서 확인할 수 있는 포트폴리오 웹사이트입니다.

사용자의 이벤트에 따라 상태를 변경하고,
변경된 상태를 기반으로 화면을 렌더링하도록 구현했습니다.

```text
사용자 이벤트
    ↓
JavaScript 상태 변경
    ↓
Render 함수 실행
    ↓
DOM 업데이트
    ↓
화면 변경
```

---

## 기술 스택

### HTML

- HTML5
- Semantic HTML
- Accessibility
  - `aria-label`
  - `aria-expanded`
  - `aria-invalid`
  - `aria-describedby`
  - `aria-live`
  - `aria-pressed`

### CSS

- CSS Variables
- Flexbox
- CSS Grid
- Media Query
- Transition
- Animation
- Mobile First Responsive Design
- Dark Theme

### JavaScript

- Vanilla JavaScript
- DOM API
- Event Listener
- Fetch API
- Async / Await
- Local Storage
- Intersection Observer
- MatchMedia
- Array Methods

### API & Deployment

- GitHub REST API
- GitHub Actions
- GitHub Pages

---

## 주요 기능

### 1. 반응형 네비게이션

모바일 환경에서는 햄버거 메뉴를 사용하고,
데스크톱 환경에서는 전체 네비게이션 메뉴가 표시됩니다.

```text
Mobile
→ Hamburger Menu

Desktop
→ Navigation Menu
```

햄버거 버튼 클릭 시 `active` 클래스를 토글하고,
현재 메뉴 상태에 따라 `aria-expanded`와 `aria-label`을 변경합니다.

---

### 2. Smooth Scroll

네비게이션 메뉴를 클릭하면
해당 Section으로 부드럽게 이동합니다.

```javascript
targetSection.scrollIntoView({
    behavior: 'smooth'
});
```

Sticky Header와 Section이 겹치지 않도록
`scroll-margin-top`을 적용했습니다.

---

### 3. Header Scroll Effect

페이지를 일정 거리 이상 스크롤하면
Header의 배경과 그림자 스타일이 변경됩니다.

기준값:

```text
60px
```

```text
scroll
→ scrollY 확인
→ scrolled 클래스 변경
→ Header 스타일 변경
```

---

### 4. Dark Mode

Light / Dark Theme를 전환할 수 있습니다.

JavaScript에서 스타일을 직접 변경하는 대신
`data-theme`과 CSS Variables를 사용합니다.

```html
<html data-theme="dark">
```

사용자가 선택한 테마는 `localStorage`에 저장됩니다.

```text
1. localStorage 사용자 설정
2. prefers-color-scheme 시스템 설정
3. 기본 Light Theme
```

따라서 페이지를 새로고침해도
사용자가 선택한 테마가 유지됩니다.

---

### 5. About 반응형 레이아웃

About 영역은 Flexbox를 사용했습니다.

모바일:

```text
Profile
   ↓
Description
```

태블릿 이상:

```text
Profile | Description
```

프로필 이미지는 `aspect-ratio`와 `object-fit`을 사용해
일정한 비율을 유지합니다.

---

### 6. Skills

Skills는 관련 기술을 카테고리별로 그룹화했습니다.

#### Backend

- Java
- Spring Boot
- Spring Security
- JPA
- QueryDSL

#### Database

- PostgreSQL
- Redis
- MongoDB

#### Infra & DevOps

- AWS
- Docker
- Jenkins
- Nginx

#### Real-time & Messaging

- WebSocket
- STOMP
- RabbitMQ

Skill Group은 CSS Grid로 배치하고,
각 기술은 Flexbox 기반의 Pill 형태 태그로 구성했습니다.

```css
grid-template-columns:
    repeat(
        auto-fit,
        minmax(260px, 1fr)
    );
```

---

### 7. Projects Grid

프로젝트 카드는 CSS Grid로 구성했습니다.

```css
grid-template-columns:
    repeat(
        auto-fit,
        minmax(260px, 1fr)
    );
```

카드 내부에서는 Flexbox를 사용해
프로젝트 설명의 길이가 달라도
하단 정보가 일정한 위치에 오도록 구성했습니다.

---

### 8. Projects Language Filter

GitHub Repository에서 가져온 언어 정보를 기반으로
프로젝트 필터 버튼을 동적으로 생성합니다.

예:

```text
All
Java
JavaScript
Python
Other
```

기본 상태는:

```text
All
```

입니다.

사용자가 특정 언어를 선택하면
전체 Repository 배열에서 해당 언어의 프로젝트만 표시합니다.

```javascript
const filteredProjects =
    projects.filter(
        ({ language }) =>
            language === selectedLanguage
    );
```

현재 선택한 필터는 `projectState`에서 관리합니다.

```javascript
let projectState = {
    status: 'idle',
    projects: [],
    selectedLanguage: 'all',
    errorMessage: ''
};
```

필터를 변경해도 GitHub API나 `repos.json`을 다시 요청하지 않고,
이미 불러온 Repository 데이터를 대상으로 화면만 다시 렌더링합니다.

---

## GitHub Repository 데이터

초기 구현에서는 사용자 브라우저가
GitHub REST API를 직접 호출했습니다.

```text
Browser
→ GitHub REST API
→ Repository 데이터
```

이 방식은 인증되지 않은 API 요청의
Rate Limit 영향을 받을 수 있었습니다.

현재는 GitHub Actions가
Repository 데이터를 미리 생성하도록 변경했습니다.

```text
GitHub Actions
    ↓
인증된 GitHub REST API
    ↓
repos.json 생성
    ↓
GitHub Pages 배포
```

사용자 브라우저에서는 GitHub API를 직접 호출하지 않습니다.

```text
Browser
    ↓
./data/repos.json
    ↓
Projects 렌더링
```

---

## GitHub Actions

GitHub Actions Workflow에서
Personal Access Token을 이용해
인증된 GitHub REST API 요청을 수행합니다.

인증 정보는 Repository Secret으로 관리합니다.

```text
GH_API_TOKEN
```

Token은 JavaScript나 배포 결과물에 포함되지 않습니다.

Workflow는 다음 상황에서 실행됩니다.

```text
main branch push

GitHub Actions 수동 실행

6시간 주기 Scheduled Workflow
```

---

## Repository JSON

GitHub Actions가 다음 데이터를 추출해
`repos.json`을 생성합니다.

```text
name
description
language
stargazers_count
html_url
```

배포된 사이트에서는:

```text
./data/repos.json
```

을 `fetch()`로 읽습니다.

---

## Projects 상태 관리

Projects 영역은 다음 상태를 관리합니다.

```text
idle
loading
success
error
empty
```

추가로 현재 선택된 언어를:

```text
selectedLanguage
```

상태로 관리합니다.

동작 흐름:

```text
repos.json 요청
    ↓
상태 변경
    ↓
renderProjects()
    ↓
언어 필터 생성
    ↓
filter()
    ↓
Project Card 렌더링
```

| 상태 | 화면 |
| --- | --- |
| loading | Loading Spinner |
| success | Language Filter + Repository Card |
| error | Error Message + Retry |
| empty | Empty Message |

---

### 9. Scroll Top

페이지를 일정 거리 이상 스크롤하면
오른쪽 아래에 Scroll Top 버튼이 표시됩니다.

표시 기준:

```text
300px
```

```javascript
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
```

---

### 10. Scroll Reveal Animation

각 Section이 화면에 들어올 때
Intersection Observer를 이용해 애니메이션을 실행합니다.

```javascript
{
    threshold: 0.2
}
```

Section의 약 20%가 화면에 진입하면
`revealed` 클래스가 추가됩니다.

```text
Section 진입
→ IntersectionObserver
→ revealed 클래스 추가
→ CSS Transition
```

한 번 나타난 Section은 `unobserve()`를 호출해
추가 관찰을 중단합니다.

---

### 11. Reduced Motion

운영체제에서 애니메이션 감소 설정을 사용하는 사용자를 위해
`prefers-reduced-motion`을 지원합니다.

```css
@media (prefers-reduced-motion: reduce) {
    ...
}
```

---

### 12. Contact Form Validation

Contact 폼에는 다음 필드가 있습니다.

```text
이름
이메일
메시지
```

검증 항목:

- 이름 필수 입력
- 이메일 필수 입력
- 이메일 형식 확인
- 메시지 필수 입력

이메일 형식 검증:

```javascript
const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

입력 중에는 `input` 이벤트를 사용해
실시간으로 유효성을 검사합니다.

폼 제출 시에는:

```javascript
event.preventDefault();
```

를 사용해 브라우저의 기본 제출 동작을 방지합니다.

---

## JavaScript 이벤트

| 이벤트 | 사용 위치 |
| --- | --- |
| `click` | 햄버거 메뉴, 다크 모드, Project Filter, Scroll Top, Retry |
| `scroll` | Header, Scroll Top |
| `input` | Contact 실시간 유효성 검사 |
| `submit` | Contact 제출 |
| `change` | 시스템 Theme 변경 |

모든 이벤트는 inline handler 대신
`addEventListener()`를 사용합니다.

---

## ES6+ 문법

### Arrow Function

```javascript
const applyTheme = (theme) => {
    ...
};
```

### Template Literal

```javascript
return `
    <article class="project-card">
        ...
    </article>
`;
```

### Destructuring

```javascript
const {
    name,
    description,
    language,
    stargazers_count,
    html_url
} = project;
```

### Spread Syntax

```javascript
projectState = {
    ...projectState,
    ...nextState
};
```

### map()

Repository 데이터를 Project Card HTML로 변환할 때 사용합니다.

```javascript
projects.map((project) => {
    ...
});
```

### filter()

사용자가 선택한 언어와 일치하는
Repository만 추출할 때 사용합니다.

```javascript
projects.filter(
    ({ language }) =>
        language === selectedLanguage
);
```

### forEach()

Navigation과 DOM Element에
이벤트를 등록할 때 사용합니다.

```javascript
navLinks.forEach((link) => {
    ...
});
```

추가로:

```text
some()
find()
```

등의 배열 메서드도
Contact Form 유효성 검사에 사용합니다.

---

## 반응형 디자인

Mobile First 방식으로 구현했습니다.

```text
Mobile
기본 스타일

Tablet
768px 이상

Desktop
1024px 이상
```

```css
@media (min-width: 768px) {
    ...
}

@media (min-width: 1024px) {
    ...
}
```

---

## Flexbox와 Grid 사용 기준

### Flexbox

한 방향으로 요소를 배치할 때 사용했습니다.

```text
Navigation
Hero Actions
About
Skill Tags
Project Filters
Project Card 내부
Contact Form
```

### Grid

행과 열을 기준으로 여러 요소를 배치할 때 사용했습니다.

```text
Skill Groups
Projects
```

---

## 프로젝트 구조

```text
mariner-codyssey-week-1/
│
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
└── images/
    └── profile.jpeg
```

`data/repos.json`은 Repository에 직접 저장하지 않고
GitHub Actions 실행 과정에서 자동으로 생성합니다.

배포 artifact 구조:

```text
dist/
├── index.html
├── css/
├── js/
├── images/
└── data/
    └── repos.json
```

---

## 로컬 실행

별도의 패키지 설치 과정은 필요하지 않습니다.

```bash
git clone https://github.com/minsukim9/mariner-codyssey-week-1.git
```

```bash
cd mariner-codyssey-week-1
```

HTML/CSS/JavaScript는
Live Server 등을 이용해 실행할 수 있습니다.

단, `repos.json`은 GitHub Actions에서 생성되기 때문에
로컬 환경에서는 Projects 데이터 요청이 실패할 수 있습니다.

배포 환경에서는 GitHub Actions가 생성한 JSON을 사용합니다.

---

## 배포

GitHub Pages와 GitHub Actions를 이용해 자동 배포합니다.

GitHub Pages 설정:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

배포 흐름:

```text
main branch push
    ↓
GitHub Actions 실행
    ↓
GitHub REST API Repository 조회
    ↓
repos.json 생성
    ↓
dist 생성
    ↓
Pages Artifact Upload
    ↓
GitHub Pages Deploy
```

---

## 배포 URL

```text
https://minsukim9.github.io/mariner-codyssey-week-1/
```

Repository 데이터:

```text
https://minsukim9.github.io/mariner-codyssey-week-1/data/repos.json
```

---

## 주요 구현 기준

| 항목 | 설정 |
| --- | --- |
| Header 변경 기준 | 60px |
| Scroll Top 표시 기준 | 300px |
| Intersection Observer | threshold 0.2 |
| Tablet Breakpoint | 768px |
| Desktop Breakpoint | 1024px |
| Skill Group 최소 너비 | 260px |
| Project 최소 카드 너비 | 260px |
| Project Filter | Repository Language |
| Repository 자동 갱신 | 6시간 |

---

## 구현 환경

```text
HTML5
CSS3
Vanilla JavaScript
GitHub REST API
GitHub Actions
GitHub Pages
```

React, Vue, jQuery, Bootstrap, Tailwind CSS 등의
프레임워크와 UI 라이브러리는 사용하지 않았습니다.

---

## Repository

```text
https://github.com/minsukim9/mariner-codyssey-week-1
```

---

## Author

김민수

Backend Developer