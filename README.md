# ServeNear - Local Service Marketplace

Connect with trusted local service providers in your area. Find plumbers, electricians, cleaners, and more.

🌐 **Try Now**: [Downlaod](https://github.com/imagions/servenear/tree/main/final_apk/servenear-final.apk)

⚠️ **Note**: This app is **primarily designed for mobile phones**. While some features may work on web, the best experience is on Android devices.

## 🚀 Features

- **Local Service Discovery**: Find service providers near you
- **Real-time Chat**: Communicate directly with providers
- **Booking System**: Schedule services at your convenience
- **Rating & Reviews**: Read and leave reviews for services
- **Map Integration**: View service locations and get directions
- **Voice Requests**: Ask for help using voice commands
- **Sustainability Tracking**: Monitor environmental impact

## 🛠 Tech Stack

- **Frontend & Backend**: **Bolt.new**
- **Voice Transcription**: Elevenlabs
- **Framework**: Expo SDK 53.0.13
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Maps**: Google Maps with React Native Maps
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Navigation**: Expo Router (File-based routing)
- **Styling**: React Native StyleSheet
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

### Build Commands

```bash
# 🚧 Start development server (iOS & Android)
npx expo start

# 📱 Build APK for Android (local build)
npx expo run:android
```

### Environment Variables

Required environment variables for production:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

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


### Database Setup

The app uses Supabase with the following main tables:
- `users` - Stores user profiles, authentication data, and service provider details
- `categories` - Defines main service categories (e.g., Plumbing, Electrician)
- `subcategories` - Further classification of services under each category
- `services` - Listings posted by providers, including service metadata and geolocation (via PostGIS)
- `messages` - Chat history between users and the built-in AI assistant
- `requests` - Voice-based service requests and their transcribed text (via ElevenLabs)


## 📱 Features Overview

### For Customers
- Voice-powered service requests
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
- Provider mode toggle


## 🔒 Security

- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Only**: Secure connections enforced
- **Row Level Security**: Database-level access control
- **Input Validation**: Sanitized user inputs
- **Authentication**: Secure user sessions


## 📄 License

MIT License - see LICENSE file for details


## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Service discovery and booking
  - Provider profiles and ratings
  - Map integration
  - Real-time chat
  - Voice requests

---

Built with ❤️ using Expo and React Native
