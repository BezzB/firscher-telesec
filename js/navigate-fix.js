/**
 * Navigation fix for local file system browsing
 * Prevents directory listings and handles home navigation properly
 */

// If this is a directory listing, redirect to index.html
(function() {
    if (document.title.includes('Index of') || 
        document.querySelector('h1')?.innerText?.includes('Index of')) {
        
        // Get the current URL and remove trailing slash if present
        const currentUrl = window.location.href.replace(/\/$/, '');
        
        // Redirect to index.html in the current directory
        window.location.href = currentUrl + '/index.html';
    }
})();

// Fix all home links to use JavaScript navigation instead of standard links
document.addEventListener('DOMContentLoaded', function() {
    // Find all links pointing to home or index pages
    const homeLinks = document.querySelectorAll('a[href="index.html"], a[href="./index.html"], a[href="/index.html"], a[href="home.html"], a[href="/"], a[href="./"], a[href="../index.html"], a[href="../"], a[href="navigate.html?target=index.html"], a[href="navigate.html?target=inedx.html"]');
    
    // Replace their href with JavaScript navigation
    homeLinks.forEach(link => {
        // Check if the link is in a subpage (pages directory)
        const isRoot = link.getAttribute('href').startsWith('../') || window.location.href.includes('/pages/');
        const homePath = isRoot ? '../index.html' : 'index.html';
        
        // Set the direct href instead of using JavaScript navigation
        link.setAttribute('href', homePath);
    });
}); 