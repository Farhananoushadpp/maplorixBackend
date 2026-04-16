# Maplorix Login Credentials

## Active Users Who Can Login

### 1. Admin User
- **Email**: `maplorixae@gmail.com`
- **Password**: `maplorixDXB`
- **Role**: `admin`
- **Access**: Full admin dashboard, all features

### 2. Regular Test User
- **Email**: `testuser@maplorix.com`
- **Password**: `password123`
- **Role**: `user`
- **Access**: Website features, job browsing, application submission

## User Registration

New users can register through the frontend registration form:
- Go to the registration page
- Fill in required details (name, email, password, phone)
- New users are created with `role: "user"` by default
- Registration creates both a Contact entry and User entry

## User Roles and Permissions

### Admin Role
- Full access to admin dashboard
- Can create, edit, delete jobs
- Can view and manage applications
- Can manage users
- Can view analytics

### User Role
- Can browse jobs
- Can submit applications
- Can manage their profile
- Can contact admin

## Login Status

- **Total Active Users**: 2
- **Admin Users**: 1
- **Regular Users**: 1
- **Inactive Users**: 30+ (cannot login)

## Testing Login

Use these credentials to test the login functionality:

1. **Admin Login Test**:
   - Email: `maplorixae@gmail.com`
   - Password: `maplorixDXB`
   - Expected: Redirect to `/admin/dashboard`

2. **User Login Test**:
   - Email: `testuser@maplorix.com`
   - Password: `password123`
   - Expected: Redirect to `/website`

## API Endpoints for Testing

- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Profile: `GET /api/auth/me`
- Jobs: `GET /api/jobs`
- Applications: `GET /api/applications` (admin only)

## Notes

- All passwords are hashed using bcrypt
- JWT tokens expire in 7 days
- Users must be `isActive: true` to login
- Default role for new registrations is `user`
