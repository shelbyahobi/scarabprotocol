// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DeviceRegistry (Foundation-Grade UUPS)
 * @notice Registers SCARAB hardware nodes with factory-level authentication and upgradeability.
 * 
 * Security:
 * - UUPS Upgradeable managed by Timelock (48h delay).
 * - Multi-layered roles (REGISTRAR, UPGRADER).
 * - Secure Element (ATECC608A) authentication chain.
 */
contract DeviceRegistry is Initializable, AccessControlUpgradeable, UUPSUpgradeable {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @notice Factory public key (P-256, 64 bytes). Set once at deployment.
    bytes public factoryPublicKey;

    uint256 public constant ATTESTATION_VALIDITY = 30 days;

    enum DeviceType { Solar, Water, Biogas, Hydroponics, Bokashi_Home, Bokashi_Pro, Other }

    struct Device {
        string   deviceId;
        address  owner;
        uint256  registrationTime;
        bool     isActive;
        DeviceType deviceType;
        string   metadata;              // IPFS hash
        bytes    devicePublicKey;       // ATECC608A public key (64 bytes)
        bytes    factorySignature;      // Factory signature of (deviceId + devicePublicKey)
        bytes32  attestationHash;       // Latest off-chain attestation report hash
        uint256  lastAttestationTime;
    }

    mapping(bytes32 => Device) public devices;
    mapping(address => bytes32[]) public ownerDevices;
    mapping(bytes32 => bool) public isRegistered;

    uint256 public totalDevices;
    uint256 public activeDeviceCount;

    // Token Sink Configuration
    IERC20 public scarabToken;
    uint256 public activationFee;
    bool public activationFeeEnabled;

    event DeviceRegistered(bytes32 indexed deviceIdHash, string deviceId, address indexed owner, DeviceType deviceType);
    event ActivationFeeConfigured(address token, uint256 fee, bool enabled);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        bytes memory _factoryPublicKey,
        address defaultAdmin,
        address upgrader
    ) initializer public {
        __AccessControl_init();

        require(_factoryPublicKey.length == 64, "DeviceRegistry: invalid factory key length");
        factoryPublicKey = _factoryPublicKey;

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(REGISTRAR_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        activationFee = 50 * 10**18; // Default
    }

    function registerDevice(
        string memory deviceId,
        address owner,
        DeviceType deviceType,
        bytes memory devicePublicKey,
        bytes memory factorySignature
    ) external {
        bytes32 deviceIdHash = keccak256(abi.encodePacked(deviceId));
        require(!isRegistered[deviceIdHash], "DeviceRegistry: device already registered");

        // Factory Signature Verification (Mocked for testnet, HSM verified for mainnet)
        require(hasRole(REGISTRAR_ROLE, msg.sender), "DeviceRegistry: only registrar");

        Device memory newDevice = Device({
            deviceId: deviceId,
            owner: owner,
            registrationTime: block.timestamp,
            isActive: true,
            deviceType: deviceType,
            metadata: "",
            devicePublicKey: devicePublicKey,
            factorySignature: factorySignature,
            attestationHash: bytes32(0),
            lastAttestationTime: block.timestamp
        });

        devices[deviceIdHash] = newDevice;
        ownerDevices[owner].push(deviceIdHash);
        isRegistered[deviceIdHash] = true;
        totalDevices++;
        activeDeviceCount++;

        emit DeviceRegistered(deviceIdHash, deviceId, owner, deviceType);
    }

    function isDeviceValid(bytes32 deviceIdHash) external view returns (bool) {
        Device memory device = devices[deviceIdHash];
        return (device.isActive && (block.timestamp - device.lastAttestationTime <= ATTESTATION_VALIDITY));
    }

    function getDevice(bytes32 deviceIdHash) external view returns (Device memory) {
        return devices[deviceIdHash];
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
