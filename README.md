# StayLux - Hotel Booking Platform

A full-stack hotel booking platform with Next.js frontend and NestJS backend.

## Features

- **User Roles**: Guest, Owner, Admin
- **Hotel Management**: Create, edit, delete hotels and rooms
- **Package Booking**: All-inclusive travel packages
- **Booking System**: Real-time booking with status management
- **Dashboard**: Separate dashboards for owners and admins
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: NestJS, TypeORM, MySQL
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Configuration

Create `.env` files:

**Backend** (.env):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=staylux
JWT_SECRET=your_secret
PORT=3001
```

### Running

```bash
# Start backend
cd backend
npm run start:dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

### Default Credentials

- Guest: guest@staylux.com / password123
- Owner: owner1@staylux.com / password123
- Admin: admin@staylux.com / password123

## Project Structure

```
webapp/
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   └── components/     # Reusable components
└── backend/           # NestJS API
    └── src/
        ├── auth/      # Authentication
        ├── users/      # User management
        ├── hotels/    # Hotel CRUD
        ├── bookings/  # Booking system
        └── packages/  # Travel packages
```

## API Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /hotels` - List hotels
- `POST /hotels` - Create hotel (owner)
- `GET /bookings` - List bookings
- `POST /bookings` - Create booking
- `GET /packages` - List packages
- `POST /packages` - Create package (owner)

## License

MIT