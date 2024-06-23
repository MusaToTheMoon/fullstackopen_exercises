For some reason, if I run the json-server, the react dev server doesn't run unless I first manually remove a certain directory:
'''bash
Remove-Item -Recurse -Force 'M:\.socials\FullStackOpen\fullstackopen_exercises\part2\phonebook\node_modules\.vite\deps'
'''

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
