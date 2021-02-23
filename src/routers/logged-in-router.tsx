import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";

// Route should not be with fragment <></>, instead, use []
const ClientRoutes = [
  <Route key={1} path="/" exact>
    <Restaurants />
  </Route>,
  <Route key={2} path="/confirm" exact>
    <ConfirmEmail />
  </Route>,
  <Route key={3} path="/edit-profile" exact>
    <EditProfile />
  </Route>,
  <Route key={4} path="/search" exact>
    <Search />
  </Route>,
  <Route key={5} path="/category/:slug" exact>
    <Category />
  </Route>,
  <Route key={6} path="/restaurant/:id" exact>
    <Restaurant />
  </Route>,
];

const clientRoutes = [
  {
    path: "",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurant/:id",
    component: <Restaurant />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
];

const restaurantRoutes = [{ path: "/", component: <MyRestaurants /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
