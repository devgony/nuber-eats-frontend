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

> VSCode Extension > Tailwind CSS IntelliSense

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

2. `reactive variable` for local state

```ts
// apollo.ts
// define local state
export const isLoggedInVar = makeVar(false);
...
isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
...

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
// error for gql client not backend, like wrong url, request invalid
```

- by !loading, prevent duplicated login try

```ts
const onSubmit = () => {
    if (!loading) {
...
```

### how to clean files

1.  `rf -rf`
2.  `rimraf`

```ts
npm i rimraf

// package.json
"apollo:codegen": "rimraf src/__generated__ && apollo client:codegen src/__generated__ --target=typescript --outputFlat",
"start": "npm run apollo:codegen & npm run tailwind:build & react-scripts start",
```

## UI Cloning

```
mkdir src/images
download to src/images/logo.svg
```

- media query eg) for large screen: `lg:mt-28`
- mobile(smaller) first always
- extra palette

```ts
// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
```

- disable state for button

  - use `formState.isValid`
  - `mode: onChange`: whenever it changes, check to validate, `onBlur`: focus and out (default mode of formState is `onSubmit`)
  - create Button component

  ```ts
  // touch src/components/button.tsx
  interface IButtonProps {
    canClick: boolean;
    loading: boolean;
    actionText: string;
  }

  export const Button: React.FC<IButtonProps> = ({
    canClick,
    loading,
    actionText,
  }) => (
    <button
      className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors; ${
        canClick
          ? "bg-lime-600 hover:bg-lime-700"
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
  ```

## React helmet - create account

```
npm i react-helmet
npm i --save-dev @types/react-helmet
```

- change title with Helmet

```ts
// login.tsx
<Helmet>
  <title>Login | Nuber Eats</title>
</Helmet>
```

## CreateAccount

- $createAccountInput gets even UserRole from backend
- onCompleted => useHistory to redirect to login
- email regexp from http://emailregex.com/

## Token

### Token to reactive var

```ts
// apollo.ts
const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token)); // flase
export const authToken = makeVar(token); // null
```

### Save token

```ts
// login.tsx
localStorage.setItem(LOCALSTORAGE_TOKEN, token); // save to localStorage
authToken(token); // save to localState by Reactive Variable
```

### For constancy

```ts
//touch src/constants.ts
export const LOCALSTORAGE_TOKEN = "nuber-token";
```

### Handle helmet warning

```ts
npm i react-helmet-async

// login.tsx, create-account.tsx
import Helmet from "react-helmet"; => import { Helmet } from "react-helmet-async";

// index.tsx
<HelmetProvider>
        <App />
</HelmetProvider>
```

### Send Token

```ts
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});
...
  link: authLink.concat(httpLink),
...
```

## Routers and 404s

```
mkdir src/pages/client
touch src/pages/client/restaurants.tsx
touch src/pages/404.tsx
```

- `404NotFound`: when logged out, wront route shows error, Link to '/'
  - put NotFound at the end of Router of logged-out-route.tsx
- `Route` in Switch should not be with fragment <></>, instead, use []
- `Redirect`: if there is no no route, go to~ (can use specific `from`)

## Header

```
touch src/components/header.tsx
```

- `py-4` means vertical padding 1rem

### font awesome

- https://fontawesome.com/icons?d=gallery

```ts
npm i --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome

// header.tsx
<FontAwesomeIcon icon={faUser} className="text-xl" />
```

## Repeated Hooks intead of props

- if child is too deep, how to pass props? => create hook and call Repeatedly => from 2nd, it gets from cache not api

```ts
mkdir src/hooks
// touch src/hooks/useMe.tsx
const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};

// header.tsx
const { data } = useMe();
```

### Redirect => NotFound is better

### Give key={1} to each Route to remove error

## Veryfy Email

- how to convert 127.0.0.1 => localhost?
  http://localhost:3000/confirm?code=3d134846-4d69-4652-ab96-628febd121a4

```ts
mkdir src/pages/user/
// touch src/pages/user/confirm-email.tsx
...
const [_, code] = window.location.href.split("code=");
...

// logged-in-router.tsx
<Route key={2} path="/confirm" exact>
  <ConfirmEmail />
</Route>,
```

## Write to cache - writeFragment

- Fragment is part of type(whole module)
- need `id` to find
- `fragment anyName on Type { keyToModify }`

```ts
// confirm-email.tsx
const { data: userData } = useMe();
const client = useApolloClient();
const onCompleted = (data: verifyEmail) => {
  const {
    verifyEmail: { ok },
  } = data;
  if (ok && userData?.me.id) {
    client.writeFragment({
      id: `User:${userData.me.id}`,
      fragment: gql`
        fragment VerifiedUser on User {
          verified
        }
      `,
      data: {
        verified: true,
      },
    });
  }
};
```

## Edit Profile

```
touch src/pages/user/edit-profile.tsx
```

- To edit profile, we edit a few => type should be nullable => handle null at backend => save works for only edited data
- Don't use empty pw, it should be null!

```ts
input: {
          email,
          ...(password !== "" && { password }),
        },
```

> ### writeFragment vs Refetch

- Right after edit email, verified should be false

#### writeFragment

- Manually edit cache with `writeFragment` right after updating backend

  => Fater performance

#### Refetch

- Safer than `writeFragment` but slower especially if front and backend is separated

```ts
const { data: userData, refetch } = useMe();
...
    await refetch();
```

## Restaurant

- RESTAURANTS_QUERY needs input: page
- tailwind!

### Search bar

- if user enter, send him to there? => use `form` instead of `div`

### coverImg with url

### Group hover

- `group-hover` groups other elems, assign target by `group`

````ts
<div className="flex flex-col group items-center cursor-pointer">
  <div className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full">
                  ```
````

> ### Handling by padding is way better than measuring size

- tailwind gap => gap-x-5 gap-y-10

### if frontend gets null? => suspect eager: true

### Create component

```
> touch src/components/restaurant.tsx
```

#### Way to separate component - write ugly code first, think and clean later

1. Write skeleton of interface and component
2. Copy previous code to new component
3. According to shown error, assign interface

## Pagenation

- page state will call query again as soon as it changes
- if want to align page arrows(&rarr;) at all cases, create empty `div`

## Search

- when gives interface to useFrom, set the name of refered elem equal to variable name of interface

1. send to /search

```ts
const onSerachSubmit = () => {
  const { searchTerm } = getValues();
  history.push({
    pathname: "/search",
    search: `term=${searchTerm}`,
  });
};
```

- push `state` instead of `search` when don't want to put term on url

2. create search page

```ts
> touch src/pages/client/search.tsx
```

3. Handle Search exceptions

- what if user delete term at url?

  - => redirect to "/"
  - history.replace: don't show at history api => don't need to save wrong page

- > create common fragments

```ts
//> touch src/fragments.ts
export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`;

// search.tsx
const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

// apollo.config.js
    includes: ["./src/**/*.{tsx,ts}"],
```

- Lazy Query:
  - query is basically called when pages loaded
  - `Lazy Query` will be triggered when it's specifically called like `Mutation`
  ```ts
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  ```

## Category

- create page

```
> touch src/pages/client/category.tsx
```

- how to get variable at Route

```ts
// restaurants.tsx
<Link to={`/category/${category.slug}`}>
...

// logged-in-router.tsx
<Route key={5} path="/category/:slug" exact>
```

- useLocation VS useParams

  - useLocation: can get search? query
  - useParams: better to get Params

    - useParams returns empty obj => create custom type with interface

    ```ts
    interface ICategoryParams {
      slug: string;
    }

    export const Category = () => {
      const params = useParams<ICategoryParams>();
    ```

- create another fragment `CategoryParts`
- handle key warning => give the key to the top parent element
- totalResults: null?

## Code Challenge - create search and category page

## Restaurant Detail

```
> touch src/pages/client/restaurant.tsx
```

- create restaurant page
- onClick from restaurants => Restaurant Detail
- do vertical size by padding (py) for bg-div, hy for elems

## Testing React Components

### jest setup

- no ejection?

```
// package.json
"test:coverage": "npm test -- --coverage --watchAll=false"
...
"jest": {
  "collectCoverageFrom": [
    "./src/components/**/*.tsx",
    "./src/pages/**/*.tsx",
    "./src/routers/**/*.tsx"
  ]
}

mv src/App.tsx src/components/app.tsx
rm src/App.test.tsx
```

### Test component from the point of User view

```ts
mkdir src/components/__tests__/
touch src/components/__tests__/app.spec.tsx

import { render } from "@testing-library/react";
```

### ApolloProvider error? => mock each Router by jest.mock

### Login error? => use reactive variable covered by waitFor

- when we change the state: need to waitFor

```ts
import { render, waitFor } from "@testing-library/react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<Appl />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    getByText("logged-out");
  });
  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("logged-in");
  });
});
```

### button test

```
touch src/components/__tests__/button.spec.tsx

// package.json
    "test": "react-scripts test --verbose",
```

#### Test only output for user not the implementation of code => there can be some lines we can't test 100%

#### conditional ? => rerender

```ts
describe("<Button />", () => {
  it("should render OK with props", () => {
    const { debug, getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");
    debug();
    rerender(<Button canClick={true} loading={true} actionText={"test"} />);
    debug();
    getByText("Loading...");
  });
});
```

#### But better to separate than rerender

#### Use container to test child's class

```ts
expect(container.firstChild).toHaveClass("pointer-events-none");
```

### FormError

```
touch src/components/__tests__/form-error.spec.tsx
```

### Restaurant

```
touch src/components/__tests__/restaurant.spec.tsx
```

#### if component is enclosed by Router, mock as well

#### Link => anchor is the first element => use container

```ts
expect(container.firstChild).toHaveAttribute("href", "/restaurant/1");
```

#### props as a variable => more robust

### header

```
touch src/components/__tests__/header.spec.tsx
```

#### Apollo MockedProvider => Mock gql request not the hook

1. import MockedProvider
2. mocks quest and result
3. Promise setTimeout for request
4. waitFor the changed state

```js
it("renders verify banner", async () => {
  await waitFor(async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: false,
                },
              },
            },
          },
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    getByText("Please verify your email.");
  });
});
```

#### getByText will fail if it can't find => queryBytext is going to return null

```ts
expect(queryByText("Please verify your email.")).toBeNull;
```

### 404.tsx

```
touch src/components/__tests__/404.spec.tsx
```

#### Test title by Helmet

```ts
await waitFor(() => {
  expect(document.title).toBe("Not Found | Nuber Eats");
});
```

### login.tsx

```
touch src/components/__tests__/login.spec.tsx
```

#### Testinng Mutation with MockProvider can not be inspected as a function (input validation, the number of mutation...) => `Mock Apollo Client`

```
npm install --save-dev mock-apollo-client
```

#### Set Helmet, Router

#### useForm change state => enclose with `waitFor`

- Warning: An update to Login inside a test was not wrapped in act(...).

#### repetitive => use `beforeEach` and get `RenderResult`

#### use `getByRole` to get `errorMessage`

1. set role

```ts
// form-error.tsx
  <span role="alert" className="font-medium text-red-500">

// button.tsx
<button
    role="button"
```

2. getByRole

```ts
let errorMessage = getByRole("alert");
const submitBtn = getByRole("button");
```

#### Test Mutation?

1. share variable `mockedClient`

```ts
let mockedClient: MockApolloClient;
mockedClient = createMockClient();
```

2. send request

```ts
const mockedMutationResponse = jest.fn().mockResolvedValue({
  data: {
    login: {
      ok: true,
      token: "XXX",
      error: null,
    },
  },
});
mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
```

#### hard to test - function inside of component: Implementation

```ts
const onSubmit = () => {
  if (!loading) {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  }
};
```

#### Summary => hard of #18.7 Login Tests part Three

### create-account.tsx

```
touch src/components/__tests__/create-account.spec.tsx
```

#### Create our own renderer

```ts
// touch src/test-utils.tsx

import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <Router>{children}</Router>
    </HelmetProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
```

#### Substitute with custum `render` and re-exported method from `test-utils` => adjust to all spec.tsx files

```ts
// create-account.spec.tsx
import { render, RenderResult, waitFor } from "../../test-utils";
```

#### window.alert error => spyOn

### Mocking hooks (library) !

```ts
const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});
...
    expect(mockPush).toHaveBeenCalledWith("/");
...
afterAll(() => {
    jest.clearAllMocks();
});
```

## E2E Test

### install Cypress - window, mac, linux

```ts
npm i cypress
rm -rf cypress/integration/examples
// touch cypress/tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": ["cypress"],
    "outDir": "#"
  },
  "include": ["./**/*.*"]
}

// touch cypress/integration/first-test.ts
describe("First Test", () => {
  it("should go to homepage", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "Login | Nuber Eats");
  });
});

npx cypress open
```
