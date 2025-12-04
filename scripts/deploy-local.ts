import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect();

async function main() {
    console.log("\n🚀 DESPLEGANDO DAO EN TESTNET LOCAL");
    console.log("=".repeat(70));

    // Obtener cuentas
    const [deployer, voter1, voter2, voter3] = await ethers.getSigners();

    console.log("\n📋 Información de Cuentas:");
    console.log(`Deployer: ${await deployer.getAddress()}`);
    console.log(`Voter1:   ${await voter1.getAddress()}`);
    console.log(`Voter2:   ${await voter2.getAddress()}`);
    console.log(`Voter3:   ${await voter3.getAddress()}`);

    // 1. Desplegar GovernanceToken
    console.log("\n🪙 Desplegando GovernanceToken...");
    const TokenFactory = await ethers.getContractFactory("GovernanceToken");
    const token = await TokenFactory.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`✓ Token desplegado en: ${tokenAddress}`);

    // 2. Desplegar SimpleDAO
    console.log("\n🏛️  Desplegando SimpleDAO...");
    const DAOFactory = await ethers.getContractFactory("SimpleDAO");
    const dao = await DAOFactory.deploy(tokenAddress);
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log(`✓ DAO desplegado en: ${daoAddress}`);

    // 3. Distribuir tokens
    console.log("\n💰 Distribuyendo tokens...");
    await token.transfer(await voter1.getAddress(), ethers.parseEther("500"));
    console.log("✓ Voter1: 500 DCT");

    await token.transfer(await voter2.getAddress(), ethers.parseEther("300"));
    console.log("✓ Voter2: 300 DCT");

    await token.transfer(await voter3.getAddress(), ethers.parseEther("200"));
    console.log("✓ Voter3: 200 DCT");

    // 4. Crear propuestas de ejemplo
    console.log("\n📝 Creando propuestas de ejemplo...");
    await dao.createProposal("Aumentar presupuesto de desarrollo en 50%");
    console.log("✓ Propuesta #1 creada");

    await dao.createProposal("Contratar 2 desarrolladores senior");
    console.log("✓ Propuesta #2 creada");

    await dao.createProposal("Lanzar campaña de marketing");
    console.log("✓ Propuesta #3 creada");

    // 5. Guardar información para el frontend
    console.log("\n💾 Guardando configuración para frontend...");

    const deploymentInfo = {
        network: "localhost",
        chainId: 31337,
        contracts: {
            GovernanceToken: {
                address: tokenAddress,
                abi: TokenFactory.interface.formatJson()
            },
            SimpleDAO: {
                address: daoAddress,
                abi: DAOFactory.interface.formatJson()
            }
        },
        accounts: {
            deployer: await deployer.getAddress(),
            voter1: await voter1.getAddress(),
            voter2: await voter2.getAddress(),
            voter3: await voter3.getAddress()
        },
        tokenDistribution: {
            voter1: "500",
            voter2: "300",
            voter3: "200"
        },
        rpcUrl: "http://127.0.0.1:8545"
    };

    // Crear directorio si no existe
    const deploymentsDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    // Guardar archivo JSON
    const deploymentPath = path.join(deploymentsDir, "localhost.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✓ Configuración guardada en: ${deploymentPath}`);

    // Guardar ABIs por separado para facilitar el uso
    const abiDir = path.join(deploymentsDir, "abis");
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir);
    }

    fs.writeFileSync(
        path.join(abiDir, "GovernanceToken.json"),
        TokenFactory.interface.formatJson()
    );
    fs.writeFileSync(
        path.join(abiDir, "SimpleDAO.json"),
        DAOFactory.interface.formatJson()
    );
    console.log(`✓ ABIs guardados en: ${abiDir}`);

    // Resumen final
    console.log("\n" + "=".repeat(70));
    console.log("✅ DEPLOYMENT COMPLETADO");
    console.log("=".repeat(70));
    console.log("\n📍 Direcciones de Contratos:");
    console.log(`   Token: ${tokenAddress}`);
    console.log(`   DAO:   ${daoAddress}`);
    console.log("\n🌐 Red Local:");
    console.log(`   RPC URL: http://127.0.0.1:8545`);
    console.log(`   Chain ID: 31337`);
    console.log("\n📂 Archivos Generados:");
    console.log(`   ${deploymentPath}`);
    console.log(`   ${path.join(abiDir, "GovernanceToken.json")}`);
    console.log(`   ${path.join(abiDir, "SimpleDAO.json")}`);
    console.log("\n💡 Próximo paso: Conectar MetaMask a http://127.0.0.1:8545");
    console.log("=".repeat(70) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });