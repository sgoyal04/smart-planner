# Smart Planner 📅

A modern, full-stack calendar management application built with Next.js that allows users to create multiple profiles and manage events seamlessly across different contexts.

## 🚀 Features

- **Multi-Profile Management**: Create and manage multiple calendar profiles (Work, Personal, etc.)
- **Interactive Calendar**: Full-featured calendar interface with multiple view modes
- **Event Management**: Create, view, and organize events with detailed information
- **Secure Authentication**: Google OAuth integration for secure user login
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Real-time Updates**: Optimistic UI updates for smooth user experience

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **FullCalendar.js** - Interactive calendar component
- **shadcn/ui** - Modern UI component library

### Backend

- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js** - Authentication solution
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database

### Authentication & Security

- **Google OAuth** - Secure authentication provider
- **Session Management** - JWT-based session handling
- **Data Validation** - Comprehensive server-side validation

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- Google OAuth credentials
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/smart-planner.git
   cd smart-planner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/smart_planner"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses three main models:

- **User**: Stores user information from Google OAuth
- **Profile**: Different calendar contexts (Work, Personal, etc.)
- **Event**: Individual calendar events with timestamps and notes

```prisma
model User {
  id        String    @id @default(uuid())
  name      String?
  email     String    @unique
  profiles  Profile[]
  createdAt DateTime  @default(now())
}

model Profile {
  id     String  @id @default(uuid())
  name   String
  userId String
  User   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  events Event[]
}

model Event {
  id        String   @id @default(uuid())
  name      String
  startTime DateTime
  endTime   DateTime
  notes     String
  profileId String
  Profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
}
```

## 🚦 API Endpoints

### Profiles

- `GET /api/profiles` - Get user's profiles
- `POST /api/profiles` - Create new profile
- `DELETE /api/profiles` - Delete profile

### Events

- `GET /api/profiles/[id]/events` - Get events for a profile
- `POST /api/profiles/[id]/events` - Create new event

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

## 📱 Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Create Profiles**: Add different calendar contexts (Work, Personal, etc.)
3. **Switch Profiles**: Select different profiles from the left sidebar
4. **Create Events**: Click on any date to create a new event
5. **View Events**: Switch between month, week, day, and list views
6. **Manage Profiles**: Delete profiles using the three-dot menu

## 🔧 Development

### Project Structure

```
smart-planner/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── account/           # Protected pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Schedule.tsx      # Calendar component
│   ├── LeftToolbar.tsx   # Profile sidebar
│   └── Toolbar.tsx       # Header component
├── lib/                  # Utility libraries
├── prisma/              # Database schema and migrations
└── types/               # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [FullCalendar](https://fullcalendar.io/) - Calendar component
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution

---

**Built with ❤️ by [Your Name]**

For support or questions, please open an issue on GitHub.
