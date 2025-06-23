# ServeNear - Local Service Marketplace

Connect with trusted local service providers in your area. Find plumbers, electricians, cleaners, and more.

🌐 **Live Demo**: [https://servenear.entri.app](https://servenear.entri.app)

## 🚀 Features

- **Local Service Discovery**: Find service providers near you
- **Real-time Chat**: Communicate directly with providers
- **Booking System**: Schedule services at your convenience
- **Rating & Reviews**: Read and leave reviews for services
- **Map Integration**: View service locations and get directions
- **Voice Requests**: Ask for help using voice commands
- **Sustainability Tracking**: Monitor environmental impact
- **Progressive Web App**: Install on mobile devices for app-like experience

## 🛠 Tech Stack

- **Frontend**: React Native with Expo Router 4.0.17
- **Framework**: Expo SDK 52.0.30
- **Navigation**: Expo Router (File-based routing)
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Maps**: Google Maps with React Native Maps
- **Authentication**: Supabase Auth
- **Styling**: React Native StyleSheet
- **State Management**: Zustand
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

## 🌐 Deployment

### Production URL
The app is deployed at: **https://servenear.entri.app**

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build:web:production

# Preview build locally
npm run preview:web

# Deploy to Netlify
npm run deploy:netlify

# Deploy to Vercel
npm run deploy:vercel
```

### Hosting Configurations

#### Netlify
- **Build Command**: `npm run build:web:production`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **SPA Redirects**: Configured for client-side routing
- **Security Headers**: CSP, XSS protection, frame options
- **Caching**: Optimized for static assets

#### Vercel
- **Framework**: None (Custom Expo configuration)
- **Build Command**: `npm run build:web:production`
- **Output Directory**: `dist`
- **Rewrites**: SPA routing support
- **Environment Variables**: Supabase configuration

### Environment Variables

Required environment variables for production:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account
- Google Maps API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd servenear
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

4. **Start development server**
```bash
npm run dev
```

### Database Setup

The app uses Supabase with the following main tables:
- `users` - User profiles and provider information
- `categories` - Service categories
- `subcategories` - Service subcategories
- `services` - Service listings with location data

## 📱 Features Overview

### For Customers
- Browse local services by category
- View provider profiles and ratings
- Book services with flexible scheduling
- Real-time chat with providers
- Track service history and sustainability impact
- Voice-powered service requests

### For Service Providers
- Create detailed service listings
- Manage bookings and availability
- Chat with customers
- Build reputation through reviews
- Track earnings and performance
- Provider mode toggle

## 🗺 API Routes

- `/sitemap.xml` - SEO sitemap for search engines
- `/robots.txt` - Search engine crawling directives
- `/manifest.json` - PWA manifest for app installation

## 📊 Performance Features

- **Server-Side Rendering**: Optimized for SEO and performance
- **Progressive Web App**: Installable on mobile devices
- **Image Optimization**: Lazy loading and responsive images
- **Caching Strategy**: Aggressive caching for static assets
- **Code Splitting**: Optimized bundle sizes

## 🔒 Security

- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Only**: Secure connections enforced
- **Row Level Security**: Database-level access control
- **Input Validation**: Sanitized user inputs
- **Authentication**: Secure user sessions

## 📱 Mobile Support

- **Responsive Design**: Works on all screen sizes
- **Touch Gestures**: Native-like interactions
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time updates (when implemented)

## 🚀 Performance Metrics

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized for fast loading

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Website**: [https://servenear.entri.app](https://servenear.entri.app)
- **Email**: support@servenear.entri.app
- **Issues**: Create an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Service discovery and booking
  - Provider profiles and ratings
  - Map integration
  - Real-time chat
  - Voice requests
  - PWA support

---

Built with ❤️ using Expo and React Native