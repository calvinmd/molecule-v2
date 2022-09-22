// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "./Molecule_ERC721.sol";

contract MoleculeFactory {
    Molecule_ERC721 private ERC721Contract;
    address public owner;

    // mapping for verified providers
    mapping(address => bool) private verifiedProviders;

    // user to deployed contract address list
    mapping(address => address[]) private userDeployedContractList;
    // new erc721 contract address to creator address
    mapping(address => address) private contractAdmin;

    // mapping regional id to batch id  to the bytes data for batch
    mapping(uint256 => mapping(uint256 => bytes)) public regionalData;
    // mapping regional ID to bucket ids
    mapping(uint256 => uint256) public bucketIds;

    // mapping provider to batchId to the batch data
    mapping(address => mapping(uint256 => bytes)) public ProviderBatchData;
    // mapping provider to current batch ID
    mapping(address => uint256) public providercurrentBatchId;

    event contractCreation(address contractAddress);
    event batchId(uint256 batchId, uint256 timeStamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function createContract(
        string memory _name,
        string memory _symbol,
        string memory _tokenUri
    ) public returns (address) {
        ERC721Contract = new Molecule_ERC721(
            _name,
            _symbol,
            _tokenUri,
            msg.sender
        );
        userDeployedContractList[msg.sender].push(address(ERC721Contract));
        contractAdmin[address(ERC721Contract)] = msg.sender;
        emit contractCreation(address(ERC721Contract));
        return address(ERC721Contract);
    }

    function listToken(address _account)
        public
        view
        returns (address[] memory)
    {
        return userDeployedContractList[_account];
    }

    function totalDeployedContracts(address _account)
        public
        view
        returns (uint256)
    {
        uint256 value = userDeployedContractList[_account].length;
        return (value);
    }

    function mintToken(address _token, address _receiver)
        public
        returns (bool)
    {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only mint"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        instance.safeMint(_receiver);
        return true;
    }

    function burnToken(address _token, uint256 _tokenId) public returns (bool) {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only burn"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        bool tokenExist = instance.isExist(_tokenId);
        require(tokenExist == true, "Invalid Token ID");
        instance.burn(_tokenId);
        return true;
    }

    function transferToken(
        address _token,
        address _from,
        address _to,
        uint256 _tokenId
    ) public returns (bool) {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only transfer"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        bool tokenExist = instance.isExist(_tokenId);
        require(tokenExist == true, "Invalid Token ID");
        instance.transferFrom(_from, _to, _tokenId);
        return true;
    }

    function pauseContract(address _token) public returns (bool) {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only pause"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        instance.pause();
        return true;
    }

    function unpauseContract(address _token) public returns (bool) {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only pause"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        instance.unpause();
        return true;
    }

    function transferTokenOwnership(address _token, address _newOwner)
        public
        returns (bool)
    {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only transfer Ownership"
        );
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        instance.transferOwnership(_newOwner);
        contractAdmin[_token] = _newOwner;
        return true;
    }

    function tokenTotalSupply(address _token) public view returns (uint256) {
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        uint256 supply = instance.totalSupply();
        return supply;
    }

    function tokenName(address _token) public view returns (string memory) {
        Molecule_ERC721 instance = Molecule_ERC721(_token);
        string memory name = instance.name();
        return name;
    }

    function bulkMintToken(address _token, address[] memory _reciever)
        public
        returns (bool)
    {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only mint"
        );
        for (uint256 i = 0; i < _reciever.length; i++) {
            Molecule_ERC721 instance = Molecule_ERC721(_token);
            instance.safeMint(_reciever[i]);
        }
        return true;
    }

    function bulkBurnToken(address _token, uint256[] memory _tokenId)
        public
        returns (bool)
    {
        require(
            msg.sender == contractAdmin[_token],
            " Contract Admin can only burn"
        );
        for (uint256 i = 0; i < _tokenId.length; i++) {
            Molecule_ERC721 instance = Molecule_ERC721(_token);
            instance.burn(_tokenId[i]);
        }
        return true;
    }

    function queryStatus(address user, address moleculeNftAddress)
        public
        view
        returns (bool)
    {
        bool status = false;
        Molecule_ERC721 M = Molecule_ERC721(moleculeNftAddress);
        uint256 balance = M.balanceOf(user);
        if (balance >= 1) {
            status = true;
        } else status = false;
        return status;
    }

    // Batch updation section begins

    function addVerifiedProvider(address[] memory _providerAddress)
        external
        onlyOwner
        returns (bool)
    {
        for (uint256 i = 0; i < _providerAddress.length; i++) {
            verifiedProviders[_providerAddress[i]] = true;
        }
        return true;
    }

    function removeVerifiedProvider(address[] memory _providerAddress)
        external
        onlyOwner
        returns (bool)
    {
        for (uint256 i = 0; i < _providerAddress.length; i++) {
            verifiedProviders[_providerAddress[i]] = false;
        }
        return true;
    }

    function checkProviderStatus(address _provider) public view returns (bool) {
        return verifiedProviders[_provider];
    }

    function updateBatch(address[] memory _sanctionedUsers, uint256 _regionalId)
        external
        onlyOwner
        returns (
            bool,
            uint256,
            uint256
        )
    {
        bucketIds[_regionalId] += 1;
        uint256 currentBucketId = bucketIds[_regionalId];
        bytes memory data = abi.encode(_sanctionedUsers);
        regionalData[_regionalId][bucketIds[_regionalId]] = data;
        emit batchId(currentBucketId, block.timestamp);
        return (true, _regionalId, bucketIds[_regionalId]);
    }

    function BatchUserList(bytes memory data)
        public
        pure
        returns (address[] memory _sanctionedUsers)
    {
        (_sanctionedUsers) = abi.decode(data, (address[]));
        return _sanctionedUsers;
    }

    function updateProviderBatch(address[] memory _sanctionedUsers)
        external
        returns (bool, uint256)
    {
        providercurrentBatchId[msg.sender] += 1;
        uint256 currentProviderBatchId = providercurrentBatchId[msg.sender];
        bytes memory data = abi.encode(_sanctionedUsers);
        ProviderBatchData[msg.sender][currentProviderBatchId] = data;
        return (true, currentProviderBatchId);
    }

    function queryBatchStatus(uint256 _regionalId, address _user)
        public
        view
        returns (bool)
    {
        bool status;
        for (uint256 i = 1; i <= bucketIds[_regionalId]; i++) {
            bytes memory data = regionalData[_regionalId][i];
            address[] memory userList = BatchUserList(data);
            for (uint256 j = 0; j < userList.length; j++) {
                if (userList[j] == _user) {
                    status = true;
                }
            }
        }
        return status;
    }

    function queryProviderBatchStatus(
        uint256 _batchId,
        address _user,
        address _provider
    ) public view returns (bool) {
        bool recieverStatus;
        require(
            _batchId <= providercurrentBatchId[_provider],
            "Batch ID does not exist"
        );
        bytes memory data = ProviderBatchData[_provider][_batchId];
        address[] memory userList = BatchUserList(data);
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i] == _user) {
                recieverStatus = true;
            } else recieverStatus = false;
        }
        return recieverStatus;
    }
}
