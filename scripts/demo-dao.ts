import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
    console.log("\n🏛️  DEMO INTERACTIVA: SISTEMA DAO CON TOKENS DE GOBERNANZA");
    console.log("=" .repeat(70));

    // 1. SETUP: Desplegar contratos
    console.log("\n📦 FASE 1: DESPLIEGUE DE CONTRATOS");
    console.log("-".repeat(70));

    const [owner, alice, bob, charlie] = await ethers.getSigners();

    console.log("\n👥 Cuentas disponibles:");
    console.log(`   Owner:   ${await owner.getAddress()}`);
    console.log(`   Alice:   ${await alice.getAddress()}`);
    console.log(`   Bob:     ${await bob.getAddress()}`);
    console.log(`   Charlie: ${await charlie.getAddress()}`);

    console.log("\n🪙 Desplegando GovernanceToken...");
    const TokenFactory = await ethers.getContractFactory("GovernanceToken");
    const token = await TokenFactory.deploy();
    console.log(`   ✓ Token desplegado en: ${await token.getAddress()}`);
    console.log(`   ✓ Nombre: ${await token.name()}`);
    console.log(`   ✓ Símbolo: ${await token.symbol()}`);

    console.log("\n🏛️  Desplegando SimpleDAO...");
    const DAOFactory = await ethers.getContractFactory("SimpleDAO");
    const dao = await DAOFactory.deploy(await token.getAddress());
    console.log(`   ✓ DAO desplegado en: ${await dao.getAddress()}`);

    // 2. DISTRIBUCIÓN DE TOKENS
    console.log("\n\n💰 FASE 2: DISTRIBUCIÓN DE TOKENS");
    console.log("-".repeat(70));

    const initialBalance = await token.balanceOf(await owner.getAddress());
    console.log(`\nBalance inicial del Owner: ${ethers.formatEther(initialBalance)} DCT`);

    console.log("\n📤 Distribuyendo tokens a los votantes...");
    await token.transfer(await alice.getAddress(), ethers.parseEther("500"));
    console.log("   ✓ Alice recibió 500 DCT");

    await token.transfer(await bob.getAddress(), ethers.parseEther("300"));
    console.log("   ✓ Bob recibió 300 DCT");

    await token.transfer(await charlie.getAddress(), ethers.parseEther("200"));
    console.log("   ✓ Charlie recibió 200 DCT");

    console.log("\n📊 Balances finales:");
    const aliceBalance = await token.balanceOf(await alice.getAddress());
    const bobBalance = await token.balanceOf(await bob.getAddress());
    const charlieBalance = await token.balanceOf(await charlie.getAddress());

    console.log(`   Alice:   ${ethers.formatEther(aliceBalance)} DCT (50% del poder de voto)`);
    console.log(`   Bob:     ${ethers.formatEther(bobBalance)} DCT (30% del poder de voto)`);
    console.log(`   Charlie: ${ethers.formatEther(charlieBalance)} DCT (20% del poder de voto)`);
    console.log(`   Total distribuido: ${ethers.formatEther(aliceBalance + bobBalance + charlieBalance)} DCT`);

    // 3. CREAR PROPUESTAS
    console.log("\n\n📝 FASE 3: CREACIÓN DE PROPUESTAS");
    console.log("-".repeat(70));

    console.log("\n✍️  Creando propuestas...");
    await dao.createProposal("Aumentar presupuesto de desarrollo en 50%");
    console.log("   ✓ Propuesta #1 creada");

    await dao.createProposal("Contratar 2 desarrolladores senior");
    console.log("   ✓ Propuesta #2 creada");

    await dao.createProposal("Lanzar campaña de marketing en redes sociales");
    console.log("   ✓ Propuesta #3 creada");

    console.log("\n📋 Propuestas activas:");
    for (let i = 1; i <= 3; i++) {
        const prop = await dao.getProposal(i);
        console.log(`\n   Propuesta #${i}:`);
        console.log(`   └─ Descripción: "${prop[0]}"`);
        console.log(`   └─ Votos: ${ethers.formatEther(prop[1])} DCT`);
        console.log(`   └─ Ejecutada: ${prop[2] ? "Sí" : "No"}`);
    }

    // 4. PROCESO DE VOTACIÓN
    console.log("\n\n🗳️  FASE 4: PROCESO DE VOTACIÓN");
    console.log("-".repeat(70));

    console.log("\n📊 Escenario: Votación en Propuesta #1");
    console.log("\n🙋 Alice (500 DCT) vota a favor...");
    await dao.connect(alice).vote(1);
    let prop1 = await dao.getProposal(1);
    console.log(`   ✓ Voto registrado - Votos acumulados: ${ethers.formatEther(prop1[1])} DCT`);

    console.log("\n🙋 Bob (300 DCT) vota a favor...");
    await dao.connect(bob).vote(1);
    prop1 = await dao.getProposal(1);
    console.log(`   ✓ Voto registrado - Votos acumulados: ${ethers.formatEther(prop1[1])} DCT`);

    console.log("\n📈 Resultado Propuesta #1:");
    console.log(`   Total de votos: ${ethers.formatEther(prop1[1])} DCT (80% del poder de voto)`);

    console.log("\n\n📊 Escenario: Votación en Propuesta #2");
    console.log("\n🙋 Charlie (200 DCT) vota a favor...");
    await dao.connect(charlie).vote(2);
    let prop2 = await dao.getProposal(2);
    console.log(`   ✓ Voto registrado - Votos acumulados: ${ethers.formatEther(prop2[1])} DCT`);

    console.log("\n📈 Resultado Propuesta #2:");
    console.log(`   Total de votos: ${ethers.formatEther(prop2[1])} DCT (20% del poder de voto)`);

    // 5. INTENTAR VOTO DUPLICADO (FALLARÁ)
    console.log("\n\n❌ FASE 5: PRUEBA DE SEGURIDAD - VOTO DUPLICADO");
    console.log("-".repeat(70));

    console.log("\n🚫 Intentando que Alice vote dos veces en la Propuesta #1...");
    try {
        await dao.connect(alice).vote(1);
        console.log("   ❌ ERROR: El voto duplicado debería haber sido rechazado!");
    } catch (error: any) {
        console.log("   ✓ Voto duplicado bloqueado correctamente");
        console.log(`   └─ Razón: ${error.message.includes("Ya has votado") ? "Ya has votado esta propuesta" : "Error de contrato"}`);
    }

    // 6. INTENTAR VOTAR SIN TOKENS (FALLARÁ)
    console.log("\n\n❌ FASE 6: PRUEBA DE SEGURIDAD - VOTO SIN TOKENS");
    console.log("-".repeat(70));

    const [,,,,noTokenUser] = await ethers.getSigners();
    const noTokenBalance = await token.balanceOf(await noTokenUser.getAddress());
    console.log(`\n📊 Usuario sin tokens: ${await noTokenUser.getAddress()}`);
    console.log(`   Balance: ${ethers.formatEther(noTokenBalance)} DCT`);

    console.log("\n🚫 Intentando votar sin tokens...");
    try {
        await dao.connect(noTokenUser).vote(3);
        console.log("   ❌ ERROR: El voto sin tokens debería haber sido rechazado!");
    } catch (error: any) {
        console.log("   ✓ Voto sin tokens bloqueado correctamente");
        console.log(`   └─ Razón: ${error.message.includes("No tienes tokens") ? "No tienes tokens para votar" : "Error de contrato"}`);
    }

    // 7. RESUMEN FINAL
    console.log("\n\n📊 RESUMEN FINAL DEL SISTEMA DAO");
    console.log("=".repeat(70));

    console.log("\n🏛️  Estado de las Propuestas:\n");
    for (let i = 1; i <= 3; i++) {
        const prop = await dao.getProposal(i);
        const voteCount = ethers.formatEther(prop[1]);
        const totalTokens = 1000; // Total distribuido
        const percentage = (parseFloat(voteCount) / totalTokens * 100).toFixed(1);

        console.log(`   Propuesta #${i}:`);
        console.log(`   ├─ "${prop[0]}"`);
        console.log(`   ├─ Votos: ${voteCount} DCT (${percentage}% del total)`);
        console.log(`   └─ Estado: ${prop[2] ? "Ejecutada" : "Activa"}`);
        console.log("");
    }

    console.log("💡 Métricas del Sistema:");
    console.log(`   ├─ Total de propuestas: 3`);
    console.log(`   ├─ Participación en Prop #1: 80% (800/1000 DCT)`);
    console.log(`   ├─ Participación en Prop #2: 20% (200/1000 DCT)`);
    console.log(`   ├─ Participación en Prop #3: 0% (0/1000 DCT)`);
    console.log(`   └─ Votantes únicos: 3 (Alice, Bob, Charlie)`);

    console.log("\n✅ Demo completada exitosamente!");
    console.log("=".repeat(70));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });