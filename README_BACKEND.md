# Backend Setup Instructions (XAMPP + MySQL)

This project now uses a local MySQL database via XAMPP to store "Friends & Family" data.

## Prerequisites
1.  **Install XAMPP**: Download and install XAMPP from [apachefriends.org](https://www.apachefriends.org/).
2.  **Node.js**: Ensure Node.js is installed.

## Database Setup
1.  Open **XAMPP Control Panel**.
2.  Start **Apache** and **MySQL** modules.
3.  Click **Admin** next to MySQL to open **phpMyAdmin** (or go to `http://localhost/phpmyadmin`).
4.  Click **New**, name the database `age_calculator`, and create it.
5.  Select the `age_calculator` database.
6.  Go to the **Import** tab.
7.  Choose the file `backend/schema.sql` from this project and click **Import**.
    *   *Alternatively, copy the content of `backend/schema.sql` and run it in the SQL tab.*

## Running the Backend
1.  Open a terminal in the project root.
2.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
3.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *The server will start on `http://localhost:5000`.*

## Running the Frontend
1.  Open a new terminal.
2.  Run the Vite dev server:
    ```bash
    npm run dev
    ```
