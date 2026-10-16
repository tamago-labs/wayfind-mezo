import { createEarnKitContext, exploreVaults } from "@circle-fin/earn-kit";

async function main() {
  const context = createEarnKitContext();

  const result = await exploreVaults(context, {
    chain: "Arc",
    sortBy: "apy",
  });

  console.log("=== Arc Mainnet Vaults ===\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
