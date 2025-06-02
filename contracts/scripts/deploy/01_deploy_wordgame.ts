import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`\n🔄 Deploying to ${network.name}...`);

  // Verify private key is loaded
  if (!deployer) throw new Error("Deployer account not found!");
  console.log(`📡 Deployer: ${deployer}`);

  // Get ethers instance
  const ethers = hre.ethers;

  // Check CELO balance
  const balance: bigint = await ethers.provider.getBalance(deployer);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} CELO`);

  const minBalance: bigint = ethers.parseEther("0.5");
  if (balance < minBalance) {
    throw new Error("Insufficient balance (< 0.5 CELO)");
  }

  // Real-time gas price check
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  if (!gasPrice) throw new Error("Gas price not available");
  
  // Calculate premium gas price (20% higher)
  const premiumGasPrice = gasPrice * 120n / 100n;
  console.log(`⛽ Current Gas Price: ${ethers.formatUnits(premiumGasPrice, "gwei")} gwei (with 20% premium)`);

  // Force fresh deployment
  console.log("🚀 Launching deployment...");
  const result = await deploy("CeloWordGame", {
    from: deployer,
    args: [],
    log: true,
    // Convert bigint to string to satisfy type requirements
    gasPrice: premiumGasPrice.toString(), // CRITICAL FIX HERE
    waitConfirmations: network.name === "celo" ? 3 : 1,
  });

  if (result.newlyDeployed) {
    console.log(`✅ Success! Contract deployed to: ${result.address}`);
    console.log(`🔗 Explorer: https://explorer.celo.org/mainnet/address/${result.address}`);
  } else {
    console.log("♻️ Using existing contract at:", result.address);
  }
};

func.tags = ["CeloWordGame"];
export default func;