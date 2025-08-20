# RollRite Backend API

## Setup Instructions

### 1. Database Setup
1. Install PostgreSQL and create a database named `rollrite`
2. Run the SQL schema from `database-schema.sql` in pgAdmin or your PostgreSQL client
3. The schema includes sample bowling balls and oil patterns

### 2. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the database connection settings:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rollrite
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Balls
- `GET /api/balls` - Get all bowling balls
- `POST /api/balls/recommendations` - Get ball recommendations (requires auth)

### Oil Patterns
- `GET /api/patterns` - Get all oil patterns
- `GET /api/patterns/:id` - Get specific pattern
- `POST /api/patterns` - Create custom pattern (requires auth)

### Users
- `GET /api/users/:userId/arsenal` - Get user's ball arsenal (requires auth)
- `POST /api/users/:userId/arsenal` - Add ball to arsenal (requires auth)
- `POST /api/users/:userId/performance` - Log performance data (requires auth)
- `GET /api/users/:userId/performance` - Get performance stats (requires auth)
- `GET /api/users/:userId/performance/trends` - Get performance trends (requires auth)

## Database Schema

The database includes the following main tables:
- `users` - User accounts and bowling specifications
- `balls` - Bowling ball database with specifications
- `oil_patterns` - Oil pattern library (PBA, WTBA, Kegel, Custom)
- `arsenal` - User's bowling ball collection
- `performance_logs` - Game performance tracking
- `surface_history` - Ball surface change history
- `ball_usage` - Ball usage statistics

## Features

### Ball Recommendation Algorithm
The recommendation system uses a scoring algorithm that considers:
- Hook fit based on bowler specs and oil pattern
- Pattern length modifiers
- Surface compatibility
- Layout considerations

### Performance Tracking
- Game scores and statistics
- Carry percentage tracking
- Entry angle measurements
- Annual performance reports

### Arsenal Management
- Ball inventory tracking
- Surface change history
- Usage statistics
- Layout information

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation