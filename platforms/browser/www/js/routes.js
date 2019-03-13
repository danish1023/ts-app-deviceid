var routes = [
  // Home
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // Register
  {
    path: '/register/',
    componentUrl: './pages/register.html',
    name: 'register',
  },
  // Default route (404 page)
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
