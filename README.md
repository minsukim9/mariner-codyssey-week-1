# MINSU Portfolio

Vanilla HTML, CSS, JavaScript로 구현한 반응형 개인 포트폴리오 웹사이트입니다.

프레임워크나 UI 라이브러리를 사용하지 않고
시맨틱 HTML, 반응형 CSS, DOM API, Web API를 활용해 구현했습니다.

GitHub REST API를 통해 Repository 데이터를 불러오고,
다크 모드, 반응형 네비게이션, 스크롤 인터랙션,
Contact 폼 유효성 검사 등의 기능을 제공합니다.

---

## 프로젝트 소개

개인 소개와 기술 스택, GitHub 프로젝트, 연락처 정보를
하나의 페이지에서 확인할 수 있는 포트폴리오 웹사이트입니다.

단순히 정적인 페이지를 구성하는 데 그치지 않고
사용자의 이벤트에 따라 상태가 변경되고,
변경된 상태를 기반으로 화면이 다시 렌더링되도록 구현했습니다.

주요 상태 변경 흐름은 다음과 같습니다.

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
- 접근성 속성
  - `aria-label`
  - `aria-expanded`
  - `aria-invalid`
  - `aria-describedby`
  - `aria-live`

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

### External API

- GitHub REST API

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
`aria-expanded`와 `aria-label`도 현재 메뉴 상태에 맞게 변경합니다.

---

### 2. Smooth Scroll

네비게이션 메뉴를 클릭하면
해당 Section으로 부드럽게 이동합니다.

```javascript
targetSection.scrollIntoView({
    behavior: 'smooth'
});
```

Sticky Header와 콘텐츠가 겹치지 않도록
각 Section에는 `scroll-margin-top`을 적용했습니다.

---

### 3. Header Scroll Effect

페이지를 일정 거리 이상 스크롤하면
Header의 배경과 그림자 스타일이 변경됩니다.

기준값:

```text
60px
```

동작 흐름:

```text
scroll
→ scrollY 확인
→ scrolled 클래스 변경
→ Header 스타일 변경
```

---

### 4. Dark Mode

다크 모드와 라이트 모드를 전환할 수 있습니다.

CSS 변수와 `data-theme` 속성을 이용해
JavaScript에서 개별 스타일을 직접 변경하지 않도록 구성했습니다.

```html
<html data-theme="dark">
```

사용자가 선택한 테마는 `localStorage`에 저장됩니다.

```text
theme = dark
```

따라서 새로고침 후에도 이전 설정이 유지됩니다.

초기 테마 결정 우선순위는 다음과 같습니다.

```text
1. localStorage 사용자 설정
2. prefers-color-scheme 시스템 설정
3. Light Theme
```

---

### 5. About 반응형 레이아웃

About 영역은 Flexbox를 사용했습니다.

모바일에서는:

```text
Profile
   ↓
Description
```

태블릿 이상에서는:

```text
Profile | Description
```

형태로 표시됩니다.

이미지는 `aspect-ratio`와 `object-fit`을 사용해
일정한 비율을 유지하도록 구성했습니다.

---

### 6. Skills Grid

Skills 영역은 CSS Grid를 사용했습니다.

```css
grid-template-columns:
    repeat(
        auto-fit,
        minmax(140px, 1fr)
    );
```

화면 크기에 따라 열의 개수가 자동으로 조정됩니다.

---

### 7. Projects Grid

프로젝트 카드 역시 CSS Grid를 사용했습니다.

```css
grid-template-columns:
    repeat(
        auto-fit,
        minmax(260px, 1fr)
    );
```

카드 내부에서는 Flexbox를 사용해
설명의 길이가 달라도 Repository 정보가 카드 하단에 배치되도록 구성했습니다.

---

### 8. GitHub API 연동

GitHub REST API를 이용해 Repository 데이터를 가져옵니다.

API:

```text
https://api.github.com/users/minsukim9/repos
```

사용하는 Repository 데이터:

```text
name
description
language
stargazers_count
html_url
```

API 요청은 `fetch()`와 `async/await`를 사용했습니다.

```javascript
const response =
    await fetch(GITHUB_API_URL);

const projects =
    await response.json();
```

---

### 9. Projects 상태 관리

API 요청 상태를 별도로 관리합니다.

```text
idle
loading
success
error
empty
```

동작 흐름:

```text
API 요청
    ↓
상태 변경
    ↓
renderProjects()
    ↓
DOM 업데이트
```

상태별 UI:

| 상태 | 화면 |
| --- | --- |
| loading | Loading Spinner |
| success | Repository Card |
| error | Error Message + Retry |
| empty | Empty Message |

GitHub API가 `403`을 반환하는 경우
Rate Limit 오류 메시지를 별도로 표시합니다.

---

### 10. Scroll Top

페이지를 일정 거리 이상 스크롤하면
오른쪽 아래에 Scroll Top 버튼이 표시됩니다.

표시 기준:

```text
300px
```

버튼을 클릭하면 페이지 최상단으로 이동합니다.

```javascript
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
```

---

### 11. Scroll Reveal Animation

각 Section이 화면에 들어올 때
Intersection Observer를 이용해 애니메이션을 실행합니다.

Observer 기준:

```javascript
{
    threshold: 0.2
}
```

즉 Section의 약 20%가 화면에 진입하면
`revealed` 클래스가 추가됩니다.

```text
Section 진입
→ IntersectionObserver
→ revealed 클래스 추가
→ CSS Transition
```

한 번 나타난 Section은 `unobserve()`를 호출해
추가 관찰을 종료합니다.

---

### 12. Reduced Motion

운영체제에서 애니메이션 감소 설정을 사용하는 사용자를 위해
`prefers-reduced-motion`도 지원합니다.

```css
@media (prefers-reduced-motion: reduce) {
    ...
}
```

해당 환경에서는 스크롤 애니메이션과 일부 Transition을 최소화합니다.

---

### 13. Contact Form Validation

Contact 폼에는 다음 입력 필드가 있습니다.

```text
이름
이메일
메시지
```

JavaScript에서 직접 유효성 검사를 수행합니다.

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

입력 중에는 `input` 이벤트를 이용해
실시간으로 유효성 검사를 수행합니다.

폼 제출 시에는:

```javascript
event.preventDefault();
```

를 사용해 브라우저의 기본 제출 동작을 방지합니다.

---

## JavaScript 이벤트

프로젝트에서 사용하는 주요 이벤트는 다음과 같습니다.

| 이벤트 | 사용 위치 |
| --- | --- |
| `click` | 햄버거 메뉴, 다크 모드, Scroll Top, Retry |
| `scroll` | Header, Scroll Top |
| `input` | Contact 실시간 유효성 검사 |
| `submit` | Contact 제출 처리 |
| `change` | 시스템 Theme 변경 감지 |

모든 이벤트는 inline event가 아닌
`addEventListener()`를 사용합니다.

---

## ES6+ 문법

프로젝트에서 다음 ES6+ 문법을 사용했습니다.

### Arrow Function

```javascript
const applyTheme = (theme) => {
    ...
};
```

### Template Literal

```javascript
const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
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

### Array Methods

```text
map()
forEach()
some()
find()
```

---

## 반응형 디자인

Mobile First 방식으로 구현했습니다.

기본 스타일은 모바일을 기준으로 작성하고,
화면이 넓어질수록 Media Query를 이용해 레이아웃을 확장합니다.

Breakpoints:

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

레이아웃의 목적에 따라 Flexbox와 Grid를 구분해 사용했습니다.

### Flexbox

한 방향으로 요소를 배치할 때 사용했습니다.

사용 위치:

```text
Navigation
Hero Actions
About
Project Card 내부
Contact Form
```

### Grid

여러 요소를 행과 열로 배치할 때 사용했습니다.

사용 위치:

```text
Skills
Projects
```

---

## 프로젝트 구조

```text
mariner-codyssey-week-1/
│
├── index.html
│
├── README.md
│
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

---

## 실행 방법

별도의 패키지 설치 과정은 필요하지 않습니다.

Repository를 Clone합니다.

```bash
git clone https://github.com/minsukim9/mariner-codyssey-week-1.git
```

프로젝트 디렉터리로 이동합니다.

```bash
cd mariner-codyssey-week-1
```

`index.html`을 브라우저에서 실행하면 됩니다.

VS Code의 Live Server 등을 사용해 실행할 수도 있습니다.

---

## 배포

GitHub Pages를 이용해 배포할 예정입니다.

배포 설정:

```text
Repository
→ Settings
→ Pages
→ Deploy from a branch
→ main
→ / (root)
```

예상 배포 주소:

```text
https://minsukim9.github.io/mariner-codyssey-week-1/
```

배포 완료 후 실제 접속 여부를 확인합니다.

---

## 배포 전 체크리스트

- [ ] 모바일 네비게이션 정상 동작
- [ ] 데스크톱 네비게이션 정상 표시
- [ ] Navigation Smooth Scroll 확인
- [ ] Header 60px 스크롤 스타일 변경 확인
- [ ] Dark Mode 정상 동작
- [ ] Dark Mode 새로고침 후 상태 유지 확인
- [ ] Skills 반응형 Grid 확인
- [ ] Projects 반응형 Grid 확인
- [ ] GitHub API 데이터 정상 조회
- [ ] GitHub API Error UI 확인
- [ ] GitHub API Empty UI 확인
- [ ] GitHub API Retry 동작 확인
- [ ] Scroll Top 300px 기준 확인
- [ ] Scroll Top 클릭 동작 확인
- [ ] Intersection Observer 애니메이션 확인
- [ ] Intersection Observer threshold 0.2 확인
- [ ] Contact 필수값 검증 확인
- [ ] Contact 이메일 형식 검증 확인
- [ ] Contact 성공 메시지 확인
- [ ] 768px 반응형 확인
- [ ] 1024px 반응형 확인
- [ ] Light Theme 확인
- [ ] Dark Theme 확인
- [ ] 브라우저 Console Error 확인

---

## 주요 구현 기준

| 항목 | 설정 |
| --- | --- |
| Header 변경 기준 | 60px |
| Scroll Top 표시 기준 | 300px |
| Intersection Observer | threshold 0.2 |
| Tablet Breakpoint | 768px |
| Desktop Breakpoint | 1024px |
| Project 최소 카드 크기 | 260px |
| Skill 최소 카드 크기 | 140px |

---

## 구현 환경

```text
HTML5
CSS3
Vanilla JavaScript
GitHub REST API
GitHub Pages
```

React, Vue, jQuery, Bootstrap, Tailwind CSS 등의
프레임워크와 라이브러리는 사용하지 않았습니다.

---

## Repository

GitHub:

```text
https://github.com/minsukim9/mariner-codyssey-week-1
```

---

## Author

김민수

Backend Developer