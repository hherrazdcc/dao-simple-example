// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDAO {

    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
        mapping(address => bool) voters; // evitar doble votación
    }

    IERC20 public governanceToken;
    mapping(uint256 => Proposal) public proposals; // mapping de propuestas
    uint256 public proposalCount;

    constructor(address _tokenAddress) {
        governanceToken = IERC20(_tokenAddress);
    }

    // 1. Crear una propuesta

    function createProposal(string memory _description) external {
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.description = _description;
        newProposal.executed = false;
    }

    // 2. Votar (Requiere tener tokens)

    function vote(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.voters[msg.sender], "Ya has votado esta propuesta");

        uint256 balance = governanceToken.balanceOf(msg.sender);
        require(balance > 0, "No tienes tokens para votar");

        proposal.voters[msg.sender] = true;
        proposal.voteCount += balance; // votos ponderados por balance de tokens
    }

    // 3. Obtener detalles
    function getProposal(uint256 _proposalId) external view returns (string memory, uint256, bool) {
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.description, proposal.voteCount, proposal.executed);
    }
}