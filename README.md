# Job Portal

## Overview
The Job Portal is a web application designed to connect job seekers with employers. It features user authentication, job posting and listing capabilities, application management, and a responsive user interface.

## Features
- **User Roles**: Supports different user roles including Admin, Job Seeker, and Employer.
- **Authentication**: Secure login and registration for users.
- **Job Management**: Admins can post, edit, and delete job listings.
- **Job Listings**: Users can view available job postings and filter them based on various criteria.
- **Application Management**: Job seekers can apply for jobs and track their application status.
- **Responsive Design**: The application is designed to be mobile-friendly and accessible on various devices.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (or any other database of choice)

## Project Structure
```
Job_Portal
├── client
│   ├── public
│   ├── src
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Setup Instructions

### Client
1. Navigate to the `client` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Server
1. Navigate to the `server` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node server.js
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.