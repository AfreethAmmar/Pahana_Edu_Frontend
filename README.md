# Pahana Educational Bookshop Management System

A modern React-based web application for managing educational bookshop operations, built with React 18, Tailwind CSS, and modern best practices.

## Features

### 🔐 Authentication & Authorization
- Session-based authentication with JSESSIONID cookie
- Role-based access control (ADMIN, USER, CUSTOMER, CASHIER)
- Secure login/logout functionality
- Protected routes with automatic redirects

### 📊 Dashboard
- Real-time statistics cards (Total Products, Low Stock, Customers, Revenue)
- Product category distribution charts
- Recent activity feed
- Quick action buttons for common tasks

### 📚 Product Management
- Comprehensive inventory management for books and stationary
- Advanced search and filtering capabilities
- Grid/List view toggle for products
- Stock level indicators with color coding
- Bulk operations (update, delete)
- Low stock alerts and notifications

### 👥 User Management
- Customer registration and management
- Cashier account management (Admin only)
- User listing with role badges
- Edit/deactivate user capabilities

### 📱 Responsive Design
- Mobile-first approach with responsive layouts
- Touch-friendly interface
- Optimized for tablets and desktop
- Mobile hamburger menu navigation

## Tech Stack

- **Frontend Framework:** React 18 with functional components and hooks
- **Styling:** Tailwind CSS for utility-first styling
- **Routing:** React Router v6 for navigation
- **State Management:** Context API for global state
- **HTTP Client:** Axios for API communication
- **Forms:** React Hook Form for form handling and validation
- **Charts:** Recharts for data visualization
- **Icons:** React Icons for consistent iconography
- **Notifications:** React Hot Toast for user feedback

## Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components (Header, Sidebar, etc.)
│   ├── ui/                  # Reusable UI components
│   ├── auth/                # Authentication forms
│   ├── products/            # Product management components
│   ├── users/               # User management components
│   └── dashboard/           # Dashboard components
├── pages/                   # Page components
├── hooks/                   # Custom React hooks
├── services/                # API service functions
├── context/                 # React context providers
├── utils/                   # Utility functions and constants
└── App.jsx                  # Main application component
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running on `http://localhost:8081`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

### Demo Credentials

- **Username:** admin
- **Password:** password

## API Integration

The application integrates with a Java-based backend API:

- **Base URL:** `http://localhost:8081/Mega_City_Cab_Service_App_war_exploded`
- **Authentication:** Session-based with JSESSIONID cookie
- **Data Format:** JSON

### Key API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/products` - Fetch products
- `POST /api/products` - Create new product
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/users/customers` - Customer management

## Features in Detail

### Product Management

#### Books
- **Genres:** Story, Novel, Action, Educational, Comics, Biography
- **Fields:** Title, Author, ISBN, Price, Quantity, Description
- **Features:** Genre filtering, author search, stock management

#### Stationary
- **Types:** Pens, Pencils, Notebooks, Erasers, Rulers, Files
- **Fields:** Name, Brand, Type, Price, Quantity, Description
- **Features:** Type filtering, brand search, bulk operations

### Stock Management
- **Low Stock Threshold:** 5 items
- **Status Indicators:** In Stock (green), Low Stock (amber), Out of Stock (red)
- **Alerts:** Real-time notifications for low stock items
- **Bulk Updates:** Update multiple items simultaneously

### User Roles & Permissions

| Feature | Admin | User | Cashier | Customer |
|---------|-------|------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| Products | ✅ | ✅ | ✅ | ❌ |
| Add/Edit Products | ✅ | ✅ | ❌ | ❌ |
| Customer Management | ✅ | ❌ | ✅ | ❌ |
| Cashier Management | ✅ | ❌ | ❌ | ❌ |

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow component composition patterns
- Implement proper error boundaries
- Use TypeScript-style prop validation

### Performance
- Implement lazy loading for large lists
- Use debounced search functionality
- Memoize expensive calculations
- Optimize bundle size with code splitting

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management

### Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API calls
- E2E test scenarios

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your web server

3. Configure your web server to serve the React app and proxy API calls

## Contributing

1. Follow the established coding patterns
2. Add appropriate tests for new features
3. Ensure responsive design principles
4. Update documentation as needed

## License

This project is proprietary software for Pahana Educational Bookshop.

## Support

For technical support or feature requests, please contact the development team.