# 📚 Guía Completa: Desplegar DAO en Testnet Local y Conectar Frontend

Esta guía te muestra paso a paso cómo desplegar el sistema DAO en una testnet local y conectarlo a un frontend.

---

## 🎯 Objetivo

Desplegar los contratos `GovernanceToken` y `SimpleDAO` en una red local de Hardhat que persista y pueda ser accedida desde un frontend (React, HTML, etc.) usando MetaMask.

---

## 📋 Requisitos Previos

- Node.js instalado
- MetaMask instalado en el navegador
- Proyecto Hardhat configurado (ya lo tienes)

---

## 🚀 Paso 1: Iniciar la Testnet Local

Abre una terminal y ejecuta:

```bash
npx hardhat node
```

**¿Qué hace esto?**
- Inicia un nodo Ethereum local en `http://127.0.0.1:8545`
- Crea 20 cuentas de prueba con 10,000 ETH cada una
- La red se mantiene activa hasta que detengas el proceso
- Muestra logs de todas las transacciones en tiempo real

**Salida esperada:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**⚠️ IMPORTANTE:** Deja esta terminal abierta. La red local se ejecuta mientras el proceso esté activo.

---

## 🎬 Paso 2: Desplegar los Contratos

Abre una **segunda terminal** (la primera sigue ejecutando `hardhat node`) y ejecuta:

```bash
npx hardhat run scripts/deploy-local.ts --network localhost
```

**¿Qué hace este script?**
1. ✅ Despliega el contrato `GovernanceToken`
2. ✅ Despliega el contrato `SimpleDAO`
3. ✅ Distribuye tokens a 3 cuentas (500, 300, 200 DCT)
4. ✅ Crea 3 propuestas de ejemplo
5. ✅ Guarda las direcciones y ABIs en `deployments/localhost.json`

**Salida esperada:**
```
🚀 DESPLEGANDO DAO EN TESTNET LOCAL
======================================================================

📋 Información de Cuentas:
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Voter1:   0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Voter2:   0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Voter3:   0x90F79bf6EB2c4f870365E785982E1f101E93b906

🪙 Desplegando GovernanceToken...
✓ Token desplegado en: 0x5FbDB2315678afecb367f032d93F642f64180aa3

🏛️  Desplegando SimpleDAO...
✓ DAO desplegado en: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

💰 Distribuyendo tokens...
✓ Voter1: 500 DCT
✓ Voter2: 300 DCT
✓ Voter3: 200 DCT

📝 Creando propuestas de ejemplo...
✓ Propuesta #1 creada
✓ Propuesta #2 creada
✓ Propuesta #3 creada

💾 Guardando configuración para frontend...
✓ Configuración guardada en: /path/to/deployments/localhost.json
✓ ABIs guardados en: /path/to/deployments/abis

======================================================================
✅ DEPLOYMENT COMPLETADO
======================================================================

📍 Direcciones de Contratos:
   Token: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   DAO:   0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

🌐 Red Local:
   RPC URL: http://127.0.0.1:8545
   Chain ID: 31337

📂 Archivos Generados:
   /path/to/deployments/localhost.json
   /path/to/deployments/abis/GovernanceToken.json
   /path/to/deployments/abis/SimpleDAO.json

💡 Próximo paso: Conectar MetaMask a http://127.0.0.1:8545
======================================================================
```

---

## 🦊 Paso 3: Configurar MetaMask

### 3.1 Agregar la Red Local

1. Abre MetaMask
2. Click en el selector de redes (arriba)
3. Click en "Agregar red" → "Agregar una red manualmente"
4. Completa con estos datos:

```
Nombre de la red:     Hardhat Local
RPC URL:              http://127.0.0.1:8545
Chain ID:             31337
Símbolo de moneda:    ETH
```

5. Click en "Guardar"

### 3.2 Importar Cuentas de Prueba

Para usar las cuentas con tokens, necesitas importar sus claves privadas:

**Cuenta #1 (Voter1 - 500 DCT):**
```
Clave privada: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

**Cuenta #2 (Voter2 - 300 DCT):**
```
Clave privada: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

**Pasos para importar:**
1. En MetaMask, click en el icono de cuenta (arriba a la derecha)
2. "Importar cuenta"
3. Pega la clave privada
4. Click en "Importar"

**⚠️ IMPORTANTE:** Estas claves privadas son solo para desarrollo local. **NUNCA** las uses en mainnet o con fondos reales.

---

## 📂 Paso 4: Archivos Generados para el Frontend

Después del deployment, encontrarás estos archivos:

### `deployments/localhost.json`
Contiene toda la información del deployment:

```json
{
  "network": "localhost",
  "chainId": 31337,
  "contracts": {
    "GovernanceToken": {
      "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "abi": "[...]"
    },
    "SimpleDAO": {
      "address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "abi": "[...]"
    }
  },
  "accounts": {
    "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "voter1": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "voter2": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "voter3": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  },
  "tokenDistribution": {
    "voter1": "500",
    "voter2": "300",
    "voter3": "200"
  },
  "rpcUrl": "http://127.0.0.1:8545"
}
```

### `deployments/abis/`
ABIs individuales de cada contrato para facilitar la importación en el frontend.

---

## 💻 Paso 5: Conectar desde el Frontend

### Ejemplo básico con ethers.js:

```javascript
import { ethers } from "ethers";
import deploymentInfo from "./deployments/localhost.json";

// Conectar a la red local
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Conectar a MetaMask
const signer = await provider.getSigner();

// Crear instancias de los contratos
const daoContract = new ethers.Contract(
    deploymentInfo.contracts.SimpleDAO.address,
    JSON.parse(deploymentInfo.contracts.SimpleDAO.abi),
    signer
);

const tokenContract = new ethers.Contract(
    deploymentInfo.contracts.GovernanceToken.address,
    JSON.parse(deploymentInfo.contracts.GovernanceToken.abi),
    signer
);

// Ejemplo: Ver propuestas
const proposal = await daoContract.getProposal(1);
console.log("Propuesta #1:", proposal[0]);
console.log("Votos:", ethers.formatEther(proposal[1]));

// Ejemplo: Votar
const tx = await daoContract.vote(1);
await tx.wait();
console.log("Voto registrado!");

// Ejemplo: Ver balance de tokens
const balance = await tokenContract.balanceOf(await signer.getAddress());
console.log("Balance:", ethers.formatEther(balance), "DCT");
```

### Ejemplo con Web3.js:

```javascript
import Web3 from "web3";
import deploymentInfo from "./deployments/localhost.json";

// Conectar a MetaMask
const web3 = new Web3(window.ethereum);
await window.ethereum.request({ method: 'eth_requestAccounts' });

const accounts = await web3.eth.getAccounts();
const userAddress = accounts[0];

// Crear instancias de los contratos
const daoContract = new web3.eth.Contract(
    JSON.parse(deploymentInfo.contracts.SimpleDAO.abi),
    deploymentInfo.contracts.SimpleDAO.address
);

const tokenContract = new web3.eth.Contract(
    JSON.parse(deploymentInfo.contracts.GovernanceToken.abi),
    deploymentInfo.contracts.GovernanceToken.address
);

// Ejemplo: Votar
await daoContract.methods.vote(1).send({ from: userAddress });
```

---

## 🧪 Paso 6: Probar el Sistema

### Desde la consola de Hardhat

Puedes interactuar directamente con los contratos:

```bash
npx hardhat console --network localhost
```

Luego en la consola:

```javascript
const { ethers } = await import("hardhat");

// Cargar el deployment
const fs = await import("fs");
const deployment = JSON.parse(fs.readFileSync("deployments/localhost.json"));

// Conectar al DAO
const dao = await ethers.getContractAt("SimpleDAO", deployment.contracts.SimpleDAO.address);

// Ver propuestas
const prop1 = await dao.getProposal(1);
console.log("Propuesta 1:", prop1[0]);
console.log("Votos:", ethers.formatEther(prop1[1]));

// Crear una nueva propuesta
await dao.createProposal("Nueva propuesta desde la consola");
console.log("Propuesta creada!");
```

---

## 🔄 Paso 7: Redeployment (Reiniciar Todo)

Si necesitas reiniciar desde cero:

1. **Detén el nodo local** (Ctrl+C en la primera terminal)
2. **Vuelve a iniciar:**
   ```bash
   npx hardhat node
   ```
3. **Redeploya los contratos:**
   ```bash
   npx hardhat run scripts/deploy-local.ts --network localhost
   ```

**⚠️ IMPORTANTE:** Las direcciones de los contratos cambiarán. Necesitarás:
- Actualizar el archivo de configuración en tu frontend
- Resetear MetaMask (Settings → Advanced → Clear activity tab data)

---

## 📊 Funciones Disponibles del DAO

### SimpleDAO

```solidity
// Crear propuesta
createProposal(string memory _description)

// Votar (requiere tokens)
vote(uint256 _proposalId)

// Ver propuesta
getProposal(uint256 _proposalId)
    returns (string memory description, uint256 voteCount, bool executed)

// Ver contador de propuestas
proposalCount() returns (uint256)
```

### GovernanceToken (ERC20)

```solidity
// Ver balance
balanceOf(address account) returns (uint256)

// Transferir tokens
transfer(address to, uint256 amount) returns (bool)

// Ver nombre y símbolo
name() returns (string)
symbol() returns (string)
decimals() returns (uint8)
```

---

## 🐛 Troubleshooting

### Error: "Nonce too high"
**Causa:** MetaMask tiene estado desincronizado con la red local.

**Solución:**
1. MetaMask → Settings → Advanced
2. "Clear activity tab data"
3. Recarga la página

### Error: "Cannot connect to local node"
**Causa:** El nodo de Hardhat no está corriendo.

**Solución:**
```bash
npx hardhat node
```

### Error: "Contract not deployed"
**Causa:** Los contratos no fueron desplegados después de iniciar el nodo.

**Solución:**
```bash
npx hardhat run scripts/deploy-local.ts --network localhost
```

### Las transacciones no aparecen en MetaMask
**Causa:** MetaMask no está conectado a la red local.

**Solución:**
1. Verifica que MetaMask esté en la red "Hardhat Local"
2. Verifica que el RPC URL sea `http://127.0.0.1:8545`

---

## 📝 Checklist para la Clase

- [ ] Terminal 1: `npx hardhat node` ejecutándose
- [ ] Terminal 2: Deployment exitoso con `npx hardhat run scripts/deploy-local.ts --network localhost`
- [ ] MetaMask configurado con red local (Chain ID: 31337)
- [ ] Al menos una cuenta importada en MetaMask
- [ ] Archivo `deployments/localhost.json` generado
- [ ] Frontend conectado y probado

---

## 🎓 Conceptos Clave para Explicar en Clase

1. **Hardhat Node vs. Tests:**
   - Tests: Red temporal que se destruye después
   - Hardhat Node: Red persistente para desarrollo

2. **Chain ID 31337:**
   - Identificador único de la red local de Hardhat
   - Diferente a mainnet (1), Sepolia (11155111), etc.

3. **Cuentas de Prueba:**
   - Hardhat genera 20 cuentas con ETH falso
   - Las claves privadas son predecibles y públicas
   - Solo para desarrollo local

4. **ABIs (Application Binary Interface):**
   - Define cómo interactuar con el contrato
   - El frontend necesita el ABI para llamar funciones
   - Se genera automáticamente al compilar

5. **Provider vs. Signer:**
   - Provider: Solo lectura, consultas a la blockchain
   - Signer: Puede firmar transacciones (requiere clave privada)

---

## 🚀 Siguientes Pasos

1. **Desplegar en Sepolia:**
   - Configurar `SEPOLIA_PRIVATE_KEY` con hardhat-keystore
   - Ejecutar: `npx hardhat run scripts/deploy-local.ts --network sepolia`

2. **Mejorar el Frontend:**
   - Agregar manejo de eventos (logs de votación)
   - Implementar paginación de propuestas
   - Mostrar gráficos de participación

3. **Agregar Funcionalidad:**
   - Sistema de ejecución de propuestas
   - Timelock para propuestas
   - Quórum mínimo para aprobar

---

## 📚 Recursos Adicionales

- [Documentación de Hardhat](https://hardhat.org/docs)
- [Documentación de ethers.js](https://docs.ethers.org/v6/)
- [MetaMask Docs](https://docs.metamask.io/)
- [Solidity by Example](https://solidity-by-example.org/)

---

**¡Listo para la clase! 🎉**