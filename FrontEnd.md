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

## Authentication

### Local-only fields

- handle local state eg) logged in or not, browser dark mode, youtube volume
- install Apollo GraphQL VSCode Extenstion just in case.

1. define local state

```ts
// apollo.ts
typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return false;
            },
          },
        },
      },
    },

// App.tsx
const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

function App() {
  const {
    data: { isLoggedIn },
  } = useQuery(IS_LOGGED_IN);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}
```

- but this is old way

2. reactive variable

```ts
// apollo.ts
// define local state
export const isLoggedInVar = makeVar(false);

// logged-in-router.tsx
// update local state
<button onClick={() => isLoggedInVar(false)}>Click to logout</button>;

// App.tsx
// substitute gql query by one line
const isLoggedIn = useReactiveVar(isLoggedInVar);
```

### React Hook Form

- By useForm gets register, watch, handleSubmit, errors
- By TS interface, handle errors

```ts
npm i react-hook-form

// logged-out-router.tsx
interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch());
  };
  const onInvalid = () => {
    console.log("Can't create account");
  };
  console.log(errors);
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            ref={register({
              required: "This is required",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            name="email"
            // type="email"
            placeholder="email"
          />
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="font-bold text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            ref={register({ required: true })}
            name="password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Login</button>
      </form>
    </div>
  );
};
```

## Router and @types

```
mkdir src/pages
touch src/pages/create-account.tsx
touch src/pages/login.tsx
```

1. intsall Definitly typed: TS library for Non-TS package

```
npm i --save-dev @types/react-router-dom
```

2. if 1. fails, declare module

```ts
// src/react-app-env.d.ts
declare module "react-router-dom";
```

## Tailwind gets started

```ts
export const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-3xl text-gray-800">Log In</h3>
        <form className="flex flex-col mt-5 px-5">
          <input
            placeholder="Email"
            className=" bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600 mb-3 py-3 px-5 rounded-lg"
          />
          <input
            placeholder="Password"
            className=" bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600 mb-3 py-3 px-5 rounded-lg"
          />
          <button className="py-3 px-5 bg-gray-800 text-white mt-3 text-lg rounded-lg focus:outline-none hover:opacity-9">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
```

### Login

- tailwind special => ring
- repetitive handler 1 => @apply

  ```css
  /* tailwind.css */
  .input {
    @apply bg-gray-100 shadow-inner focus:ring-2  focus:ring-green-600 focus:ring-opacity-90 focus:outline-none py-3 px-5 rounded-lg;
  }
  .btn {
    @apply py-3 px-5 bg-gray-800 text-white  text-lg rounded-lg focus:outline-none hover:opacity-90;
  }
  ```

  - => needs to restart

## Login Mutation

### repetitive handler 2 - form error component typescriptize

```ts
mkdir src/components
touch src/components/form-error.tsx

interface IFromErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFromErrorProps> = ({ errorMessage }) => (
  <span className="font-medium text-red-500">{errorMessage}</span>
);
...

// login.tsx
<FormError errorMessage={errors.password?.message} />
```

## Mutation

### execute Mutation

```ts
const LOGIN_MUTATION = gql`
  mutation PotatoMutation($email: String!, $password: String!) {
    login(input: {email: $email, password: $password}) {
      ok
      token
      error
    }
  }
`
...
const [loginMutation] = useMutation(LOGIN_MUTATION)

loginMutation({
      variables: {
        email,
        password
      }
    })
```

### Mutation needs type!

install apollo toolling

- Dto => Backend schema =apolloTooling> Frontend typechecker(`src/__generated__`)

```ts
npm i -g apollo && npm i apollo
// touch apollo.config.js
module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};

// login.tsx
const LOGIN_MUTATION = gql`
  mutation PotatoMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`;
...
const [loginMutation, { data }] = useMutation<PotatoMutation, PotatoMutationVariables>(LOGIN_MUTATION);
...
loginMutation({
      variables: {
        email,
        password,
      },
...
// package.json
"apollo:codegen": "apollo client:codegen src/__generated__ --target=typescript --outputFlat",
```

- We can also use inputTypes

```ts
const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
```

- Can handle data, `loading`, complete, error, even custom variables

```ts
const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
  loginMutation,
  loginMutationVariables
>(LOGIN_MUTATION, { onCompleted, onError });
```

### how to clean files

1.  `rf -rf`
2.  rimraf

```ts
npm i rimraf

// package.json
"apollo:codegen": "rimraf src/__generated__ && apollo client:codegen src/__generated__ --target=typescript --outputFlat",
"start": "npm run apollo:codegen & npm run tailwind:build & react-scripts start",
```
