import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Módulo de Ignition para desplegar un token ERC20
 *
 * Este módulo despliega un contrato ERC20 con parámetros configurables:
 * - name: Nombre completo del token (ej: "Mi Token")
 * - symbol: Símbolo del token (ej: "MTK")
 * - initialSupply: Suministro inicial de tokens (ej: 1000000)
 *
 * Ejemplo de uso:
 * npx hardhat ignition deploy ./ignition/modules/MiToken.ts
 *
 * Con parámetros personalizados:
 * npx hardhat ignition deploy ./ignition/modules/MiToken.ts --parameters '{"MiTokenModule":{"tokenName":"Mi Token","tokenSymbol":"MTK","tokenInitialSupply":"1000000"}}'
 */
export default buildModule("MiTokenModule", (m) => {
  // Obtener parámetros con valores por defecto
  const tokenName = m.getParameter("tokenName", "Mi Token");
  const tokenSymbol = m.getParameter("tokenSymbol", "MTK");
  const tokenInitialSupply = m.getParameter("tokenInitialSupply", BigInt(1_000_000));

  // Desplegar el contrato MiToken con los argumentos del constructor
  // El contrato debe tener un constructor que acepte (string name, string symbol, uint256 initialSupply)
  const token = m.contract("MiToken", [tokenName, tokenSymbol, tokenInitialSupply]);

  // Retornar el contrato desplegado para que pueda ser usado en otros módulos o tests
  return { token };
});