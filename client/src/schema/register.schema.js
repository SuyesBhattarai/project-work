import { z } from 'zod';

const registerSchema = z.object({
  // Full Name: Only letters and spaces, no numbers
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters (no numbers allowed)'),
  
  // Email: Must contain @ and be valid email
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address - must contain @'),
  
  // Phone Number: Exactly 10 digits only
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits (e.g., 9876543210)'),
  
  // Password: Must have uppercase, lowercase, number, special character
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      'Password must contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&#)'
    ),
  
  // Confirm Password: Must match password
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  // Role: Must be either user or hostel_owner
  role: z.enum(['user', 'hostel_owner'], {
    required_error: 'Please select a role',
    invalid_type_error: 'Please select a valid role',
  }),
  
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default registerSchema;