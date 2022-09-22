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
    // polygon mumbai testnet moleculeFactory Address
    address private constant moleculeFactory =
        0x162AEdBe789F84C023Bb218C06B450f732fCB35b;

    modifier moleculeVerify(address _moleculeNftAddress) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryStatus(msg.sender, _moleculeNftAddress);
        require(status == true, "Molecule Access Denied ");
        _;
    }

    modifier moleculeBatchVerify(uint256 _regionalId) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryBatchStatus(_regionalId, msg.sender);
        require(status == false, "Molecule Access Denied");
        _;
    }

    modifier moleculeProviderBatchVerify(uint256 _batchId, address _provider) {
        MoleculeFactory M = MoleculeFactory(moleculeFactory);
        bool status = M.queryProviderBatchStatus(
            _batchId,
            msg.sender,
            _provider
        );
        require(status == false, "Molecule Access Denied");
        _;
    }
}
