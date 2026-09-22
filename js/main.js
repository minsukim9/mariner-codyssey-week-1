const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === 'dark') {
        document.documentElement.dataset.theme = 'light';
    } else {
        document.documentElement.dataset.theme = 'dark';
    }
});