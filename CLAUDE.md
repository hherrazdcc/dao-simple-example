# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hardhat 3 Beta blockchain development project for Ethereum smart contract development. It uses:
- **Hardhat 3 Beta** as the development environment
- **Solidity 0.8.28** for smart contracts
- **TypeScript** with ES modules (type: "module")
- **Mocha** for TypeScript integration tests
- **ethers.js v6** for Ethereum interactions
- **Foundry-compatible tests** using forge-std for Solidity unit tests
- **Hardhat Ignition** for contract deployment

## Development Commands

### Testing

Run all tests (both Solidity and Mocha):
```bash
npx hardhat test
```

Run only Solidity tests (Foundry-compatible):
```bash
npx hardhat test solidity
```

Run only Mocha tests (TypeScript integration tests):
```bash
npx hardhat test mocha
```

### Deployment

Deploy to local simulated chain:
```bash
npx hardhat ignition deploy ignition/modules/Counter.ts
```

Deploy to Sepolia testnet (requires SEPOLIA_PRIVATE_KEY config variable):
```bash
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```

Set deployment credentials using hardhat-keystore:
```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

## Architecture

### Configuration

**Hardhat Configuration** ([hardhat.config.ts](hardhat.config.ts)):
- Uses the `@nomicfoundation/hardhat-toolbox-mocha-ethers` plugin
- Two Solidity compiler profiles:
  - `default`: Solidity 0.8.28 without optimization
  - `production`: Solidity 0.8.28 with optimizer enabled (200 runs)
- Three network configurations:
  - `hardhatMainnet`: Local L1 simulated network using EDR
  - `hardhatOp`: Local Optimism (OP) simulated network
  - `sepolia`: Sepolia testnet (requires SEPOLIA_RPC_URL and SEPOLIA_PRIVATE_KEY config variables)

### Project Structure

- **contracts/**: Solidity smart contracts
  - `*.sol`: Main contract files
  - `*.t.sol`: Foundry-compatible Solidity test files
- **test/**: TypeScript integration tests using Mocha and ethers.js
- **ignition/modules/**: Hardhat Ignition deployment modules
- **scripts/**: Utility scripts (e.g., OP network examples)

### Testing Strategy

This project uses a dual testing approach:

1. **Solidity Unit Tests** ([contracts/Counter.t.sol](contracts/Counter.t.sol)):
   - Foundry-compatible tests using forge-std
   - Inherit from `Test` contract
   - Use `setUp()` for test initialization
   - Support fuzz testing with `testFuzz_*` naming convention
   - Use `vm.expectRevert()` for testing reverts
   - Run with `npx hardhat test solidity`

2. **TypeScript Integration Tests** ([test/Counter.ts](test/Counter.ts)):
   - Use Mocha + Chai + ethers.js
   - Connect to network using `await network.connect()`
   - Focus on event emission, state changes, and complex interactions
   - Can query historical events using `queryFilter()`
   - Run with `npx hardhat test mocha`

### Deployment Modules

**Ignition Modules** (in [ignition/modules/](ignition/modules/)):
- Use `buildModule()` from `@nomicfoundation/hardhat-ignition/modules`
- Define contracts with `m.contract("ContractName")`
- Can call contract functions after deployment with `m.call()`
- Return deployed contracts for use in other modules

### Network Connection Pattern

For scripts and tests that need network access:
```typescript
import { network } from "hardhat";
const { ethers } = await network.connect();
```

For specific networks (e.g., OP mainnet simulation):
```typescript
const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});
```

## Important Notes

- This project uses **ES modules** (type: "module" in package.json), so use `import` statements, not `require()`
- TypeScript config targets **Node 16** module resolution with ES2022 target
- When creating new Ignition modules, follow the pattern in [Counter.ts](ignition/modules/Counter.ts), not [MiToken.ts](ignition/modules/MiToken.ts) which contains syntax errors
- Solidity contracts should use `pragma solidity ^0.8.28`
- Use `forge-std` imports for Solidity tests: `import {Test} from "forge-std/Test.sol"`