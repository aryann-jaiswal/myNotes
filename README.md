# MyNotes - Full-Stack Notes Application

A modern, responsive notes application built with React, TypeScript, Node.js, Express, and MongoDB. Users can create, edit, delete, and organize notes with tags and folders, with full authentication and search capabilities.

## Features

- 🔐 **User Authentication**: Secure signup/login with JWT tokens
- 📝 **Note Management**: Create, edit, delete, and pin notes
- 🏷️ **Organization**: Organize notes with tags and folders
- 🔍 **Search**: Full-text search across notes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS
- 🔒 **Security**: Password hashing, rate limiting, and input validation
- 📊 **Pagination**: Efficient loading of large note collections

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API requests
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Date-fns** for date formatting

### Backend

- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Zod** for schema validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## Project Structure

```
myNotes/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static files
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd myNotes
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Database Setup

Make sure MongoDB is running. You can use:

- **Local MongoDB**: Install and run locally
- **MongoDB Atlas**: Use cloud MongoDB service
- **Docker**: Run MongoDB in a container

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mynotes

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Notes

- `GET /api/notes` - Get all notes (with pagination and filters)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search` - Search notes
- `GET /api/notes/folders` - Get all folders
- `GET /api/notes/tags` - Get all tags

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Notes**: Click "New Note" to create your first note
3. **Organize**: Add tags and folders to organize your notes
4. **Search**: Use the search bar to find specific notes
5. **Filter**: Use filters to view notes by folder or tags
6. **Pin**: Pin important notes to keep them at the top
7. **Edit/Delete**: Use the action buttons on each note card

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
```

### Frontend Development

```bash
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## Deployment

### Backend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `NODE_ENV`: `production`
4. Configure MongoDB Atlas:
   - Go to Network Access
   - Add "Allow Access from Anywhere" (`0.0.0.0/0`)
5. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.vercel.app`)
4. Set build command: `npm run build`
5. Deploy

### Environment Variables Summary

**Backend (Vercel):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mynotes?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Frontend (Vercel):**

```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Zod
- Rate limiting
- CORS protection
- Security headers with Helmet
- SQL injection prevention (MongoDB)
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact the development team.
