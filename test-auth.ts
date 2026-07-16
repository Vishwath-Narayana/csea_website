import { auth } from "./packages/auth/src/index.ts";
async function test() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "test_admin@example.com",
        password: "password123",
        name: "Test Admin"
      }
    });
    console.log("Success", res);
  } catch (err) {
    console.error("Error", err);
  }
}
test();
