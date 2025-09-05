
// vercel-analytics.js
// Simulated Vercel Analytics integration for static site

(function() {
    function sendPageView() {
        fetch("https://ease-mind-theta.vercel.app/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: window.location.href,
                timestamp: new Date().toISOString()
            })
        }).then(response => {
            console.log("Page view tracked", response.status);
        }).catch(error => {
            console.error("Analytics error:", error);
        });
    }

    window.addEventListener("load", sendPageView);
})();
