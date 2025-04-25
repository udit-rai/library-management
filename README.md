# 📚 Library Management System (LMS)

The **Library Management System (LMS)** is a **powerful yet user-friendly web application** designed to streamline book reservations, member management, and search functionalities. Built using **Node.js, Express, and SQL**, this system ensures smooth interactions between library staff and users while maintaining security through authentication and authorization.

## 🎯 To-Do Tasks
- 🏹 **Security:** Salt Passwords, Implement Input Sanitization
- 🏹 **User Experience:** Make JS Pop-Ups of JSON Messages such as "Book is not available"

## ✨ Key Features
- ✅ **User Authentication:** Secure login system for members and admins.
- ✅ **Admin Dashboard:** Restricted admin panel with additional privileges.
- ✅ **Book Reservation System:** Users can browse, reserve, and return books seamlessly.
- ✅ **Advanced Search:** SQL-powered book search with Wikipedia integration for external references.
- ✅ **Member Management:** Add, remove, and update member records securely.
- ✅ **Book Management:** Admins can add, delete, and update book records dynamically.
- ✅ **Session-Based Security:** Prevent unauthorized access with session authentication.
- ✅ **Secure Login for Admins:** Multi-step authentication ensures higher security for administrators.
- ✅ **Anti Crawler Features:** Fake 404 messages on unauthenticated access attempts ensures higher security against automated tools.

## 🛠 Tech Stack
- 🔹 **Backend:** Node.js, Express.js
- 🔹 **Database:** Microsoft SQL Server (or MySQL)
- 🔹 **Authentication:** Express-session middleware
- 🔹 **Security:** Role-based authorization for admins
- 🔹 **Front-End:** EJS for dynamic page rendering

## 🚀 Setup & Deployment
1️⃣ **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/library-management.git
   ```

2️⃣ **Adjust values in dbconfig**


## 📷 Some Screenshots
![User_Login](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/login_page.png)
![Menu](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/lms_menu.png)
![Security_404_Function](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/POC_security_partone.png)
![Security_404_Function](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/POC_security_parttwo.png)
![Reserve_Books](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/reservebooks.png)
![Return_Books](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/returnbooks.png)
![Admin_Login](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/admin_login.png)
![Admin_Index](https://raw.githubusercontent.com/udit-rai/library-management/main/LMS%20Screens/admin_index.png)


