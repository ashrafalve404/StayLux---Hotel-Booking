import { DataSource } from 'typeorm';
import { typeOrmConfig } from './data-source';
import { User } from '../users/entities/user.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Room } from '../hotels/entities/room.entity';
import { Package } from '../packages/entities/package.entity';
import { Booking } from '../bookings/entities/booking.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const AppDataSource = new DataSource({
    ...typeOrmConfig,
    synchronize: true,
  });
  
  await AppDataSource.initialize();
  
  const userRepo = AppDataSource.getRepository(User);
  const hotelRepo = AppDataSource.getRepository(Hotel);
  const roomRepo = AppDataSource.getRepository(Room);
  const packageRepo = AppDataSource.getRepository(Package);
  const bookingRepo = AppDataSource.getRepository(Booking);
  
  // Clear existing data
  await bookingRepo.query('DELETE FROM bookings');
  await packageRepo.query('DELETE FROM packages');
  await roomRepo.query('DELETE FROM rooms');
  await hotelRepo.query('DELETE FROM hotels');
  await userRepo.query('DELETE FROM users');
  
  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = userRepo.create({
    email: 'admin@staylux.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin' as const,
    phone: '+1 555-0100',
  });
  
  const owner1 = userRepo.create({
    email: 'owner1@staylux.com',
    password: hashedPassword,
    name: 'Hotel Owner One',
    role: 'owner' as const,
    phone: '+1 555-0101',
  });
  
  const owner2 = userRepo.create({
    email: 'owner2@staylux.com',
    password: hashedPassword,
    name: 'Hotel Owner Two',
    role: 'owner' as const,
    phone: '+1 555-0102',
  });
  
  const guestUser = userRepo.create({
    email: 'guest@staylux.com',
    password: hashedPassword,
    name: 'Guest User',
    role: 'user' as const,
    phone: '+1 555-0103',
  });
  
  await userRepo.save([admin, owner1, owner2, guestUser]);
  
  // Create hotels
  const hotels = hotelRepo.create([
    {
      name: 'Grand Plaza Hotel',
      description: 'Luxury hotel in the heart of downtown with stunning city views and world-class amenities.',
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      pricePerNight: 299,
      rating: 4.8,
      reviewCount: 342,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Pool, Gym, Spa, Restaurant, Bar, 24/7 Room Service, Concierge',
      policies: 'Check-in: 3PM, Check-out: 11AM, Free cancellation up to 24 hours before arrival',
      owner: owner1,
      ownerId: owner1.id,
      isActive: true,
    },
    {
      name: 'Oceanview Resort',
      description: 'Beachfront paradise with private villas and direct access to pristine white sand beaches.',
      address: '456 Beach Road',
      city: 'Miami',
      country: 'USA',
      pricePerNight: 450,
      rating: 4.9,
      reviewCount: 218,
      images: ['https://images.unsplash.com/photo-1544806070-c31e3d5020d0?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Private Beach, Infinity Pool, Water Sports, Beach Bar, Spa',
      policies: 'Check-in: 2PM, Check-out: 12PM, Beach towels provided, No smoking',
      owner: owner1,
      ownerId: owner1.id,
      isActive: true,
    },
    {
      name: 'Mountain Lodge',
      description: 'Cozy alpine retreat surrounded by majestic peaks with rustic luxury and adventure awaits.',
      address: '789 Peak Drive',
      city: 'Aspen',
      country: 'USA',
      pricePerNight: 375,
      rating: 4.7,
      reviewCount: 156,
      images: ['https://images.unsplash.com/photo-1551009013-6e0fd518b4a6?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Fireplace, Hot Tub, Ski Storage, Restaurant, Bar, Hiking Trails',
      policies: 'Check-in: 4PM, Check-out: 11AM, Pet-friendly rooms available',
      owner: owner2,
      ownerId: owner2.id,
      isActive: true,
    },
    {
      name: 'Royal Palace Hotel',
      description: 'Opulent 5-star palace hotel offering royal treatment in the historic district of Paris.',
      address: '101 Champs-Élysées',
      city: 'Paris',
      country: 'France',
      pricePerNight: 650,
      rating: 4.9,
      reviewCount: 423,
      images: ['https://images.unsplash.com/photo-1595749286619-2ba18e06e1b6?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Palace Pool, Michelin Star Restaurant, Spa, Butler Service, Limousine',
      policies: 'Check-in: 3PM, Check-out: 12PM, Dress code for dining, Valet parking',
      owner: owner2,
      ownerId: owner2.id,
      isActive: true,
    },
    {
      name: 'Desert Oasis Retreat',
      description: 'Secluded luxury in the desert with private pools, camel rides, and star-gazing experiences.',
      address: '202 Dune Street',
      city: 'Dubai',
      country: 'UAE',
      pricePerNight: 520,
      rating: 4.8,
      reviewCount: 189,
      images: ['https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Private Pool, Camel Safaris, Desert Dining, Spa, Astronomy Deck',
      policies: 'Check-in: 2PM, Check-out: 1PM, Traditional attire available, Cultural activities',
      owner: owner1,
      ownerId: owner1.id,
      isActive: true,
    },
    {
      name: 'Tropical Paradise Resort',
      description: 'Island paradise with overwater bungalows, coral reefs, and tropical gardens.',
      address: '303 Lagoon Way',
      city: 'Maldives',
      country: 'Maldives',
      pricePerNight: 750,
      rating: 5.0,
      reviewCount: 97,
      images: ['https://images.unsplash.com/photo-1573842281619-638b9377d9c1?w=800&h=600&fit=crop'],
      amenities: 'Free WiFi, Overwater Bungalows, House Reef, Water Villa, Spa, Scuba Diving, Private Butler',
      policies: 'Check-in: 2PM, Check-out: 12PM, Seaplane transfer included, All meals included',
      owner: owner2,
      ownerId: owner2.id,
      isActive: true,
    },
  ]);
  
  await hotelRepo.save(hotels);
  
  // Create rooms
  const roomEntities = roomRepo.create([
    { roomNumber: '101', roomType: 'Standard', description: 'Cozy standard room with city view', price: 299, capacity: 2, status: 'available' as const, hotel: hotels[0], hotelId: hotels[0].id, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
    { roomNumber: '102', roomType: 'Deluxe', description: 'Spacious deluxe room with balcony', price: 399, capacity: 3, status: 'available' as const, hotel: hotels[0], hotelId: hotels[0].id, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
    { roomNumber: '103', roomType: 'Suite', description: 'Luxury suite with separate living area', price: 599, capacity: 4, status: 'occupied' as const, hotel: hotels[0], hotelId: hotels[0].id, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Living Room', 'Jacuzzi'] },
    { roomNumber: '201', roomType: 'Garden View', description: 'Room with garden view', price: 450, capacity: 2, status: 'available' as const, hotel: hotels[1], hotelId: hotels[1].id, amenities: ['WiFi', 'TV', 'AC', 'Beach Access'] },
    { roomNumber: '202', roomType: 'Ocean View', description: 'Room with direct ocean view', price: 650, capacity: 2, status: 'available' as const, hotel: hotels[1], hotelId: hotels[1].id, amenities: ['WiFi', 'TV', 'AC', 'Private Beach'] },
    { roomNumber: '203', roomType: 'Villa', description: 'Private villa with pool', price: 1200, capacity: 4, status: 'maintenance' as const, hotel: hotels[1], hotelId: hotels[1].id, amenities: ['WiFi', 'TV', 'AC', 'Private Pool', 'Chef Service'] },
    { roomNumber: '301', roomType: 'Cabin', description: 'Rustic cabin with mountain view', price: 375, capacity: 2, status: 'available' as const, hotel: hotels[2], hotelId: hotels[2].id, amenities: ['WiFi', 'Fireplace', 'Hot Tub Access'] },
    { roomNumber: '302', roomType: 'Lodge Suite', description: 'Spacious suite with loft', price: 550, capacity: 4, status: 'available' as const, hotel: hotels[2], hotelId: hotels[2].id, amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen'] },
    { roomNumber: '401', roomType: 'Royal Room', description: 'Luxurious room fit for royalty', price: 650, capacity: 2, status: 'available' as const, hotel: hotels[3], hotelId: hotels[3].id, amenities: ['WiFi', 'TV', 'AC', 'Butler Service', 'Gold Accents'] },
    { roomNumber: '402', roomType: 'Presidential Suite', description: 'Ultimate luxury with Eiffel Tower view', price: 2500, capacity: 6, status: 'occupied' as const, hotel: hotels[3], hotelId: hotels[3].id, amenities: ['WiFi', 'TV', 'AC', 'Butler', 'Chef', 'Limousine', 'Eiffel Tower View'] },
    { roomNumber: '501', roomType: 'Desert Tent', description: 'Luxury tent with private pool', price: 520, capacity: 2, status: 'available' as const, hotel: hotels[4], hotelId: hotels[4].id, amenities: ['WiFi', 'Private Pool', 'Traditional Decor', 'Camel Access'] },
    { roomNumber: '502', roomType: 'Royal Tent', description: 'Opulent tent with star-gazing deck', price: 850, capacity: 4, status: 'available' as const, hotel: hotels[4], hotelId: hotels[4].id, amenities: ['WiFi', 'Private Pool', 'Star-gazing Deck', 'Private Chef'] },
    { roomNumber: '601', roomType: 'Overwater Bungalow', description: 'Private bungalow over crystal clear water', price: 750, capacity: 2, status: 'available' as const, hotel: hotels[5], hotelId: hotels[5].id, amenities: ['WiFi', 'Private Deck', 'Direct Ocean Access', 'Butler Service'] },
    { roomNumber: '602', roomType: 'Water Villa', description: 'Spacious villa with slide into ocean', price: 1500, capacity: 4, status: 'available' as const, hotel: hotels[5], hotelId: hotels[5].id, amenities: ['WiFi', 'Private Pool', 'Ocean Slide', 'Private Beach', 'Chef Service'] },
  ]);
  
  await roomRepo.save(roomEntities);
  
  // Create packages
  const packageEntities = packageRepo.create([
    { name: 'Romantic Getaway', description: 'Perfect weekend for couples with champagne, flowers, and candlelit dinner', price: 899, duration: 2, inclusions: ['Champagne on arrival', 'Rose petals', 'Candlelit dinner', 'Couples massage', 'Breakfast included'], image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop', hotel: hotels[0], hotelId: hotels[0].id, isActive: true },
    { name: 'Family Fun Package', description: 'Everything your family needs for an unforgettable vacation', price: 1299, duration: 4, inclusions: ['Kids stay free', 'Theme park tickets', 'Family suite upgrade', 'Kids club access', 'All meals included'], image: 'https://images.unsplash.com/photo-1573842281619-638b9377d9c1?w=800&h=600&fit=crop', hotel: hotels[1], hotelId: hotels[1].id, isActive: true },
    { name: 'Adventure Seeker', description: 'For thrill-seekers who want it all', price: 1499, duration: 5, inclusions: ['Guided hiking tours', 'Ski pass', 'Equipment rental', 'Adventure sports', 'Mountain guide'], image: 'https://images.unsplash.com/photo-1551009013-6e0fd518b4a6?w=800&h=600&fit=crop', hotel: hotels[2], hotelId: hotels[2].id, isActive: true },
    { name: 'Royal Treatment', description: 'Experience life like royalty in the city of love', price: 2999, duration: 3, inclusions: ['Private butler', 'Eiffel Tower dinner', 'Luxury shopping tour', 'Private limousine', 'Champagne cruise'], image: 'https://images.unsplash.com/photo-1595749286619-2ba18e06e1b6?w=800&h=600&fit=crop', hotel: hotels[3], hotelId: hotels[3].id, isActive: true },
    { name: 'Desert Explorer', description: 'Discover the magic of the desert with traditional experiences', price: 1099, duration: 3, inclusions: ['Camel safari', 'Bedouin dinner', 'Desert spa treatment', 'Falconry experience', 'Traditional attire'], image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=600&fit=crop', hotel: hotels[4], hotelId: hotels[4].id, isActive: true },
    { name: 'Paradise Island', description: 'Ultimate island luxury with everything included', price: 3499, duration: 7, inclusions: ['Private villa', 'All meals and drinks', 'Scuba diving', 'Private beach', 'Personal concierge'], image: 'https://images.unsplash.com/photo-1573842281619-638b9377d9c1?w=800&h=600&fit=crop', hotel: hotels[5], hotelId: hotels[5].id, isActive: true },
  ]);
  
  await packageRepo.save(packageEntities);
  
  // Create bookings
  const bookingEntities = bookingRepo.create([
    { checkInDate: new Date('2024-05-15'), checkOutDate: new Date('2024-05-17'), guests: 2, totalAmount: 1299, status: 'confirmed' as const, hotel: hotels[0], hotelId: hotels[0].id, user: guestUser, userId: guestUser.id },
    { checkInDate: new Date('2024-06-10'), checkOutDate: new Date('2024-06-15'), guests: 4, totalAmount: 3499, status: 'pending' as const, package: packageEntities[1], packageId: packageEntities[1].id, hotel: hotels[1], hotelId: hotels[1].id, user: guestUser, userId: guestUser.id },
    { checkInDate: new Date('2024-04-20'), checkOutDate: new Date('2024-04-25'), guests: 2, totalAmount: 1999, status: 'completed' as const, package: packageEntities[3], packageId: packageEntities[3].id, hotel: hotels[3], hotelId: hotels[3].id, user: guestUser, userId: guestUser.id },
    { checkInDate: new Date('2024-07-01'), checkOutDate: new Date('2024-07-03'), guests: 2, totalAmount: 899, status: 'confirmed' as const, package: packageEntities[0], packageId: packageEntities[0].id, hotel: hotels[0], hotelId: hotels[0].id, user: guestUser, userId: guestUser.id },
  ]);
  
  await bookingRepo.save(bookingEntities);
  
  console.log('Database seeded successfully!');
  console.log(`Created ${(await userRepo.find()).length} users`);
  console.log(`Created ${(await hotelRepo.find()).length} hotels`);
  console.log(`Created ${(await roomRepo.find()).length} rooms`);
  console.log(`Created ${(await packageRepo.find()).length} packages`);
  console.log(`Created ${(await bookingRepo.find()).length} bookings`);
  
  await AppDataSource.destroy();
}


seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
