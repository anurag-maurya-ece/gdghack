import { readFile } from "node:fs/promises";
import { initializeTestEnvironment, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const env = await initializeTestEnvironment({ projectId: "demo-tech-thela", firestore: { host: "127.0.0.1", port: 8080, rules: await readFile("firestore.rules", "utf8") } });
try {
  for (const context of [env.unauthenticatedContext(), env.authenticatedContext("rule-test-user")]) {
    const ref = doc(context.firestore(), "private", "test");
    await assertFails(getDoc(ref));
    await assertFails(setDoc(ref, { value: "forbidden" }));
  }
  console.log("PASS: unauthenticated and authenticated clients cannot read or write unspecified collections");
} finally { await env.cleanup(); }
