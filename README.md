# ServeNear - Local Service Marketplace

Connect with trusted local service providers in your area. Find plumbers, electricians, cleaners, and more.

## 🚀 Features

- **Local Service Discovery**: Find service providers near you
- **Real-time Chat**: Communicate directly with providers
- **Booking System**: Schedule services at your convenience
- **Rating & Reviews**: Read and leave reviews for services
- **Map Integration**: View service locations and get directions
- **Voice Requests**: Ask for help using voice commands
- **Sustainability Tracking**: Monitor environmental impact

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Maps**: Google Maps
- **Authentication**: Supabase Auth
- **Styling**: React Native StyleSheet
- **State Management**: Zustand

## 🌐 Deployment

### Web Deployment

The app is configured for web deployment with server-side rendering support.

#### Netlify
```bash
npm run build:web:production
# Upload dist/ folder to Netlify
```

#### Vercel
```bash
npm run build:web:production
# Deploy using Vercel CLI or GitHub integration
```

#### Custom Domain Setup

1. Configure your domain in `app.json`:
```json
{
  "plugins": [
    [
      "expo-router",
      {
        "origin": "https://your-domain.com"
      }
    ]
  ]
}
```

2. Update environment variables for production
3. Deploy to your hosting provider
4. Configure DNS to point to your hosting provider

### Mobile Deployment

#### iOS (App Store)
```bash
eas build --platform ios
eas submit --platform ios
```

#### Android (Google Play)
```bash
eas build --platform android
eas submit --platform android
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm run dev`

### Environment Variables
Create a `.env` file with:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 📱 Features Overview

### For Customers
- Browse local services by category
- View provider profiles and ratings
- Book services with flexible scheduling
- Real-time chat with providers
- Track service history and sustainability impact

### For Service Providers
- Create detailed service listings
- Manage bookings and availability
- Chat with customers
- Build reputation through reviews
- Track earnings and performance

## 🗺 API Routes

- `/sitemap.xml` - SEO sitemap
- `/robots.txt` - Search engine directives
- `/manifest.json` - PWA manifest

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@servenear.app or create an issue on GitHub.