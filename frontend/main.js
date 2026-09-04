const BACKEND_URL = 'https://finance-dashboard-api-yoye.onrender.com';

async function checkBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    const welcomeMsg = document.getElementById("welcome-msg");

    if (welcomeMsg) {
      welcomeMsg.textContent = `Backend says: ${data.message}`;
    }

  } catch (err) {
    const welcomeMsg = document.getElementById("welcome-msg");

    if (welcomeMsg) {
      welcomeMsg.textContent = "Backend not reachable";
    }

    console.error("Backend error:", err);
  }
}

checkBackend();
// ==========================================
// SWIPE PAGE NAVIGATION
// ==========================================

(function () {

    let touchStartX = 0;
    let touchStartY = 0;

    const pages = [
        "index.html",
        "pages/stock-analyzer.html",
        "pages/market-intelligence.html",
        "pages/company-comparison.html",
        "pages/portfolio-manager.html",
        "pages/risk-analyzer.html",
        "pages/financial-goals.html",
        "pages/financial-calculators.html",
        "pages/investment-simulator.html",
        "pages/news-sentiment.html",
        "pages/ai-assistant.html",
        "pages/learning-hub.html"
    ];

    // Get current page
    const currentPath = window.location.pathname;

    let currentPage = pages.findIndex(page => {
        return currentPath.endsWith(page);
    });

    // If page wasn't found, don't enable navigation
    if (currentPage === -1) {
        return;
    }

    // ------------------------------------------
    // TOUCH START
    // ------------------------------------------

    document.addEventListener("touchstart", function (event) {

        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

    }, { passive: true });


    // ------------------------------------------
    // TOUCH END
    // ------------------------------------------

    document.addEventListener("touchend", function (event) {

        const touch = event.changedTouches[0];

        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const differenceX = touchEndX - touchStartX;
        const differenceY = touchEndY - touchStartY;

        // Minimum swipe distance
        const minimumSwipe = 80;

        // Ignore normal vertical scrolling
        if (Math.abs(differenceY) > Math.abs(differenceX)) {
            return;
        }

        // Ignore very small movements
        if (Math.abs(differenceX) < minimumSwipe) {
            return;
        }


        // ------------------------------------------
        // SWIPE LEFT → NEXT PAGE
        // ------------------------------------------

        if (differenceX < 0) {

            if (currentPage < pages.length - 1) {

                currentPage++;

                window.location.href = getPagePath(
                    pages[currentPage]
                );

            }

        }


        // ------------------------------------------
        // SWIPE RIGHT → PREVIOUS PAGE
        // ------------------------------------------

        else {

            if (currentPage > 0) {

                currentPage--;

                window.location.href = getPagePath(
                    pages[currentPage]
                );

            }

        }

    }, { passive: true });


    // ------------------------------------------
    // CREATE CORRECT PATH
    // ------------------------------------------

    function getPagePath(page) {

        // We are currently inside /pages/
        if (currentPath.includes("/pages/")) {

            if (page.startsWith("pages/")) {

                return "../" + page;
            }

            return "../" + page;
        }

        // We are on dashboard/index.html
        return page;
    }

})();
// ==========================================
// SWIPE + MOUSE DRAG PAGE NAVIGATION
// ==========================================

(function () {

    let startX = 0;
    let startY = 0;

    let isDragging = false;

    const minimumSwipe = 100;

    const pages = [
        "index.html",
        "pages/stock-analyzer.html",
        "pages/market-intelligence.html",
        "pages/company-comparison.html",
        "pages/portfolio-manager.html",
        "pages/risk-analyzer.html",
        "pages/financial-goals.html",
        "pages/financial-calculators.html",
        "pages/investment-simulator.html",
        "pages/news-sentiment.html",
        "pages/ai-assistant.html",
        "pages/learning-hub.html"
    ];


    // ==========================================
    // FIND CURRENT PAGE
    // ==========================================

    const currentPath = window.location.pathname;

    let currentPage = pages.findIndex(function (page) {

        return currentPath.endsWith(page);

    });


    if (currentPage === -1) {
        return;
    }


    // ==========================================
    // GO TO PAGE
    // ==========================================

    function navigate(direction) {

        let newPage = currentPage + direction;

        if (newPage < 0 || newPage >= pages.length) {
            return;
        }

        window.location.href = getPagePath(
            pages[newPage]
        );

    }


    // ==========================================
    // CREATE CORRECT PAGE PATH
    // ==========================================

    function getPagePath(page) {

        if (currentPath.includes("/pages/")) {

            return "../" + page;

        }

        return page;

    }


    // ==========================================
    // TOUCH START
    // ==========================================

    document.addEventListener(
        "touchstart",
        function (event) {

            const touch = event.touches[0];

            startX = touch.clientX;
            startY = touch.clientY;

        },
        { passive: true }
    );


    // ==========================================
    // TOUCH END
    // ==========================================

    document.addEventListener(
        "touchend",
        function (event) {

            const touch = event.changedTouches[0];

            const endX = touch.clientX;
            const endY = touch.clientY;

            handleSwipe(
                endX - startX,
                endY - startY
            );

        },
        { passive: true }
    );


    // ==========================================
    // MOUSE DOWN
    // ==========================================

    document.addEventListener(
        "mousedown",
        function (event) {

            // Only left mouse button
            if (event.button !== 0) {
                return;
            }

            isDragging = true;

            startX = event.clientX;
            startY = event.clientY;

        }
    );


    // ==========================================
    // MOUSE UP
    // ==========================================

    document.addEventListener(
        "mouseup",
        function (event) {

            if (!isDragging) {
                return;
            }

            isDragging = false;

            const endX = event.clientX;
            const endY = event.clientY;

            handleSwipe(
                endX - startX,
                endY - startY
            );

        }
    );


    // ==========================================
    // CANCEL DRAG
    // ==========================================

    document.addEventListener(
        "mouseleave",
        function () {

            isDragging = false;

        }
    );


    // ==========================================
    // SWIPE / DRAG DETECTION
    // ==========================================

    function handleSwipe(distanceX, distanceY) {

        // Ignore vertical movement.
        // This prevents normal scrolling from
        // changing the page.

        if (Math.abs(distanceY) > Math.abs(distanceX)) {
            return;
        }


        // Ignore small movements.

        if (Math.abs(distanceX) < minimumSwipe) {
            return;
        }


        // ======================================
        // DRAG / SWIPE LEFT
        // ======================================

        if (distanceX < 0) {

            navigate(1);

        }


        // ======================================
        // DRAG / SWIPE RIGHT
        // ======================================

        else {

            navigate(-1);

        }

    }

})();