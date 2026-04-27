import { body, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: errors.array() 
    });
  }
  next();
};

// Validation rules for registration
export const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['jobseeker', 'company', 'admin'])
    .withMessage('Role must be jobseeker, company, or admin'),
  
  // Job seeker specific validation
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  // Company specific validation
  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name is required for company accounts'),
  
  validate,
];

// Validation rules for login
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate,
];

// Validation rules for job creation
export const validateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('salary')
    .trim()
    .notEmpty()
    .withMessage('Salary is required'),
  
  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience requirement is required'),
  
  body('type')
    .optional()
    .isIn(['Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site'])
    .withMessage('Invalid job type'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  validate,
];

// Validation rules for job application
export const validateApplication = [
  body('jobId')
    .notEmpty()
    .withMessage('Job ID is required')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('applicantName')
    .trim()
    .notEmpty()
    .withMessage('Applicant name is required'),
  
  body('applicantEmail')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('resume')
    .notEmpty()
    .withMessage('Resume is required')
    .trim(),
  
  body('coverLetter')
    .optional()
    .trim(),
  
  body('phone')
    .optional()
    .trim(),
  
  validate,
];