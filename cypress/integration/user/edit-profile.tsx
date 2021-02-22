describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    user.login("real2@mail.com", "1212");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000);
    user.title().should("eq", "Edit Profile | Nuber Eats");
  });
  it("can change eamil", () => {
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("real3@mail.com");
    user.findByRole("button").click();
  });
});
