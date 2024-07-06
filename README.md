Certainly! Here's an updated version of the README with more attractive route descriptions:

---

# Next-Cloud

Next-Cloud is a cloud storage application built with Next.js, designed to provide seamless file and folder management capabilities.

## Features

- **Redirects:**
  - `/` redirects to `/app/home`.
  
- **Routes:**
  - **File and Folder Navigation:**
    - `/app/[parentId]`: Displays files and folders within the specified parent directory.
  - **Authentication:**
    - `/auth`: Handles user login and signup.
  - **Backend APIs:**
    - `/api`: Backend API routes for managing data.
      - **Authentication:**
        - `/api/auth/login`: Allows users to log in securely.
        - `/api/auth/signup`: Facilitates new user registration.
        - `/api/auth/token`: Manages JWT access and refresh tokens.
      - **Folder Management:**
        - `/api/folder`: CRUD operations for managing folders.
      - **File Management:**
        - `/api/file`: CRUD operations for managing files.
          - `/api/file/[fileId]`: Retrieves a specific file by ID.

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/anmolpaweriya/next-cloud.git
   cd next-cloud
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory with the following variables:
     ```
      DATABASE_URL=""
      ACCESS_TOKEN_SECRET=""
      REFRESH_TOKEN_SECRET=""
      ACCESS_TOKEN_EXPIRES_IN="10m"
      REFRESH_TOKEN_EXPIRES_IN="30d"
      type= "service_account"
      project_id= ""
      private_key_id= ""
      private_key= ""
      client_email= ""
      client_id= ""
      auth_uri= "https://accounts.google.com/o/oauth2/auth"
      token_uri= "https://oauth2.googleapis.com/token"
      auth_provider_x509_cert_url= "https://www.googleapis.com/oauth2/v1/certs"
      client_x509_cert_url= ""
      universe_domain="googleapis.com"
     ```

4. **Run the development server:**
   ```
   npm run dev
   ```

5. **Open in your browser:**
   Navigate to `http://localhost:3000` to see the application.

## Deployment

- Ensure to set up environment variables and securely manage secrets in production.
- Deploy using your preferred platform, ensuring all secrets are properly configured and managed.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This version highlights each route category clearly and provides a structured overview of the application's functionality. Adjustments can be made based on specific features or additional details you want to emphasize.