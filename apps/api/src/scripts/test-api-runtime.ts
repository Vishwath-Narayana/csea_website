import { db } from "@csea/database";
import { sessions, users } from "@csea/database/src/schema/auth";
import { eq } from "drizzle-orm";

async function runTests() {
  const email = "admin@csea.kitsw.ac.in";
  const password = "Password123";
  const baseUrl = "http://localhost:3001";

  console.log("=== RUNTIME VERIFICATION START ===");

  // 1. Login test
  console.log("\n1. Testing Login...");
  const loginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log(`Login HTTP Status: ${loginRes.status}`);
  if (loginRes.status !== 200) {
    throw new Error(`Login failed with status ${loginRes.status}`);
  }

  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get("set-cookie");
  console.log("Login User:", JSON.stringify(loginData.user));
  console.log("Login Session ID:", loginData.session.id);
  console.log("Returned Cookie exists:", !!setCookie);

  // Extract session token from cookie
  const cookieValue = setCookie?.split(";")[0] || "";
  console.log("Session Cookie:", cookieValue);

  // Verify session exists in DB
  const dbSession = await db.query.sessions.findFirst({
    where: eq(sessions.id, loginData.session.id),
  });
  console.log("Session in DB exists:", !!dbSession);

  // 2. Call Protected Route /api/v1/admin/test
  console.log("\n2. Calling protected /api/v1/admin/test...");
  const testRes = await fetch(`${baseUrl}/api/v1/admin/test`, {
    headers: { Cookie: cookieValue },
  });
  console.log(`Protected Route HTTP Status: ${testRes.status}`);
  const testData = await testRes.json();
  console.log("Protected Route Response:", JSON.stringify(testData));

  // 3. Call protected role route with SUPER_ADMIN
  console.log("\n3. Calling role-test as SUPER_ADMIN...");
  const roleTestRes = await fetch(`${baseUrl}/api/v1/admin/role-test`, {
    headers: { Cookie: cookieValue },
  });
  console.log(`Role Test HTTP Status: ${roleTestRes.status}`);
  const roleTestData = await roleTestRes.json();
  console.log("Role Test Response:", JSON.stringify(roleTestData));

  // 4. Test 403 Forbidden using EDITOR user
  console.log("\n4. Testing 403 Forbidden with EDITOR...");
  const editorLoginRes = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "editor@csea.kitsw.ac.in", password }),
  });
  const editorCookie = editorLoginRes.headers.get("set-cookie")?.split(";")[0] || "";
  
  const editorRoleTestRes = await fetch(`${baseUrl}/api/v1/admin/role-test`, {
    headers: { Cookie: editorCookie },
  });
  console.log(`Editor Role Test HTTP Status: ${editorRoleTestRes.status}`);
  const editorRoleTestData = await editorRoleTestRes.json();
  console.log("Editor Role Test Response (expected 403):", JSON.stringify(editorRoleTestData));

  // 5. Test 401 Unauthorized
  console.log("\n5. Testing 401 Unauthorized...");
  const unauthRes = await fetch(`${baseUrl}/api/v1/admin/test`);
  console.log(`Unauthenticated HTTP Status: ${unauthRes.status}`);
  const unauthData = await unauthRes.json();
  console.log("Unauthenticated Response (expected 401):", JSON.stringify(unauthData));

  // 6. Test Logout
  console.log("\n6. Testing Logout...");
  const logoutRes = await fetch(`${baseUrl}/api/auth/sign-out`, {
    method: "POST",
    headers: { Cookie: cookieValue },
  });
  console.log(`Logout HTTP Status: ${logoutRes.status}`);

  // Verify session deleted in DB
  const dbSessionAfter = await db.query.sessions.findFirst({
    where: eq(sessions.id, loginData.session.id),
  });
  console.log("Session in DB exists after logout:", !!dbSessionAfter);

  // Request again with old cookie
  const reuseRes = await fetch(`${baseUrl}/api/v1/admin/test`, {
    headers: { Cookie: cookieValue },
  });
  console.log(`Reused Cookie HTTP Status: ${reuseRes.status}`);
  const reuseData = await reuseRes.json();
  console.log("Reused Cookie Response (expected 401):", JSON.stringify(reuseData));

  console.log("\n=== RUNTIME VERIFICATION COMPLETE ===");
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
