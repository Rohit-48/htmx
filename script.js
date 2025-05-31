document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("dark-mode-toggle");
  const navLinks = document.querySelectorAll("nav a.nav-link");

  // Dark mode setup
  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Load dark mode preference
  const prefersDark = localStorage.getItem("darkMode") === "true";
  applyDarkMode(prefersDark);

  toggle.addEventListener("click", () => {
    const isDarkMode = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDarkMode);
  });

  // Active navigation link handling
  const setActiveLink = (targetLink) => {
    navLinks.forEach((link) => link.classList.remove("active-link"));
    if (targetLink) {
      targetLink.classList.add("active-link");
    }
  };

  // Set active link on initial load based on current page (if applicable)
  // This part might need adjustment based on how initial content is loaded.
  // For now, we assume no specific link is active on direct load of index.html before HTMX kicks in.

  document.body.addEventListener("htmx:afterSwap", function (event) {
    // event.detail.elt is the link that was clicked for hx-get
    // For hx-target into #content, the targetLink is event.detail.requestConfig.elt
    const clickedLink = event.detail.requestConfig.elt;
    setActiveLink(clickedLink);
  });

  // Also handle direct clicks on nav links if they don't trigger htmx swaps (though they should)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // This is a fallback/enhancement. HTMX should ideally handle the active state via htmx:afterSwap
      // However, if a link is somehow clicked without an HTMX swap, this ensures reactivity.
      // Note: If all links are HTMX-driven, this might be redundant or could be simplified.
      // We rely on htmx:afterSwap as the primary mechanism.
      // If the click directly leads to a page load (non-HTMX), this won't persist state across pages.
    });
  });

  // HTMX Loading Indicator and Error Handling
  const loadingIndicator = document.getElementById('htmx-loading-indicator');
  const errorContainer = document.getElementById('htmx-error-container');
  const errorMessageElement = document.getElementById('htmx-error-message');

  if (loadingIndicator) {
      document.body.addEventListener('htmx:beforeRequest', function(evt) {
          loadingIndicator.style.display = 'flex';
      });

      document.body.addEventListener('htmx:afterRequest', function(evt) {
          loadingIndicator.style.display = 'none';
      });
  }

  if (errorContainer && errorMessageElement) {
      document.body.addEventListener('htmx:responseError', function(evt) {
          console.error("HTMX request error:", evt.detail);
          let message = 'Oops! Something went wrong while loading content.';
          if (evt.detail.xhr) {
              message += \` (Status: ${evt.detail.xhr.status})\`;
          }
          // You could add more details from evt.detail.error or evt.detail.xhr.responseText here,
          // but be cautious about exposing sensitive information or overly complex messages.

          errorMessageElement.textContent = message;
          errorContainer.style.display = 'block';

          // Optional: Auto-hide after some time
          // setTimeout(() => {
          //     errorContainer.style.display = 'none';
          // }, 7000); // 7 seconds
      });

      // The dismiss button for the error message is handled by an inline onclick in the HTML:
      // onclick="document.getElementById('htmx-error-container').style.display='none'"
  }
});
