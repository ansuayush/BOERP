// Expand navbar on page load if screen width is 1360px
window.addEventListener('load', () => {
    const navbar = document.getElementById('navbar');
    const bodypadding = document.getElementById('body-pd');

    if (window.innerWidth === 1360) {
        navbar.classList.add('expander');
        bodypadding.classList.add('body-pd');
    }
});

// Toggle logic for multiple toggle buttons
document.querySelectorAll('.nav-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const navbar = document.getElementById('navbar');
        const bodypadding = document.getElementById('body-pd');

        navbar.classList.toggle('expander');
        bodypadding.classList.toggle('body-pd');
    });
});

// Collapse menu logic
document.querySelectorAll('.collapse__link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const collapseMenu = this.nextElementSibling;
        const rotateIcon = this.querySelector('.fa-chevron-down');
        const navbar = document.getElementById('navbar');
        const bodyPadding = document.getElementById('body-pd');

        if (collapseMenu) {
            collapseMenu.classList.toggle('showCollapse');
        }

        if (rotateIcon) {
            rotateIcon.classList.toggle('rotate');
        }

        const parentMenu = this.closest('ul');
        if (parentMenu) {
            parentMenu.querySelectorAll('.collapse__menu').forEach(menu => {
                if (menu !== collapseMenu && menu.classList.contains('showCollapse')) {
                    menu.classList.remove('showCollapse');
                    const openIcon = menu.previousElementSibling?.querySelector('.fa-chevron-down');
                    if (openIcon) {
                        openIcon.classList.remove('rotate');
                    }
                }
            });
        }

        if (navbar) {
            navbar.classList.add('expander');
        }

        if (bodyPadding) {
            bodyPadding.classList.remove('body-pd');
        }
    });
});


// Close navbar when clicking an element with class 'nav-remove'
// Collapse navbar when clicking an element with class 'nav-remove'
document.querySelectorAll('.nav-remove').forEach(button => {
    button.addEventListener('click', () => {
        const navbar = document.getElementById('navbar');
        const body = document.getElementById('body-pd');
        const backdrop = document.getElementById('mobile-backdrop');

        // Collapse navbar
        if (navbar) {
            navbar.classList.remove('expander');
        }

        // Add body padding
        if (body) {
            body.classList.add('body-pd');
        }

        // Hide backdrop
        if (backdrop) {
            backdrop.classList.remove('fade', 'show');
            backdrop.classList.add('hide');
        }
    });
});
// When mobile-toggle is clicked
document.querySelectorAll('.mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const navbar = document.getElementById('navbar');
        const body = document.getElementById('body-pd');
        const backdrop = document.getElementById('mobile-backdrop');

        if (navbar) {
            navbar.classList.add('expander'); // Expand navbar
        }

        if (body) {
            body.classList.remove('body-pd'); // Remove body padding
        }

        if (backdrop) {
            backdrop.classList.remove('hide');
            backdrop.classList.add('fade', 'show');
        }
    });
});

// When backdrop is clicked
const backdrop = document.getElementById('mobile-backdrop');
if (backdrop) {
    backdrop.addEventListener('click', () => {
        const navbar = document.getElementById('navbar');
        const body = document.getElementById('body-pd');

        if (navbar) {
            navbar.classList.remove('expander'); // Collapse navbar
        }

        if (body) {
            body.classList.add('body-pd'); // Add back body padding
        }

        backdrop.classList.remove('fade', 'show');
        backdrop.classList.add('hide');
    });
}