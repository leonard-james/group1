# 📌 Web Systems and Technologies Final Project

For our final project in **Web Systems and Technologies**, our team created an interactive, fully responsive web application using **Next.js**, **Tailwind CSS**, and **ShadCN UI**.

This project served as a hands-on implementation of our skills in **frontend development**, **API integration**, and **data visualization**. Using the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), we fetched and displayed user, post, and comment data. We enhanced user profiles with **Mapbox** for geographic mapping and integrated **ApexCharts** to visualize application data in real time.

---

## 🛠️ Development Highlights

- **Framework & Styling**: Built using Next.js (App Router) with Tailwind CSS for styling.
- **UI Components**: Used ShadCN UI to create reusable components like buttons, cards, sidebars, pagination, and charts.
- **Data Fetching**: Implemented React Query for efficient API data handling.
- **Maps**: Integrated the Google Maps API via `@react-google-maps/api`.
- **Data Visualization**: Real-time data rendered using ApexCharts.
- **Deployment**: Deployed to the web using [Vercel](https://vercel.com/).

---

## ⚙️ Installation & Setup

### 🔧 Requirements

- Node.js (v18+)
- npm (v9+)
- Git

### 📦 Setup Steps

```bash
# Create a new Next.js app
npx create-next-app@latest webtech-final-project
cd webtech-final-project

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize ShadCN UI
npx shadcn-ui@latest init

# Add necessary UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add chart
npx shadcn-ui@latest add sidebar

# Install additional libraries
npm install @tanstack/react-query
npm install apexcharts react-apexcharts
npm install @react-google-maps/api

npm run dev       # Start development server
npm run build     # Build the application
npm start         # Start production server

👥 Team Contributions
Team Member	Contribution
Shannel L. Regala	Initiated the project and developed page functionality
Davilyn E. Genetia	Designed the user interface using Tailwind CSS
Jasmine Mary P. Ginete	Implemented user authentication features
Evelyn E. Bangate	Managed deployment and ensured the website’s functionality

🌐 Live Demo
🔗 Deployed on Vercel: https://viewpoint-sage.vercel.app/

