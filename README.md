# ResChat - Restaurant Chatbot

A real-time chatbot interface for ordering Nigerian cuisine, built with NextJS and Express

## Overview

ResChat is a conversational ordering system that allows customers to explore and order from a diverse menu of Nigerian dishes across different cultures (Yoruba, Hausa, Igbo, Igala, Ibra, and others). The system features real-time chat interactions, order management, and integrated payment processing.

## Features

- Real-time chat interface with natural language processing
- Interactive menu exploration and ordering
- Multi-cultural Nigerian cuisine categories
- Order customization with add-ons and options
- Order history tracking
- Real-time order status updates
- Integrated payment processing
- Device-based session management

## Tech Stack

### Frontend

- Next.js 15.3
- React 19
- TailwindCSS
- WebSocket (Socket.IO client)

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Socket.IO
- PayStack Payment Integration

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB
- PNPM package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/muhammadui/reschat.git
```

2. Install frontend dependencies:

```bash
pnpm install
```

3. Install backend dependencies:

```bash
cd api
pnpm install
```

4. Seed the database with menu items:

```bash
pnpm seed
```

5. Set up environment variables:
   Create `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_SOCKET_URL=http://localhost:5005
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

Create `.env` in api directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reschat
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

## Running the Application

1. Start MongoDB service:

```bash
mongod
```

2. Start the backend server:

```bash
cd api
pnpm dev
```

3. Start the frontend development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── api/                   # Backend server
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Express server
└── public/               # Static assets
```

## API Endpoints

- `POST /api/chat` - Send message to chatbot
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `POST /api/payments/initialize` - Initialize payment
- `POST /api/payments/verify` - Verify payment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- PayStack for payment processing
- MongoDB Atlas for database hosting
- Vercel for deployment

## Contact

Project Link: [https://github.com/muhammadui/reschat](https://github.com/muhammadui/reschat)
