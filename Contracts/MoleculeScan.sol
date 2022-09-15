// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

interface MoleculeFactory {
    function queryBatchStatus(uint256 _regionalId, address _reciever)
        external
        view
        returns (bool);

    function queryStatus(address user, address moleculeNftAddress)
        external
        view
        returns (bool);

    function queryProviderBatchStatus(
        uint256 _batchId,
        address _reciever,
        address _provider
    ) external view returns (bool);
}

contract MoleculeScan {
    address public moleculeFactory;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier moleculeVerify(address _moleculeNftAddress) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryStatus(msg.sender, _moleculeNftAddress);
        require(status == true, "Molecule Access Denied ");
        _;
    }

    modifier moleculeBatchVerify(uint256 _regionalId) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryBatchStatus(_regionalId, msg.sender);
        require(status == true, "Molecule Access Denied");
        _;
    }

    modifier moleculeProviderBatchVerify(uint256 _batchId, address _provider) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryProviderBatchStatus(
            _batchId,
            msg.sender,
            _provider
        );
        require(status == true, "Molecule Access Denied");
        _;
    }

    function setMoleculeFactory(address _factory)
        public
        onlyOwner
        returns (bool)
    {
        moleculeFactory = _factory;
        return true;
    }
}
