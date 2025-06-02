import { ServiceCategory, ServiceItem, SubCategory, BookingItem, ReviewItem, TrendingService } from '@/types';

export const mockCategories: ServiceCategory[] = [
  { id: 'cat-1', name: 'Plumbing', icon: 'plumbing' },
  { id: 'cat-2', name: 'Electrical', icon: 'electrical-services' },
  { id: 'cat-3', name: 'Cleaning', icon: 'cleaning-services' },
  { id: 'cat-4', name: 'Moving', icon: 'local-shipping' },
  { id: 'cat-5', name: 'Beauty', icon: 'spa' },
  { id: 'cat-6', name: 'Tech', icon: 'computer' },
  { id: 'cat-7', name: 'Tutoring', icon: 'school' },
  { id: 'cat-8', name: 'Delivery', icon: 'delivery-dining' }
];

export const mockSubcategories: SubCategory[] = [
  { 
    id: 'subcat-1', 
    name: 'Pipe Repair', 
    categoryId: 'cat-1',
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg' 
  },
  { 
    id: 'subcat-2', 
    name: 'Drain Cleaning', 
    categoryId: 'cat-1',
    image: 'https://images.pexels.com/photos/5728297/pexels-photo-5728297.jpeg' 
  },
  { 
    id: 'subcat-3', 
    name: 'Fixture Installation', 
    categoryId: 'cat-1',
    image: 'https://images.pexels.com/photos/5570224/pexels-photo-5570224.jpeg' 
  },
  { 
    id: 'subcat-4', 
    name: 'Wiring', 
    categoryId: 'cat-2',
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg' 
  },
  { 
    id: 'subcat-5', 
    name: 'Lighting', 
    categoryId: 'cat-2',
    image: 'https://images.pexels.com/photos/5738351/pexels-photo-5738351.jpeg' 
  },
  { 
    id: 'subcat-6', 
    name: 'House Cleaning', 
    categoryId: 'cat-3',
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg' 
  },
  { 
    id: 'subcat-7', 
    name: 'Carpet Cleaning', 
    categoryId: 'cat-3',
    image: 'https://images.pexels.com/photos/6195306/pexels-photo-6195306.jpeg' 
  }
];

export const mockServices: ServiceItem[] = [
  {
    id: 'service-1',
    title: 'Emergency Plumbing Service',
    description: 'Professional plumbing service for emergency situations. Available 24/7 for leaks, clogs, and pipe repairs. Fast response time and quality workmanship guaranteed.',
    provider: 'John Smith',
    providerImage: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
    category: 'Plumbing',
    rating: 4.8,
    reviewCount: 156,
    price: 85,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    distance: 2.4,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      hours: '24/7'
    },
    ratings: {
      respect: 4.9,
      trust: 4.7,
      communication: 4.8,
      punctuality: 4.7
    }
  },
  {
    id: 'service-2',
    title: 'Residential Electrical Repair',
    description: 'Licensed electrician offering complete electrical services for your home. Specializing in panel upgrades, outlet installation, lighting, and troubleshooting electrical issues.',
    provider: 'Sarah Johnson',
    providerImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    category: 'Electrical',
    rating: 4.9,
    reviewCount: 203,
    price: 95,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    distance: 3.1,
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri',
      hours: '8:00 AM - 6:00 PM'
    },
    ratings: {
      respect: 5.0,
      trust: 4.9,
      communication: 4.8,
      punctuality: 4.9
    }
  },
  {
    id: 'service-3',
    title: 'Deep House Cleaning',
    description: 'Thorough house cleaning service using eco-friendly products. Services include dusting, vacuuming, mopping, bathroom and kitchen cleaning, and interior window washing.',
    provider: 'Maria Garcia',
    providerImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    category: 'Cleaning',
    rating: 4.7,
    reviewCount: 178,
    price: 40,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    distance: 1.8,
    location: {
      latitude: 37.7883,
      longitude: -122.4267,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Wed, Fri',
      hours: '9:00 AM - 5:00 PM'
    },
    ratings: {
      respect: 4.8,
      trust: 4.7,
      communication: 4.5,
      punctuality: 4.6
    }
  },
  {
    id: 'service-4',
    title: 'Professional Moving Help',
    description: 'Experienced movers to help with your local move. Services include furniture disassembly/assembly, loading/unloading, and safe transport of your belongings.',
    provider: 'Mike Chen',
    providerImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    category: 'Moving',
    rating: 4.6,
    reviewCount: 126,
    price: 75,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/4246197/pexels-photo-4246197.jpeg',
    distance: 4.2,
    location: {
      latitude: 37.7753,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Tue, Thu, Sat, Sun',
      hours: '8:00 AM - 8:00 PM'
    },
    ratings: {
      respect: 4.7,
      trust: 4.6,
      communication: 4.5,
      punctuality: 4.6
    }
  },
  {
    id: 'service-5',
    title: 'Hair Styling & Makeup',
    description: 'Professional hair styling and makeup services for special events, weddings, photoshoots, or just to treat yourself. Using high-quality products and latest techniques.',
    provider: 'Emily Wong',
    providerImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    category: 'Beauty',
    rating: 4.9,
    reviewCount: 215,
    price: 120,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
    distance: 2.7,
    location: {
      latitude: 37.7923,
      longitude: -122.4147,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri, Sat',
      hours: '10:00 AM - 7:00 PM'
    },
    ratings: {
      respect: 5.0,
      trust: 4.9,
      communication: 4.8,
      punctuality: 4.9
    }
  },
  {
    id: 'service-6',
    title: 'Computer Repair & IT Support',
    description: 'Expert computer repair and IT support for both Mac and PC. Services include virus removal, hardware replacement, software installation, and general troubleshooting.',
    provider: 'David Kim',
    providerImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    category: 'Tech',
    rating: 4.8,
    reviewCount: 187,
    price: 65,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/2036656/pexels-photo-2036656.jpeg',
    distance: 3.5,
    location: {
      latitude: 37.7723,
      longitude: -122.4344,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri',
      hours: '9:00 AM - 6:00 PM'
    },
    ratings: {
      respect: 4.8,
      trust: 4.9,
      communication: 4.7,
      punctuality: 4.7
    }
  },
  {
    id: 'service-7',
    title: 'Math & Science Tutoring',
    description: 'Experienced tutor for K-12 and college-level mathematics and sciences. Personalized approach to help students understand concepts and improve grades.',
    provider: 'Jessica Taylor',
    providerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    category: 'Tutoring',
    rating: 4.9,
    reviewCount: 143,
    price: 50,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/3795221/pexels-photo-3795221.jpeg',
    distance: 2.2,
    location: {
      latitude: 37.7853,
      longitude: -122.4104,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri',
      hours: '3:00 PM - 8:00 PM'
    },
    ratings: {
      respect: 5.0,
      trust: 4.9,
      communication: 4.9,
      punctuality: 4.8
    }
  },
  {
    id: 'service-8',
    title: 'Grocery & Food Delivery',
    description: 'Prompt and reliable grocery and food delivery service. Shop from your favorite stores and restaurants and have items delivered to your doorstep.',
    provider: 'James Wilson',
    providerImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    category: 'Delivery',
    rating: 4.7,
    reviewCount: 192,
    price: 25,
    fixedPrice: 599,
    image: 'https://images.pexels.com/photos/6765842/pexels-photo-6765842.jpeg',
    distance: 1.5,
    location: {
      latitude: 37.7943,
      longitude: -122.4294,
      address: 'San Francisco, CA'
    },
    availability: {
      days: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      hours: '9:00 AM - 9:00 PM'
    },
    ratings: {
      respect: 4.8,
      trust: 4.7,
      communication: 4.6,
      punctuality: 4.7
    }
  }
];

export const mockTrendingServices: TrendingService[] = [
  {
    id: 'service-1',
    title: 'Emergency Plumbing Service',
    provider: 'John Smith',
    rating: 4.8,
    price: 85,
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    distance: 2.4
  },
  {
    id: 'service-2',
    title: 'Residential Electrical Repair',
    provider: 'Sarah Johnson',
    rating: 4.9,
    price: 95,
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    distance: 3.1
  },
  {
    id: 'service-5',
    title: 'Hair Styling & Makeup',
    provider: 'Emily Wong',
    rating: 4.9,
    price: 120,
    image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
    distance: 2.7
  },
  {
    id: 'service-6',
    title: 'Computer Repair & IT Support',
    provider: 'David Kim',
    rating: 4.8,
    price: 65,
    image: 'https://images.pexels.com/photos/2036656/pexels-photo-2036656.jpeg',
    distance: 3.5
  },
  {
    id: 'service-3',
    title: 'Deep House Cleaning',
    provider: 'Maria Garcia',
    rating: 4.7,
    price: 40,
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    distance: 1.8
  },
  {
    id: 'service-8',
    title: 'Grocery & Food Delivery',
    provider: 'James Wilson',
    rating: 4.7,
    price: 25,
    image: 'https://images.pexels.com/photos/6765842/pexels-photo-6765842.jpeg',
    distance: 1.5
  }
];

export const mockBookings: BookingItem[] = [
  {
    id: 'booking-1',
    serviceId: 'service-1',
    serviceTitle: 'Emergency Plumbing Service',
    serviceImage: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    providerName: 'John Smith',
    date: 'May 25, 2024',
    time: '10:00 AM',
    price: 85,
    status: 'upcoming'
  },
  {
    id: 'booking-2',
    serviceId: 'service-3',
    serviceTitle: 'Deep House Cleaning',
    serviceImage: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    providerName: 'Maria Garcia',
    date: 'May 30, 2024',
    time: '1:00 PM',
    price: 120,
    status: 'pending'
  },
  {
    id: 'booking-3',
    serviceId: 'service-6',
    serviceTitle: 'Computer Repair & IT Support',
    serviceImage: 'https://images.pexels.com/photos/2036656/pexels-photo-2036656.jpeg',
    providerName: 'David Kim',
    date: 'May 15, 2024',
    time: '3:00 PM',
    price: 65,
    status: 'completed'
  },
  {
    id: 'booking-4',
    serviceId: 'service-5',
    serviceTitle: 'Hair Styling & Makeup',
    serviceImage: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
    providerName: 'Emily Wong',
    date: 'May 10, 2024',
    time: '11:00 AM',
    price: 120,
    status: 'cancelled'
  }
];

export const mockReviews: ReviewItem[] = [
  {
    id: 'review-1',
    serviceId: 'service-1',
    userId: 'user-1',
    userName: 'Emma Johnson',
    userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 4.9,
    comment: 'John was extremely professional and fixed our kitchen sink perfectly. He was on time and very respectful. Would definitely hire again!',
    date: 'May 15, 2024'
  },
  {
    id: 'review-2',
    serviceId: 'service-1',
    userId: 'user-2',
    userName: 'Michael Chen',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 4.7,
    comment: 'Great service repairing our dishwasher. Explained everything clearly and did a thorough job.',
    date: 'May 10, 2024'
  },
  {
    id: 'review-3',
    serviceId: 'service-2',
    userId: 'user-3',
    userName: 'Lisa Anderson',
    userImage: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg',
    rating: 5.0,
    comment: 'Sarah was amazing! She fixed our electrical issue quickly and efficiently. Very knowledgeable and professional.',
    date: 'May 18, 2024'
  },
  {
    id: 'review-4',
    serviceId: 'service-3',
    userId: 'user-4',
    userName: 'Robert Taylor',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4.8,
    comment: 'Maria and her team did an excellent job cleaning our home. They were thorough and paid attention to every detail. Our house has never looked better!',
    date: 'May 12, 2024'
  }
];