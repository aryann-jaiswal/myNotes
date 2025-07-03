#!/bin/bash

echo "🚀 Setting up MyNotes - Full Stack Notes Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your MongoDB connection string and JWT secret"
fi

# Build TypeScript
echo "Building backend..."
npm run build

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your MongoDB connection string and JWT secret"
echo "2. Start MongoDB (local or cloud)"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "🌐 Backend will run on: http://localhost:5000"
echo "🌐 Frontend will run on: http://localhost:3000"
echo ""
echo "Happy coding! 🎉" 