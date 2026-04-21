// Test script to check Figma API rate limit headers
// Run with: node test-figma-api.js "https://www.figma.com/design/...?...node-id=..."

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || "YOUR_FIGMA_TOKEN_HERE";
const FIGMA_URL = process.argv.slice(2).join(" ") || process.env.FIGMA_URL;

function normalizeFigmaUrl(input) {
  return input
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\\s*/g, "")
    .replace(/\s+/g, "");
}

function parseFigmaNodeUrl(input) {
  if (!input) {
    throw new Error(
      "Missing Figma URL. Pass it as the first argument or set FIGMA_URL.",
    );
  }

  const parsedUrl = new URL(normalizeFigmaUrl(input));
  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
  const designIndex = pathSegments.indexOf("design");
  const fileIndex = pathSegments.indexOf("file");
  const fileKeyIndex = designIndex >= 0 ? designIndex + 1 : fileIndex + 1;

  if (fileKeyIndex <= 0 || !pathSegments[fileKeyIndex]) {
    throw new Error(
      "Could not read the file key from the Figma URL. Expected a /design/:fileKey/... or /file/:fileKey/... URL.",
    );
  }

  const nodeId =
    parsedUrl.searchParams.get("node-id") ||
    parsedUrl.searchParams.get("node_id") ||
    new URLSearchParams(parsedUrl.hash.replace(/^#/, "")).get("node-id");

  if (!nodeId) {
    throw new Error(
      "Could not find node-id in the Figma URL query string or hash fragment.",
    );
  }

  return {
    fileKey: pathSegments[fileKeyIndex],
    nodeId: nodeId.replace(/-/g, ":"),
  };
}

async function testFigmaAPI() {
  const { fileKey, nodeId } = parseFigmaNodeUrl(FIGMA_URL);
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;

  console.log("Making request to Figma API...");
  console.log("URL:", url);
  console.log("");

  try {
    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    });

    console.log("=== Response Status ===");
    console.log("Status:", response.status, response.statusText);
    console.log("");

    console.log("=== Response Headers ===");
    for (const [key, value] of response.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log("");

    // Specifically check for rate limit headers
    console.log("=== Rate Limit Info ===");
    console.log(
      "Retry-After:",
      response.headers.get("retry-after") || "Not present",
    );
    console.log(
      "X-Figma-Plan-Tier:",
      response.headers.get("x-figma-plan-tier") || "Not present",
    );
    console.log(
      "X-Figma-Rate-Limit-Type:",
      response.headers.get("x-figma-rate-limit-type") || "Not present",
    );
    console.log(
      "X-Figma-Upgrade-Link:",
      response.headers.get("x-figma-upgrade-link") || "Not present",
    );
    console.log("");

    if (response.ok) {
      const data = await response.json();
      console.log("=== Success! ===");
      console.log("Response data:", JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log("=== Error Response ===");
      console.log(errorText);
    }
  } catch (error) {
    console.error("=== Fetch Error ===");
    console.error(error.message);
  }
}

testFigmaAPI();
