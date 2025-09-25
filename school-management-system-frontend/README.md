# 🏫 School Management System - Frontend

A modern, responsive school management system built with React, TypeScript, TailwindCSS, and Vite. Features a beautiful Neumorphism design and role-based access control.

## ✨ Features

### 🎯 Multi-Role Support
- **Admin**: Complete system management
- **Teacher**: Class and student management
- **Student**: View grades, attendance, and timetable
- **Parent**: Monitor child's progress
- **Accountant**: Financial management

### 🎨 Modern UI/UX
- Neumorphism design language
- Responsive layout for all devices
- Smooth animations and transitions
- Clean, intuitive interface

### 🔐 Authentication & Security
- Role-based access control
- Protected routes
- Secure authentication system
- Password management

### 📊 Core Modules
- **Dashboard**: Role-specific overview
- **Student Management**: Enrollment, profiles, bulk import
- **Staff Management**: Teacher profiles and assignments
- **Classes & Timetable**: Schedule management
- **Attendance**: Real-time tracking and reports
- **Grades**: Assessment and report cards
- **Fees**: Payment tracking and invoicing
- **Notices**: Announcements and documents
- **Reports**: Analytics and insights

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

Use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | teacher@school.com | password123 |
| Student | student@school.com | password123 |
| Parent | parent@school.com | password123 |
| Accountant | accountant@school.com | password123 |

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom Neumorphism components
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts (planned)
- **Date Handling**: date-fns
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components (Sidebar, Header)
├── contexts/           # React Context providers
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🎨 Design System

### Neumorphism Components
- `.neumorphism` - Standard elevated card
- `.neumorphism-inset` - Inset/pressed effect
- `.neumorphism-sm` - Small shadow variant
- `.neumorphism-lg` - Large shadow variant

### Custom Classes
- `.btn-neumorphism` - Neumorphic button style
- `.btn-primary` - Primary action button
- `.input-neumorphism` - Form input styling
- `.card-neumorphism` - Card container

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in appropriate directories
2. Add TypeScript interfaces in `src/types/`
3. Update routing in `App.tsx`
4. Add navigation items in `Sidebar.tsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Current Status

### ✅ Completed
- Project setup with Vite, React, TypeScript, TailwindCSS
- Authentication system with role-based access
- Responsive layout with Sidebar and Header
- Admin dashboard with statistics and activities
- Neumorphism design system
- Protected routing

### 🚧 In Progress
- Student management system
- Teacher management features
- Classes and timetable management

### 📋 Planned
- Attendance tracking
- Grades and assessments
- Fee management
- Notices and documents
- Reports and analytics
- Real-time notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using React, TypeScript, and TailwindCSS
