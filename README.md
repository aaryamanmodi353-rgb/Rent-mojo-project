# 🏠 Rent Mojo - Premium Furniture & Appliance Rental Platform


**Rent Mojo** is a full-stack e-commerce application designed to solve the problem of high upfront costs for furniture and appliances. Built with the **MERN Stack**, it features a seamless rental process, secure authentication, and a robust admin dashboard for inventory management.

## 🌟 Key Features

### 🛒 User Features
* **Dynamic Catalog:** Browse furniture and appliances with real-time stock availability.
* **Smart Cart System:** Add items, view monthly rent totals, and calculate security deposits.
* **Flexible Tenures:** Choose rental plans for 3, 6, or 12 months.
* **Secure Checkout:** User-friendly checkout flow with address validation.
* **My Orders:** Track active rentals, delivery dates, and return statuses.

### 🛠 Admin Features
* **Dashboard Analytics:** View total revenue (MRR), active orders, and inventory stats.
* **Inventory Management:** Full **CRUD** capabilities (Add, Edit, Delete products) directly from the UI.
* **Order Oversight:** Monitor all user rentals and update delivery statuses.

---

## 💻 Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | ⚛️ React.js, Tailwind CSS, React-Hot-Toast, Context API |
| **Backend** | 🟢 Node.js, Express.js, RESTful API |
| **Database** | 🍃 MongoDB Atlas (Cloud NoSQL) |
| **Auth** | 🔐 JWT (JSON Web Tokens), Bcrypt.js |
| **DevOps** | ☁️ Render, Git, GitHub |

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/aaryamanmodi353-rgb/Rent-mojo-project.git](https://github.com/aaryamanmodi353-rgb/Rent-mojo-project.git)
cd Rent-mojo-project
2️⃣ Install DependenciesInstall packages for both the backend (root) and frontend (client).Bash# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
3️⃣ Environment VariablesCreate a .env file in the root directory and add the following:Code snippetPORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secure_string_here
NODE_ENV=development
4️⃣ Seed the DatabasePopulate your database with initial products.Bashnpm run seed
5️⃣ Run the AppRun both backend and frontend concurrently.Bashnpm run dev
