# Drug Use Prevention Support System

Cấu trúc dự án (Monorepo):

```
your-project-repo/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── .gitignore
├── README.md
└── package.json (optional, cho các script tổng quát)
```

- `frontend/`: Chứa mã nguồn giao diện người dùng (React/Vite).
- `backend/`: Chứa mã nguồn backend (Spring Boot, sẽ thêm sau).

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
