import { rest } from "cypress/types/lodash";

describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation erros", () => {
    user.visit("/");
    user.findByText(/Create an Account/i).click();
    user.findByPlaceholderText(/email/i).type("non@good");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("non@good.com");
    user
      .findByPlaceholderText(/password/i)
      .type("A")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOuput",
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("real2@mail.com");
    user.findByPlaceholderText(/password/i).type("1212");
    user.findByRole("button").click();
    user.wait(1000); // 1s
    // @ts-ignore
    user.login("firstclient@gmail.com", "1212");
  });
});
