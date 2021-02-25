import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IForm {
  name: string;
  price: number;
  description: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [createDishMutation, { loading }] = useMutation(CREATE_DISH_MUTATION, {
    //   refetchQueries: [{query: MY}]
  });
  const { register, handleSubmit, formState, getValues } = useForm<IForm>({
    mode: "onChange",
  });
  const onSubmit = () => {
    const {} = getValues();
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: "Description is required." })}
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  );
};
