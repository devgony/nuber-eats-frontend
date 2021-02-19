import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";
import searchNotFoundImg from "../../images/searchNotFoundImg.svg";

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

export const Search = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPreviousPageClick = () => setPage((current) => current - 1);
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    setSearchTerm(query);
    if (!query) {
      return history.replace("/");
    }
    // query exists now, callQuery!
    callQuery({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location, page]);
  console.log(searchTerm);
  return (
    <div>
      <Helmet>
        <title>Search | NuberEats</title>
      </Helmet>
      {!loading &&
        (data?.searchRestaurant.totalResults === 0 ? (
          <div className="flex justify-center items-center py-20 ">
            <div className="flex flex-col justify-between items-center h-96">
              <img className="w-48" src={searchNotFoundImg} alt="Nuber Eats" />
              <h1 className="text-3xl">
                We didn’t find a match for "{searchTerm}"
              </h1>
              <h1 className="text-gray-500">
                Try searching for something else instead
              </h1>
              <div className="grid max-w-screen-sm gap-3  w-full ">
                <Link to="/" className="grid max-w-screen-sm gap-3  w-full  ">
                  <Button
                    loading={false}
                    canClick={true}
                    actionText={"Go back to Home"}
                  />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h1 className="text-4xl pt-4 font-serif">"{searchTerm}"</h1>
              <h2 className="text-xs pt-2">
                {data?.searchRestaurant.totalResults} Restaurants
              </h2>
            </div>
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.searchRestaurant.restaurants?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {page > 1 ? (
                <button
                  onClick={onPreviousPageClick}
                  className="focus:outline-none font-medium text-xl"
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              <span>
                Page {page} of {data?.searchRestaurant.totalPages}
              </span>
              {page !== data?.searchRestaurant.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className="focus:outline-none font-medium text-xl"
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
