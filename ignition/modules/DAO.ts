import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DAOModule", (m) => {
    // 1. Desplegar el token de gobernanza
    const token = m.contract("GovernanceToken");

    // 2. Desplegar el contrato DAO pasando la dirección del token
    const dao = m.contract("SimpleDAO", [token]);

    // 3. Configuración inicial: Distribuir tokens a cuentas de prueba
    // Obtener las direcciones de las cuentas
    const account1 = m.getAccount(1);
    const account2 = m.getAccount(2);
    const account3 = m.getAccount(3);

    // Distribuir tokens (500, 300, 200 tokens respectivamente)
    m.call(token, "transfer", [account1, m.bigint("500000000000000000000")]);
    m.call(token, "transfer", [account2, m.bigint("300000000000000000000")]);
    m.call(token, "transfer", [account3, m.bigint("200000000000000000000")]);

    return { token, dao };
});