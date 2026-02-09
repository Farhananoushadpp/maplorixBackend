# Maplorix Backend API

A comprehensive backend API for the Maplorix Job Consultancy website, built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality

- **Job Management**: Create, read, update, and delete job listings
- **Contact Form**: Handle contact form submissions with email notifications
- **Job Applications**: Process resume uploads and job applications
- **Authentication**: JWT-based authentication with role-based permissions
- **File Uploads**: Secure resume file handling with validation
- **Email Notifications**: Automated email responses for contacts and applications

### Advanced Features

- **Role-Based Access Control**: Different permissions for admin, HR, recruiter, and manager roles
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with detailed error messages
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security**: Helmet.js for security headers, CORS configuration
- **Logging**: Morgan logging for development environment
- **File Management**: Multer for secure file uploads with size limits

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/change-password` - Change user password

### Jobs

- `GET /api/jobs` - Get all jobs with filtering and pagination
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/:id` - Get single job by ID
- `POST /api/jobs` - Create new job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)
- `GET /api/jobs/stats` - Get job statistics (protected)

### Contacts

- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (protected)
- `GET /api/contacts/:id` - Get single contact (protected)
- `PUT /api/contacts/:id` - Update contact (protected)
- `POST /api/contacts/:id/notes` - Add note to contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)
- `GET /api/contacts/stats` - Get contact statistics (protected)

### Applications

- `POST /api/applications` - Submit comprehensive job application with resume
- `GET /api/applications` - Get all applications with advanced filtering (protected)
- `GET /api/applications/:id` - Get single application (protected)
- `PUT /api/applications/:id` - Update application status and details (protected)
- `DELETE /api/applications/:id` - Delete application (protected)
- `GET /api/applications/:id/resume` - Download resume (protected)
- `GET /api/applications/stats` - Get application statistics (protected)

#### Application Fields

- **Personal**: fullName, email, phone, location, gender, dateOfBirth, nationality
- **Professional**: jobRole, experience, skills, currentCompany, currentDesignation
- **Salary**: expectedSalary (min/max/currency), salaryNegotiable
- **Availability**: noticePeriod, availability, expectedStartDate, relocation, remoteWork
- **Authorization**: workAuthorization
- **Profiles**: linkedinProfile, portfolio, github, website
- **Education**: education array (degree, institution, field, years, grade)
- **Work History**: workHistory array (company, position, dates, description)
- **Certifications**: certifications array (name, issuer, dates, credentials)
- **References**: references array (contact details)
- **Languages**: languages array (language, proficiency)
- **Other**: coverLetter, source

### System

- `GET /` - API root with endpoint information
- `GET /health` - Health check endpoint

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Nodemailer** - Email sending
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Compression** - Response compression
- **Rate Limiting** - API rate limiting

## 📁 Project Structure

```
maplorixBackend/
├── controllers/         # MVC Controllers (Business Logic)
│   ├── authController.js    # Authentication controller
│   ├── jobController.js      # Job management controller
│   ├── contactController.js # Contact form controller
│   └── applicationController.js # Application controller
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
├── models/              # Mongoose models (Data Layer)
│   ├── User.js          # User model
│   ├── Job.js           # Job model
│   ├── Contact.js       # Contact model
│   └── Application.js   # Application model
├── routes/              # API routes (Presentation Layer)
│   ├── auth.js          # Authentication routes
│   ├── jobs.js          # Job management routes
│   ├── contacts.js      # Contact form routes
│   └── applications.js  # Application routes
├── services/            # Business services
│   └── emailService.js  # Email service utilities
├── uploads/             # File upload directory
│   └── resumes/         # Resume files
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── README.md            # Project documentation
└── server.js            # Main server file (Entry Point)
```

### MVC Architecture Pattern

The backend follows the Model-View-Controller (MVC) architectural pattern:

- **Models** (`models/`): Define the data structure and database schema
- **Views**: Not applicable in REST API (responses are JSON)
- **Controllers** (`controllers/`): Handle business logic and request processing
- **Routes** (`routes/`): Define API endpoints and route to controllers
- **Services** (`services/`): Reusable business logic and external integrations
- **Middleware** (`middleware/`): Request processing middleware

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd maplorixBackend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/maplorix
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=info@maplorix.com
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**

   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Start the server**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify installation**
   - Open your browser and navigate to `http://localhost:4000`
   - You should see the API root endpoint with available endpoints
   - Check health endpoint: `http://localhost:4000/health`

## 📝 Available Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/api/auth/login`
2. **Receive Token**: Get JWT token in response
3. **Use Token**: Include token in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### User Roles and Permissions

- **Admin**: Full access to all resources
- **HR**: Can manage jobs, applications, and contacts
- **Recruiter**: Can create/update jobs and view applications
- **Manager**: Can view jobs, applications, and analytics

## 📧 Email Configuration

The API sends emails for:

- Contact form submissions
- Job application confirmations
- Interview invitations

To enable emails:

1. Set up email service provider (Gmail, SendGrid, etc.)
2. Configure environment variables:
   - `EMAIL_HOST`: SMTP server host
   - `EMAIL_PORT`: SMTP server port
   - `EMAIL_USER`: Email username
   - `EMAIL_PASS`: Email password or app password
   - `EMAIL_FROM`: From email address

## 📊 API Usage Examples

### Get Jobs with Filtering

```bash
curl "http://localhost:4000/api/jobs?page=1&limit=10&category=Technology&type=Full-time"
```

### Submit Contact Form

```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Inquiry",
    "message": "I am interested in your services"
  }'
```

### Submit Job Application

```bash
curl -X POST http://localhost:4000/api/applications \
  -H "Content-Type: multipart/form-data" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+1234567890" \
  -F "location=New York" \
  -F "jobRole=Software Developer" \
  -F "experience=Mid Level" \
  -F "skills=JavaScript, React, Node.js" \
  -F "currentCompany=Tech Corp" \
  -F "currentDesignation=Senior Developer" \
  -F "expectedSalary={\"min\": 80000, \"max\": 120000, \"currency\": \"USD\"}" \
  -F "noticePeriod=30 days" \
  -F "job=507f1f77bcf86cd799439011" \
  -F "coverLetter=I am excited to apply..." \
  -F "linkedinProfile=https://linkedin.com/in/johndoe" \
  -F "portfolio=https://johndoe.dev" \
  -F "github=https://github.com/johndoe" \
  -F "website=https://johndoe.com" \
  -F "source=website" \
  -F "gender=male" \
  -F "dateOfBirth=1990-01-01" \
  -F "nationality=American" \
  -F "workAuthorization=citizen" \
  -F "availability=2-weeks" \
  -F "salaryNegotiable=true" \
  -F "relocation=true" \
  -F "remoteWork=true" \
  -F "resume=@/path/to/resume.pdf"
```

## 🔧 Development

### Adding New Endpoints

1. Create route file in `/routes/`
2. Add middleware and validation
3. Update main server.js to include route
4. Add tests if needed

### Database Models

All models are in `/models/` directory with:

- Schema definitions
- Validation rules
- Virtual fields
- Pre-save hooks
- Indexes for performance

### Error Handling

Centralized error handling in `server.js`:

- Validation errors
- Authentication errors
- Database errors
- File upload errors

## 📈 Performance

- **Database Indexes**: Optimized queries with proper indexes
- **Compression**: Response compression for faster transfers
- **Rate Limiting**: Prevent abuse with configurable limits
- **File Upload Limits**: Secure file handling with size restrictions
- **Caching**: Ready for Redis integration if needed

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper cross-origin resource sharing
- **Security Headers**: Helmet.js for security best practices
- **Rate Limiting**: Prevent brute force attacks
- **File Upload Security**: Type and size validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **JWT Token Error**
   - Check JWT_SECRET in `.env`
   - Ensure token is not expired
   - Verify token format in Authorization header

3. **Email Sending Error**
   - Verify email configuration
   - Check SMTP credentials
   - Ensure app password for Gmail

4. **File Upload Error**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure allowed file types

### Debug Mode

Set `NODE_ENV=development` for detailed logging and error messages.

## 📞 Support

For support or questions:

- Email: info@maplorix.com
- Phone: +1 (555) 123-4567

## 📄 License

This project is proprietary to Maplorix. All rights reserved.

---

**Maplorix Backend API** - Connecting Talent with Opportunity

Built with ❤️ using Node.js, Express, and MongoDB
