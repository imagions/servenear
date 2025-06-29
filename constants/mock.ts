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
    category_id: 'cat-1',
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    startingPrice: 50,
    servicesCount: 12
  },
  { 
    id: 'subcat-2', 
    name: 'Drain Cleaning', 
    category_id: 'cat-1',
    image: 'https://images.pexels.com/photos/5728297/pexels-photo-5728297.jpeg',
    startingPrice: 60,
    servicesCount: 8
  },
  { 
    id: 'subcat-3', 
    name: 'Fixture Installation', 
    category_id: 'cat-1',
    image: 'https://images.pexels.com/photos/5570224/pexels-photo-5570224.jpeg',
    startingPrice: 70,
    servicesCount: 10
  },
  { 
    id: 'subcat-4', 
    name: 'Wiring', 
    category_id: 'cat-2',
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    startingPrice: 80,
    servicesCount: 15
  },
  { 
    id: 'subcat-5', 
    name: 'Lighting', 
    category_id: 'cat-2',
    image: 'https://images.pexels.com/photos/5738351/pexels-photo-5738351.jpeg',
    startingPrice: 55,
    servicesCount: 9
  },
  { 
    id: 'subcat-6', 
    name: 'House Cleaning', 
    category_id: 'cat-3',
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    startingPrice: 45,
    servicesCount: 14
  },
  { 
    id: 'subcat-7', 
    name: 'Carpet Cleaning', 
    category_id: 'cat-3',
    image: 'https://images.pexels.com/photos/6195306/pexels-photo-6195306.jpeg',
    startingPrice: 65,
    servicesCount: 7
  }
];

export const mockServices: ServiceItem[] = [
  {
    id: 'service-1',
    title: 'Emergency Plumbing Service',
    description: 'Professional plumbing service for emergency situations. Available 24/7 for leaks, clogs, and pipe repairs. Fast response time and quality workmanship guaranteed.',
    hourly_price: 85,
    once_price: 150,
    active: true,
    lat: 37.7749,
    long: -122.4194,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    tags: ['emergency', 'plumbing', '24/7'],
    subcategory: 'subcat-1',
    provider: 'provider-1',
    verification_status: 'verified',
    included: ['Tools', 'Basic materials', 'Cleanup'],
    
    // UI computed fields
    provider_details: {
      id: 'provider-1',
      name: 'John Smith',
      profile_image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      bio: 'Professional plumber with 10+ years experience',
      is_provider: true,
      verified: true,
      rating: 4.8,
      total_serves: 156,
      experience: 10,
      active: true,
      created_at: '2020-01-01'
    },
    subcategory_details: {
      id: 'subcat-1',
      name: 'Pipe Repair',
      category_id: 'cat-1',
      icon: 'plumbing'
    },
    category: 'Plumbing',
    reviewCount: 156,
    distance: 2.4,
    price: 85,
    fixedPrice: 150,
    providerImage: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
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
    hourly_price: 95,
    once_price: 200,
    active: true,
    lat: 37.7833,
    long: -122.4167,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    tags: ['electrical', 'licensed', 'residential'],
    subcategory: 'subcat-4',
    provider: 'provider-2',
    verification_status: 'verified',
    included: ['Safety inspection', 'Code compliance', 'Warranty'],
    
    // UI computed fields
    provider_details: {
      id: 'provider-2',
      name: 'Sarah Johnson',
      profile_image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      bio: 'Licensed electrician with expertise in residential work',
      is_provider: true,
      verified: true,
      rating: 4.9,
      total_serves: 203,
      experience: 8,
      active: true,
      created_at: '2021-03-15'
    },
    subcategory_details: {
      id: 'subcat-4',
      name: 'Wiring',
      category_id: 'cat-2',
      icon: 'electrical-services'
    },
    category: 'Electrical',
    reviewCount: 203,
    distance: 3.1,
    price: 95,
    fixedPrice: 200,
    providerImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
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
    hourly_price: 40,
    once_price: 120,
    active: true,
    lat: 37.7883,
    long: -122.4267,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    tags: ['cleaning', 'eco-friendly', 'deep-clean'],
    subcategory: 'subcat-6',
    provider: 'provider-3',
    verification_status: 'verified',
    included: ['Eco-friendly supplies', 'All rooms', 'Satisfaction guarantee'],
    
    // UI computed fields
    provider_details: {
      id: 'provider-3',
      name: 'Maria Garcia',
      profile_image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      bio: 'Professional cleaner specializing in eco-friendly methods',
      is_provider: true,
      verified: true,
      rating: 4.7,
      total_serves: 178,
      experience: 5,
      active: true,
      created_at: '2022-01-10'
    },
    subcategory_details: {
      id: 'subcat-6',
      name: 'House Cleaning',
      category_id: 'cat-3',
      icon: 'cleaning-services',
      startingPrice: 45,
    },
    category_details: {
      id: 'cat-3',
      name: 'Cleaning',
      icon: 'cleaning-services'
    },
    reviewCount: 178,
    distance: 1.8,
    price: 40,
    fixedPrice: 120,
    providerImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
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
  }
];

export const mockTrendingServices: TrendingService[] = [
  {
    id: 'service-1',
    title: 'Emergency Plumbing Service',
    description: 'Professional plumbing service for emergency situations. Available 24/7 for leaks, clogs, and pipe repairs. Fast response time and quality workmanship guaranteed.',
    provider: 'John Smith',
    rating: 4.8,
    hourly_price: 85,
    once_price: 150,
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    distance: 2.4
  },
  {
    id: 'service-2',
    title: 'Residential Electrical Repair',
    description: 'Licensed electrician offering complete electrical services for your home. Specializing in panel upgrades, outlet installation, lighting, and troubleshooting electrical issues.',
    provider: 'Sarah Johnson',
    rating: 4.9,
    hourly_price: 95,
    once_price: 200,
    image: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    distance: 3.1
  },
  {
    id: 'service-3',
    title: 'Deep House Cleaning',
    description: 'Thorough house cleaning service using eco-friendly products. Services include dusting, vacuuming, mopping, bathroom and kitchen cleaning, and interior window washing.',
    provider: 'Maria Garcia',
    rating: 4.7,
    hourly_price: 40,
    once_price: 120,
    image: 'https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg',
    distance: 1.8
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
    serviceId: 'service-2',
    serviceTitle: 'Residential Electrical Repair',
    serviceImage: 'https://images.pexels.com/photos/6422293/pexels-photo-6422293.jpeg',
    providerName: 'Sarah Johnson',
    date: 'May 15, 2024',
    time: '3:00 PM',
    price: 95,
    status: 'completed'
  },
  {
    id: 'booking-4',
    serviceId: 'service-4',
    serviceTitle: 'Carpet Cleaning',
    serviceImage: 'https://images.pexels.com/photos/6195306/pexels-photo-6195306.jpeg',
    providerName: 'Sophie Turner',
    date: 'June 2, 2024',
    time: '11:00 AM',
    price: 60,
    status: 'cancelled'
  },
  {
    id: 'booking-5',
    serviceId: 'service-5',
    serviceTitle: 'Gardening',
    serviceImage: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg',
    providerName: 'Mike Green',
    date: 'June 5, 2024',
    time: '9:00 AM',
    price: 90,
    status: 'rejected'
  },
  {
    id: 'booking-6',
    serviceId: 'service-6',
    serviceTitle: 'Electrician Visit',
    serviceImage: 'https://images.pexels.com/photos/1435183/pexels-photo-1435183.jpeg',
    providerName: 'Priya Patel',
    date: 'June 10, 2024',
    time: '1:00 PM',
    price: 110,
    status: 'pending'
  },
  {
    id: 'booking-7',
    serviceId: 'service-7',
    serviceTitle: 'Tech Support',
    serviceImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    providerName: 'Alex Kim',
    date: 'June 12, 2024',
    time: '3:00 PM',
    price: 150,
    status: 'upcoming'
  },
  {
    id: 'booking-8',
    serviceId: 'service-8',
    serviceTitle: 'Tutoring - Math',
    serviceImage: 'https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg',
    providerName: 'Linda Lee',
    date: 'June 15, 2024',
    time: '5:00 PM',
    price: 70,
    status: 'completed'
  },
  {
    id: 'booking-9',
    serviceId: 'service-9',
    serviceTitle: 'Beauty - Haircut',
    serviceImage: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
    providerName: 'Emily Clark',
    date: 'June 18, 2024',
    time: '2:00 PM',
    price: 50,
    status: 'cancelled'
  },
  {
    id: 'booking-10',
    serviceId: 'service-10',
    serviceTitle: 'Moving Help',
    serviceImage: 'https://images.pexels.com/photos/7464437/pexels-photo-7464437.jpeg',
    providerName: 'David Miller',
    date: 'June 20, 2024',
    time: '8:00 AM',
    price: 200,
    status: 'pending'
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
    date: 'May 15, 2024',
    photos: [
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg',
      'https://images.pexels.com/photos/4239147/pexels-photo-4239147.jpeg',
      'https://images.pexels.com/photos/4239148/pexels-photo-4239148.jpeg'
    ]
  },
  {
    id: 'review-2',
    serviceId: 'service-1',
    userId: 'user-2',
    userName: 'Michael Chen',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 4.7,
    comment: 'Great service repairing our dishwasher. Explained everything clearly and did a thorough job.',
    date: 'May 10, 2024',
    photos: [
      'https://images.pexels.com/photos/4239149/pexels-photo-4239149.jpeg',
      'https://images.pexels.com/photos/4239150/pexels-photo-4239150.jpeg'
    ]
  },
  {
    id: 'review-3',
    serviceId: 'service-2',
    userId: 'user-3',
    userName: 'Lisa Anderson',
    userImage: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg',
    rating: 5.0,
    comment: 'Sarah was amazing! She fixed our electrical issue quickly and efficiently. Very knowledgeable and professional.',
    date: 'May 18, 2024',
    photos: []
  },
  {
    id: 'review-4',
    serviceId: 'service-3',
    userId: 'user-4',
    userName: 'Robert Taylor',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4.8,
    comment: 'Maria and her team did an excellent job cleaning our home. They were thorough and paid attention to every detail. Our house has never looked better!',
    date: 'May 12, 2024',
    photos: []
  }
];