// Sinetrac site — shared interactions
document.addEventListener('DOMContentLoaded', function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
  // Light-only site: theme switching intentionally removed.

  // Mobile navigation
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }
/* ============================================================
   APPROVAL DOCUMENT VIEWER
   ============================================================ */

(function () {

  "use strict";

  const lightbox =
    document.getElementById("approval-lightbox");

  const backdrop =
    document.querySelector(".approval-lightbox-backdrop");

  const stage =
    document.getElementById("approval-lightbox-stage");

  const canvas =
    document.getElementById("approval-document-canvas");

  const image =
    document.getElementById("approval-lightbox-image");

  const title =
    document.getElementById("approval-lightbox-title");

  const zoomValue =
    document.getElementById("approval-zoom-value");

  const zoomIn =
    document.getElementById("approval-zoom-in");

  const zoomOut =
    document.getElementById("approval-zoom-out");

  const zoomReset =
    document.getElementById("approval-zoom-reset");

  const closeButton =
    document.getElementById("approval-lightbox-close");


  if (!lightbox || !stage || !canvas || !image) {
    return;
  }


  /* ----------------------------------------------------------
     STATE
     ---------------------------------------------------------- */

  let scale = 1;

  let translateX = 0;

  let translateY = 0;

  let isDragging = false;

  let dragStartX = 0;

  let dragStartY = 0;

  let startTranslateX = 0;

  let startTranslateY = 0;


  const MIN_ZOOM = 0.5;

  const MAX_ZOOM = 4;

  const ZOOM_STEP = 0.25;


  /* ----------------------------------------------------------
     UPDATE
     ---------------------------------------------------------- */

  function updateTransform() {

    canvas.style.transform =
      "translate(-50%, -50%) " +
      "translate(" +
      translateX +
      "px, " +
      translateY +
      "px) " +
      "scale(" +
      scale +
      ")";

    zoomValue.textContent =
      Math.round(scale * 100) + "%";
  }


  /* ----------------------------------------------------------
     RESET
     ---------------------------------------------------------- */
function resetViewer() {

  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;

  if (!imageWidth || !imageHeight) {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    return;
  }

  const padding = 40;

  const availableWidth = stageWidth - padding;
  const availableHeight = stageHeight - padding;

  const fitScale = Math.min(
    availableWidth / imageWidth,
    availableHeight / imageHeight,
    1
  );

  scale = Math.max(
    0.1,
    fitScale
  );

  translateX = 0;
  translateY = 0;

  updateTransform();
}


  /* ----------------------------------------------------------
     ZOOM
     ---------------------------------------------------------- */

  function setZoom(value) {

    scale = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, value)
    );

    updateTransform();
  }


  /* ----------------------------------------------------------
     OPEN
     ---------------------------------------------------------- */
function openDocument(button) {

  const documentPath =
    button.getAttribute("data-document");

  const documentTitle =
    button.getAttribute("data-document-title") ||
    "Approval Document";

  if (!documentPath) {
    console.warn("No document specified.");
    return;
  }

  image.src = documentPath;
  image.alt = documentTitle;

  title.textContent = documentTitle;

  lightbox.classList.add("is-open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "approval-viewer-open"
  );

  image.onload = function () {
    resetViewer();
  };

  setTimeout(function () {
    if (closeButton) {
      closeButton.focus();
    }
  }, 50);
}
  


  /* ----------------------------------------------------------
     CLOSE
     ---------------------------------------------------------- */

  function closeDocument() {

    lightbox.classList.remove(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "approval-viewer-open"
    );


    setTimeout(function () {

      if (
        !lightbox.classList.contains("is-open")
      ) {

        image.removeAttribute("src");

      }

    }, 150);

  }


  /* ----------------------------------------------------------
     OPEN DOCUMENT BUTTONS
     ---------------------------------------------------------- */

  document
    .querySelectorAll(".approval-document")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          openDocument(button);

        }
      );

    });


  /* ----------------------------------------------------------
     CLOSE
     ---------------------------------------------------------- */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeDocument
    );

  }


  if (backdrop) {

    backdrop.addEventListener(
      "click",
      closeDocument
    );

  }


  /* ----------------------------------------------------------
     ZOOM BUTTONS
     ---------------------------------------------------------- */

  if (zoomIn) {

    zoomIn.addEventListener(
      "click",
      function () {

        setZoom(
          scale + ZOOM_STEP
        );

      }
    );

  }


  if (zoomOut) {

    zoomOut.addEventListener(
      "click",
      function () {

        setZoom(
          scale - ZOOM_STEP
        );

      }
    );

  }


  if (zoomReset) {

    zoomReset.addEventListener(
      "click",
      resetViewer
    );

  }


  /* ----------------------------------------------------------
     MOUSE WHEEL
     ---------------------------------------------------------- */

  stage.addEventListener(
    "wheel",
    function (event) {

      event.preventDefault();

      if (event.deltaY < 0) {

        setZoom(
          scale + ZOOM_STEP
        );

      } else {

        setZoom(
          scale - ZOOM_STEP
        );

      }

    },
    {
      passive: false
    }
  );


/* ----------------------------------------------------------
   DOCUMENT PAN / DRAG
   ---------------------------------------------------------- */

stage.addEventListener("pointerdown", function (event) {

  if (scale <= 1) return;

  isDragging = true;

  stage.classList.add("is-dragging");

  dragStartX = event.clientX;
  dragStartY = event.clientY;

  startTranslateX = translateX;
  startTranslateY = translateY;

  stage.setPointerCapture(event.pointerId);

  event.preventDefault();
});


stage.addEventListener("pointermove", function (event) {

  if (!isDragging) return;

  translateX =
    startTranslateX +
    (event.clientX - dragStartX);

  translateY =
    startTranslateY +
    (event.clientY - dragStartY);

  updateTransform();

  event.preventDefault();
});


stage.addEventListener("pointerup", function (event) {

  isDragging = false;

  stage.classList.remove("is-dragging");

  if (stage.hasPointerCapture(event.pointerId)) {
    stage.releasePointerCapture(event.pointerId);
  }
});


stage.addEventListener("pointercancel", function (event) {

  isDragging = false;

  stage.classList.remove("is-dragging");

  if (stage.hasPointerCapture(event.pointerId)) {
    stage.releasePointerCapture(event.pointerId);
  }
});

  /* ----------------------------------------------------------
     KEYBOARD
     ---------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        !lightbox.classList.contains("is-open")
      ) {
        return;
      }


      if (event.key === "Escape") {

        closeDocument();

      }


      if (
        event.key === "+" ||
        event.key === "="
      ) {

        setZoom(
          scale + ZOOM_STEP
        );

      }


      if (event.key === "-") {

        setZoom(
          scale - ZOOM_STEP
        );

      }


      if (event.key === "0") {

        resetViewer();

      }

    }
  );


  /* ----------------------------------------------------------
     APPROVAL TABS
     ---------------------------------------------------------- */

  document
    .querySelectorAll(
      "#page-approvals .approvals-tabs .tab-btn"
    )
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const targetId =
            button.getAttribute(
              "data-tab"
            );


          document
            .querySelectorAll(
              "#page-approvals .approvals-tabs .tab-btn"
            )
            .forEach(function (tab) {

              tab.classList.remove(
                "active"
              );

              tab.setAttribute(
                "aria-selected",
                "false"
              );

            });


          document
            .querySelectorAll(
              "#page-approvals .tab-panel"
            )
            .forEach(function (panel) {

              panel.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );

          button.setAttribute(
            "aria-selected",
            "true"
          );


          const target =
            document.getElementById(
              targetId
            );


          if (target) {

            target.classList.add(
              "active"
            );

          }

        }
      );

    });


})();

  // Tabs (Approvals & Registrations)
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.tabs').parentElement;
      group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      group.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Forms submit directly to the configured email service.

  // ---- Modern scroll-reveal (fade + rise into view) ----
  var revealTargets = document.querySelectorAll(
    '.card, .section-head, .badge, .tl-item, .credbar .stat, .marquee-item, .dl-row'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ---- Lazy-load pattern for any future <img data-src="..."> ----
  // When real photography is added, use: <img data-src="images/xyz.jpg" class="lazy-img" alt="...">
  // (or simply add loading="lazy" decoding="async" to a normal <img src="..."> — both are supported.)
  var lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    var imgIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.addEventListener('load', function () { img.classList.add('loaded'); });
          imgIO.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });
    lazyImgs.forEach(function (img) { imgIO.observe(img); });
  }
});


// ---- Single-file SPA navigation (no separate page files -> no "file not found") ----
(function () {
  function showPage(key, scrollToId) {
    document.querySelectorAll('.page').forEach(function (el) {
      el.style.display = (el.getAttribute('data-page') === key) ? 'block' : 'none';
    });
    document.querySelectorAll('[data-page-link]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-page-link') === key);
    });
    document.querySelectorAll('.nav-row > li').forEach(function (li) {
      li.classList.toggle('active', li.getAttribute('data-page-link') === key);
    });
    var nav = document.querySelector('.site-nav');
    if (nav) nav.classList.remove('open');
    if (scrollToId) {
      var target = document.getElementById(scrollToId);
      if (target) { setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30); return; }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function route() {
    var hash = window.location.hash.replace('#', '') || 'home';
    var validKeys = ['home','products','catalogues','approvals','gallery','contact'];
    var key = validKeys.indexOf(hash) !== -1 ? hash : 'home';
    showPage(key);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-page-link]');
    if (!a) return;
    e.preventDefault();
    var key = a.getAttribute('data-page-link');
    var scrollto = a.getAttribute('data-scrollto');
    if (window.location.hash.replace('#','') === key) {
      showPage(key, scrollto);
    } else {
      window.location.hash = key;
      if (scrollto) setTimeout(function () { showPage(key, scrollto); }, 10);
    }
  });

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
})();
