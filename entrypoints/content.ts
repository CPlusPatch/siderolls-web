export default defineContentScript({
    matches: ["*://*.google.com/*"],
    main() {
        console.info("Hello content.");
    },
});
