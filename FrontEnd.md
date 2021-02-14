# Nuber-eats Frontend

## pre-installation

```
npx create-react-app nuber-eats-frontend --template=typescript
cd nuber-eats-frontend
git remote add origin https://github.com/devgony/nuber-eats-frontend
npm run start
npm install tailwindcss
```

### Tailwind CSS

- utility-first CSS
- combine predefined css class
- can eliminate redundant classes for production
- predefined responsive
- can encapsulate classes with @apply at css file
- custom definition with more setup later
- postcss: post process like Sass , autoprefixer: competible prefix for other browser

```ts
npm i postcss autoprefixer
```

1. touch postcss.config.js

```ts
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

2. touch tailwind.config.js

extends to tailwind - create tailwind.config.js by cmd

```
npx tailwindcss init
```

3. touch src/styles/tailwind.css

postcss look tailwind.css, tailwind.config.js =convertTo>

```ts
@tailwind base;
@tailwind components;
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded;
}
@tailwind utilities;
```

4. (optional) @apply custom like above .btn

5. Build

```ts
// package.json
    "tailwind:build": "tailwind build ./src/styles/tailwind.css -o ./src/styles/styles.css",
```

6. import

```ts
// index.tsx
import "./styles/styles.css";
```

7. auto build

```ts
// package.json
    "start": "npm run tailwind:build & react-scripts start",
```

### Apollo Client

```ts
npm install @apollo/client graphql
// touch src/apollo.ts
export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// index.tsx
import { ApolloProvider } from "@apollo/client";
...
<ApolloProvider client={client}>
  <App />
</ApolloProvider>
```

- apollo client developer tools => can see docs
- introspection query => get whole schema

### Blueprint

setup => auth => creatAccount forms => state management => user => testing frontend => restaurant owner dashboard => driver subscription => map => user pages

### React Router Dom

```
npm install --save react-router-dom
mkdir src/routers
touch src/routers/logged-out-router.tsx
touch src/routers/logged-in-router.tsx
```

> Thanks to JSX transform, we don't need to import React at each subcomponents

- logged out
- logged in
- driver
- customer
- restaurant Owner
