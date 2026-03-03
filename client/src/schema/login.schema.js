import { z } from 'zod';

const loginSchema = z.object({
  // Email: Must be valid email with @
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address - must contain @'),
  
  // Password: Just check if it exists (no complexity check on login)
  password: z
    .string()
    .min(1, 'Password is required'),
});

export default loginSchema;