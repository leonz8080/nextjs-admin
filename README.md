## Nextjs Admin

Nextjs Admin is a full-stack solution for a backend management system, employing the SSR (Server-Side Response) architecture. designed to allow developers to quickly develop their own backend management systems based on this template.

## 📦 Features

📂 The front-end interface uses tabbed mode to open and switch. Switching between tabs retains the input state of the previous tab.<br/>
🧱 The system provides server-side example code.<br/>
🏢 For demonstration purposes, SQLite is used as the database. It can be easily switched to other databases such as MySQL.<br/>
🎟️ The system has built-in access control functionality. On the front end, access can be controlled down to the page and specific areas within the page. On the server side, access can be controlled up to the request and its contents.<br/>
🌍 It supports multiple languages, and the languages ​​can be switched in real time.<br/>
⚙️ It aims to improve the reusability of components, using components with a consistent style within the same system, allowing developers to modify them according to their own needs.

## 📒 Directory Structure & Main document description

```plaintext
├── app/
│   ├── api/                 # backend interface（Next.js Route Handlers）
│   │   └──route.ts          # Backend request distribution and request access control
│   ├── main/                # Main interface module
│   ├── login/               # Login page
│   └── error-page/          # Error pages (403, 404, etc.)
├── components/              # Reusable components
│   ├── app/              
│   ├── common/              # General components
│   └── ui/                  # shadcn components
├── config/               
│   ├── easy-query.ts        # Simple query configuration              
│   ├── pages.ts             # Front-end page and permission configuration
│   ├── permission.ts        # Permission Definition
│   └── route.ts             # Server-side routing and permission configuration
├── constants/               
│   ├── country-codes.ts     # International telephone area code list              
│   ├── language.ts          # Multilingual configuration
│   └── timezones.ts         # Time zone list
├── hooks/                   # Custom Hooks
│   └── use-global-store.ts  # Front State Manager
├── lib/                     # Utility functions / Common logic
│   ├── client               # Front-end tools    
│   ├── server               # Server-side tools   
│   │   ├── global-cache.ts  # Server data caching
│   │   ├── jwt.ts           # Token generation and verification tool
│   │   └── time.ts          # Server time tool
│   └── models.ts            # Data model
├── public/                  
├── .env                   
└── middleware.ts
```

## 🧩 technology stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI
- next-intl
- Prisma
- ECharts
- Zustand
- node-cache (For demonstration purposes, this setup is only applicable to a single server and single process. For cluster deployment, it is recommended to use Redis instead.)

## 🚀 Getting Started

First, run the development server:

```bash
# Cloning project
git clone https://github.com/username/repo-name.git

# Enter the directory
cd repo-name

# Install dependencies
npm install

# Start the development environment
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
username: admin  password: 123456.

## 📜 License

MIT License