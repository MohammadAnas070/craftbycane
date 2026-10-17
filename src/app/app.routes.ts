import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Crafted By Cane | Handmade cane furniture and decor', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent) },
  { path: 'products/:slug', loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent) },
  { path: 'categories/:slug', loadComponent: () => import('./pages/category/category.component').then((m) => m.CategoryComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent) },
  { path: 'craftsmanship', loadComponent: () => import('./pages/craftsmanship/craftsmanship.component').then((m) => m.CraftsmanshipComponent) },
  { path: 'custom-orders', loadComponent: () => import('./pages/custom-orders/custom-orders.component').then((m) => m.CustomOrdersComponent) },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent) },
  { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials.component').then((m) => m.TestimonialsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent) },
  { path: 'journal', loadComponent: () => import('./pages/journal/journal.component').then((m) => m.JournalComponent) },
  { path: 'journal/:slug', loadComponent: () => import('./pages/journal/article.component').then((m) => m.ArticleComponent) },
  { path: 'search', loadComponent: () => import('./pages/utility/search.component').then((m) => m.SearchComponent) },
  { path: 'wishlist', loadComponent: () => import('./pages/utility/wishlist.component').then((m) => m.WishlistComponent) },
  ...['privacy-policy', 'terms', 'shipping-policy', 'returns-policy'].map((slug) => ({
    path: slug,
    data: { slug },
    loadComponent: () => import('./pages/utility/policy.component').then((m) => m.PolicyComponent),
  })),
  { path: 'not-found', loadComponent: () => import('./pages/utility/not-found.component').then((m) => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./pages/utility/not-found.component').then((m) => m.NotFoundComponent) },
];
