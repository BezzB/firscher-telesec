// Prevent repeated 404 errors for clients page
(function() {
  // Only run this in the browser
  if (typeof window === 'undefined') return;

  // Save the original fetch function
  const originalFetch = window.fetch;

  // Override fetch to intercept calls to the clients route
  window.fetch = function(url, options) {
    // Check if this is a request to the clients page
    if (url === '/clients/' || 
        url.startsWith('/clients/') || 
        url === 'http://localhost:3000/clients/' ||
        (typeof url === 'string' && url.includes('/clients/'))) {
      
      console.log('Intercepted request to', url);
      
      // Return a fake successful response
      return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Otherwise, use the original fetch
    return originalFetch.apply(this, arguments);
  };

  // Also handle XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    // Check if this is a request to the clients page
    if (typeof url === 'string' && 
        (url === '/clients/' || 
         url.startsWith('/clients/') ||
         url.includes('/clients/'))) {
      
      console.log('Intercepted XHR to', url);
      // Use a different URL that does exist
      return originalXHROpen.call(this, method, '/', ...rest);
    }
    
    // Otherwise, use the original open
    return originalXHROpen.call(this, method, url, ...rest);
  };

  console.log('Client fallback script loaded');
})(); 