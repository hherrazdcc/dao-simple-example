import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

describe("Prueba de DAO Simple", function() {
    async function deployDAOFixture() {
        // 1. Cuentas de prueba
        const [owner, voter1, voter2] = await ethers.getSigners();

        // 2. Despliegue del contrato Token
        const TokenFactory = await ethers.getContractFactory("GovernanceToken");
        const token = await TokenFactory.deploy();

        // 3. Despliegue del contrato DAO
        const DAOFactory = await ethers.getContractFactory("SimpleDAO");
            // Pasamos la direccion del token constructor de la DAO
        const dao = await DAOFactory.deploy(await token.getAddress());

        // 4. Distribuir tokens a los votantes
        await token.transfer(await voter1.getAddress(), ethers.parseEther("300"));
        await token.transfer(await voter2.getAddress(), ethers.parseEther("200"));

        return { dao, token, owner, voter1, voter2 };
    }

    it("Debe Permitir crear una propuesta", async function() {
        console.log("\n=== Iniciando prueba: Crear propuesta ===");

        console.log("1. Cargando fixture (desplegando contratos y distribuyendo tokens)...");
        const { dao } = await networkHelpers.loadFixture(deployDAOFixture);
        console.log("   ✓ Contratos desplegados y tokens distribuidos");

        console.log("2. Creando nueva propuesta en la DAO...");
        await dao.createProposal("Convertir en 4 a los alumnos que tengan promedio sobre 3.7");
        console.log("   ✓ Propuesta creada exitosamente");

        console.log("3. Validando la existencia de la propuesta...");
        const proposal = await dao.getProposal(1);
        console.log(`   - Descripción obtenida: "${proposal[0]}"`);
        console.log(`   - Votos iniciales: ${proposal[1]}`);

        expect(proposal[0]).to.equal("Convertir en 4 a los alumnos que tengan promedio sobre 3.7");
        expect(proposal[1]).to.equal(0n); // 0 votos iniciales.
        console.log("   ✓ Validación exitosa: propuesta almacenada correctamente");
        console.log("=== Prueba completada ===\n");
    })

    it("Debe permitir votar y contar los pesos de los votos correctamente", async function() {
        console.log("\n=== Iniciando prueba: Votar en propuesta ===");

        console.log("1. Cargando fixture...");
        const { dao, token, voter1, voter2 } = await networkHelpers.loadFixture(deployDAOFixture);
        console.log("   ✓ Contratos listos");

        console.log("2. Creando propuesta...");
        await dao.createProposal("Aumentar presupuesto de desarrollo");
        console.log("   ✓ Propuesta #1 creada");

        console.log("3. Verificando balances de tokens antes de votar...");
        const balance1 = await token.balanceOf(await voter1.getAddress());
        const balance2 = await token.balanceOf(await voter2.getAddress());
        console.log(`   - Voter1: ${ethers.formatEther(balance1)} tokens`);
        console.log(`   - Voter2: ${ethers.formatEther(balance2)} tokens`);

        console.log("4. Voter1 emite su voto...");
        await dao.connect(voter1).vote(1);
        console.log("   ✓ Voto registrado");

        console.log("5. Verificando conteo después del primer voto...");
        let proposal = await dao.getProposal(1);
        expect(proposal[1]).to.equal(ethers.parseEther("300"));
        console.log(`   ✓ Votos acumulados: ${ethers.formatEther(proposal[1])} (peso de voter1)`);

        console.log("6. Voter2 emite su voto...");
        await dao.connect(voter2).vote(1);
        console.log("   ✓ Voto registrado");

        console.log("7. Verificando conteo final...");
        proposal = await dao.getProposal(1);
        const expectedVotes = ethers.parseEther("500"); // 300 + 200
        expect(proposal[1]).to.equal(expectedVotes);
        console.log(`   ✓ Votos totales: ${ethers.formatEther(proposal[1])} tokens`);
        console.log(`   ✓ Suma correcta: 300 + 200 = 500`);
        console.log("=== Prueba completada ===\n");
    })

    it("Debe revertir si un usuario intenta votar dos veces en la misma propuesta", async function() {
        console.log("\n=== Iniciando prueba: Voto duplicado ===");

        console.log("1. Cargando fixture...");
        const { dao, voter1 } = await networkHelpers.loadFixture(deployDAOFixture);
        console.log("   ✓ Contratos listos");

        console.log("2. Creando propuesta...");
        await dao.createProposal("Propuesta de prueba");
        console.log("   ✓ Propuesta creada");

        console.log("3. Voter1 emite su primer voto...");
        await dao.connect(voter1).vote(1);
        console.log("   ✓ Primer voto exitoso");

        console.log("4. Intentando votar nuevamente con voter1...");
        await expect(dao.connect(voter1).vote(1))
            .to.be.revertedWith("Ya has votado esta propuesta");
        console.log("   ✓ Voto duplicado rechazado correctamente");
        console.log("=== Prueba completada ===\n");
    })

    it("Debe revertir si un usuario sin tokens intenta votar", async function() {
        console.log("\n=== Iniciando prueba: Voto sin tokens ===");

        console.log("1. Desplegando contratos...");
        const TokenFactory = await ethers.getContractFactory("GovernanceToken");
        const token = await TokenFactory.deploy();
        const DAOFactory = await ethers.getContractFactory("SimpleDAO");
        const dao = await DAOFactory.deploy(await token.getAddress());
        console.log("   ✓ Contratos desplegados");

        console.log("2. Obteniendo cuenta sin tokens...");
        const signers = await ethers.getSigners();
        const noTokenUser = signers[5]; // Usuario que no recibió tokens
        const balance = await token.balanceOf(await noTokenUser.getAddress());
        console.log(`   - Balance: ${balance} tokens`);
        expect(balance).to.equal(0n);

        console.log("3. Creando propuesta...");
        await dao.createProposal("Propuesta de prueba");
        console.log("   ✓ Propuesta creada");

        console.log("4. Intentando votar sin tokens...");
        await expect(dao.connect(noTokenUser).vote(1))
            .to.be.revertedWith("No tienes tokens para votar");
        console.log("   ✓ Voto sin tokens rechazado correctamente");
        console.log("=== Prueba completada ===\n");
    })

    it("Debe permitir múltiples propuestas simultáneas", async function() {
        console.log("\n=== Iniciando prueba: Múltiples propuestas ===");

        console.log("1. Cargando fixture...");
        const { dao, voter1, voter2 } = await networkHelpers.loadFixture(deployDAOFixture);
        console.log("   ✓ Contratos listos");

        console.log("2. Creando 3 propuestas diferentes...");
        await dao.createProposal("Propuesta A: Aumentar presupuesto");
        await dao.createProposal("Propuesta B: Contratar desarrolladores");
        await dao.createProposal("Propuesta C: Marketing campaign");
        console.log("   ✓ 3 propuestas creadas");

        console.log("3. Votando en diferentes propuestas...");
        await dao.connect(voter1).vote(1); // Voter1 vota en propuesta 1
        await dao.connect(voter1).vote(2); // Voter1 puede votar en propuesta 2
        await dao.connect(voter2).vote(2); // Voter2 vota en propuesta 2
        console.log("   ✓ Votos registrados");

        console.log("4. Verificando conteos independientes...");
        const prop1 = await dao.getProposal(1);
        const prop2 = await dao.getProposal(2);
        const prop3 = await dao.getProposal(3);

        console.log(`   - Propuesta 1: ${ethers.formatEther(prop1[1])} votos (solo voter1)`);
        console.log(`   - Propuesta 2: ${ethers.formatEther(prop2[1])} votos (voter1 + voter2)`);
        console.log(`   - Propuesta 3: ${ethers.formatEther(prop3[1])} votos (ninguno)`);

        expect(prop1[1]).to.equal(ethers.parseEther("300"));
        expect(prop2[1]).to.equal(ethers.parseEther("500"));
        expect(prop3[1]).to.equal(0n);
        console.log("   ✓ Conteos correctos e independientes");
        console.log("=== Prueba completada ===\n");
    })
})