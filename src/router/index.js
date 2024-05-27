import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'

// Function to check if the user is authenticated
// This is a placeholder; you'll need to replace it with your actual authentication logic
function isAuthenticated() {
  // Example: return true if the user is logged in; false otherwise
  // You could check Vuex store, localStorage, cookies, etc.
  return localStorage.getItem('user-token') !== null
}

const routes = [
  {
    meta: {
      title: 'Login'
    },
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/HomeView.vue')
  },
  {
    meta: {
      title: 'Tables',
      requiresAuth: true
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Tags',
      requiresAuth: true
    },
    path: '/tags',
    name: 'tags',
    component: () => import('@/views/Documents/TagsTableView.vue')
  },
  {
    meta: {
      title: 'Categories',
      requiresAuth: true
    },
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/Documents/CategoriesTableView.vue')
  },
  {
    meta: {
      title: 'Documentes',
      requiresAuth: true
    },
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/Documents/DocumentsTableView.vue')
  },
  {
    meta: {
      title: 'Gradustion',
      requiresAuth: true
    },
    path: '/gradustion',
    name: 'Gradustion',
    component: () => import('@/views/Documents/GradustionProjectTableView.vue')
  },
  {
    meta: {
      title: 'Users',
      requiresAuth: true
    },
    path: '/userTable',
    name: 'users',
    component: () => import('@/views/Mangment/UsersTableView.vue')
  },
  {
    meta: {
      title: 'Roles',
      requiresAuth: true
    },
    path: '/roleTable',
    name: 'roles',
    component: () => import('@/views/Mangment/RolesTableView.vue')
  },
  {
    meta: {
      title: 'Profile',
      requiresAuth: true
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Adding a global beforeEach guard to check for routes that require authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // If the user is not authenticated, redirect to login page
      next({ name: 'login' })
    } else {
      // Proceed to the route if the user is authenticated
      next()
    }
  } else {
    // If the route does not require authentication, always allow
    next()
  }
})

export default router
