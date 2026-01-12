/*===== EXPANDER MENU  =====*/  
const showMenu = (toggleId, navbarId, bodyId) => {
  const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId);

  // // Function to expand the navbar if the screen width is 1360px
  // const expandNavbarOnLoad = () => {
  //   if (window.innerWidth === 1360) {
  //     navbar.classList.add('expander'); // Ensure the navbar is expanded
  //     bodypadding.classList.add('body-pd');
  //   }
  // };

  // Call the expand function on page load
  window.addEventListener('load', expandNavbarOnLoad);

  // Toggle the expander class when the toggle button is clicked
  if (toggle && navbar) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('expander');
      bodypadding.classList.toggle('body-pd');
    });
  }

//   // Close navbar when clicking outside of it (only for 1360px width)
//   document.addEventListener('click', function (event) {
//     if (window.innerWidth === 1360) {
//       if (!navbar.contains(event.target) && !toggle.contains(event.target)) {
//         // If clicked outside the navbar and toggle, close the navbar
//         // if (navbar.classList.contains('expander')) {
//         //   navbar.classList.remove('expander');
//         //   bodypadding.classList.remove('body-pd');
//         // }
//       }
//     }
//   });
// };

showMenu('nav-toggle', 'navbar', 'body-pd');

/*===== LINK ACTIVE  =====*/ 
const linkColor = document.querySelectorAll('.nav__link');
function colorLink() {
  linkColor.forEach(l => l.classList.remove('active'));
  this.classList.add('active');
}
linkColor.forEach(l => l.addEventListener('click', colorLink));

/*===== COLLAPSE MENU WITH AUTO-EXPAND FUNCTIONALITY =====*/
document.querySelectorAll('.collapse__link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();  // Prevent the default behavior of the link
    
    const collapseMenu = this.nextElementSibling;
    const rotateIcon = this.querySelector('.fa-chevron-down');

    // Toggle the clicked collapse menu
    if (collapseMenu) {
      collapseMenu.classList.toggle('showCollapse');
    }

    // Toggle the rotate icon for the clicked menu
    if (rotateIcon) {
      rotateIcon.classList.toggle('rotate');
    }

    // Ensure other open menus within the same level are closed
    const parentMenu = this.closest('ul');
    if (parentMenu) {
      parentMenu.querySelectorAll('.collapse__menu').forEach(menu => {
        if (menu !== collapseMenu && menu.classList.contains('showCollapse')) {
          menu.classList.remove('showCollapse');
          const openIcon = menu.previousElementSibling.querySelector('.fa-chevron-down');
          if (openIcon) {
            openIcon.classList.remove('rotate');
          }
        }
      });
    }
  });
});
