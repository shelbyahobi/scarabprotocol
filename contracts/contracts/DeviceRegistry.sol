// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DeviceRegistry
 * @notice Registers SCARAB hardware nodes with factory-level authentication.
 * @dev Devices must carry a factory signature proving they were manufactured
 *      by SCARAB and must re-attest every 30 days to remain eligible for rewards.
 *
 * TESTNET NOTE: verifyFactorySignature() trusts REGISTRAR_ROLE.
 * TODO: MAINNET — Replace with full P-256 / EIP-7212 precompile verification.
 */
contract DeviceRegistry is AccessControl {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    /// @notice Factory public key (P-256, 64 bytes). Set once at deployment.
    bytes public factoryPublicKey;

    uint256 public constant ATTESTATION_VALIDITY = 30 days;

    enum DeviceType { Solar, Water, Biogas, Hydroponics, Bokashi, Other }

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

    mapping(bytes32 => Device)    public devices;         // deviceIdHash => Device
    mapping(address => bytes32[]) public ownerDevices;    // owner => list of device hashes
    mapping(bytes32 => bool)      public isRegistered;

    uint256 public totalDevices;
    uint256 public activeDeviceCount;

    // ─── Events ────────────────────────────────────────────────────────────────

    event DeviceRegistered(
        bytes32 indexed deviceIdHash,
        string  deviceId,
        address indexed owner,
        DeviceType deviceType
    );

    event AttestationUpdated(
        bytes32 indexed deviceIdHash,
        bytes32 attestationHash,
        uint256 timestamp
    );

    event DeviceDeactivated(bytes32 indexed deviceIdHash);
    event DeviceTransferred(bytes32 indexed deviceIdHash, address indexed from, address indexed to);

    // ─── Constructor ───────────────────────────────────────────────────────────

    constructor(bytes memory _factoryPublicKey) {
        require(_factoryPublicKey.length == 64, "DeviceRegistry: invalid factory key length");
        factoryPublicKey = _factoryPublicKey;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    // ─── Registration ──────────────────────────────────────────────────────────

    /**
     * @notice Register a device with factory proof of authenticity.
     * @param deviceId        ATECC608A serial number (unique hardware ID)
     * @param owner           Wallet that will receive rewards
     * @param deviceType      Solar / Water / Biogas / etc.
     * @param metadata        IPFS hash of hardware spec sheet
     * @param devicePublicKey 64-byte P-256 public key from the secure element
     * @param factorySignature Factory's signature proving the device is genuine
     * @param initialAttestationHash Hash of the initial attestation report
     */
    function registerDevice(
        string   memory deviceId,
        address  owner,
        DeviceType deviceType,
        string   memory metadata,
        bytes    memory devicePublicKey,
        bytes    memory factorySignature,
        bytes32  initialAttestationHash
    ) external onlyRole(REGISTRAR_ROLE) returns (bytes32 deviceIdHash) {
        require(owner != address(0),           "DeviceRegistry: zero owner");
        require(bytes(deviceId).length > 0,    "DeviceRegistry: empty deviceId");
        require(devicePublicKey.length == 64,  "DeviceRegistry: bad device key");
        require(factorySignature.length == 64, "DeviceRegistry: bad factory sig");

        deviceIdHash = keccak256(bytes(deviceId));
        require(!isRegistered[deviceIdHash], "DeviceRegistry: already registered");

        // CRITICAL: verify the factory signed this device's public key
        // TESTNET: trusts REGISTRAR_ROLE — registrar is responsible for pre-verification
        // TODO: MAINNET — implement P-256 verification via EIP-7212 precompile or Chainlink Functions
        require(
            _verifyFactorySignature(deviceId, devicePublicKey, factorySignature),
            "DeviceRegistry: invalid factory signature"
        );

        devices[deviceIdHash] = Device({
            deviceId:            deviceId,
            owner:               owner,
            registrationTime:    block.timestamp,
            isActive:            true,
            deviceType:          deviceType,
            metadata:            metadata,
            devicePublicKey:     devicePublicKey,
            factorySignature:    factorySignature,
            attestationHash:     initialAttestationHash,
            lastAttestationTime: block.timestamp
        });

        ownerDevices[owner].push(deviceIdHash);
        isRegistered[deviceIdHash] = true;
        totalDevices++;
        activeDeviceCount++;

        emit DeviceRegistered(deviceIdHash, deviceId, owner, deviceType);
        emit AttestationUpdated(deviceIdHash, initialAttestationHash, block.timestamp);
    }

    // ─── Attestation ───────────────────────────────────────────────────────────

    /**
     * @notice Update attestation hash. Must be called at least every 30 days.
     *         Lapsed attestation disqualifies device from rewards.
     */
    function updateAttestation(
        bytes32 deviceIdHash,
        bytes32 newAttestationHash
    ) external onlyRole(REGISTRAR_ROLE) {
        require(isRegistered[deviceIdHash], "DeviceRegistry: not registered");

        Device storage d = devices[deviceIdHash];
        d.attestationHash     = newAttestationHash;
        d.lastAttestationTime = block.timestamp;

        emit AttestationUpdated(deviceIdHash, newAttestationHash, block.timestamp);
    }

    /**
     * @notice Returns true if attestation was refreshed within the validity window.
     */
    function isAttestationValid(bytes32 deviceIdHash) public view returns (bool) {
        if (!isRegistered[deviceIdHash]) return false;
        return (block.timestamp - devices[deviceIdHash].lastAttestationTime) <= ATTESTATION_VALIDITY;
    }

    /**
     * @notice Full validity check: registered + active + attestation current.
     */
    function isDeviceValid(bytes32 deviceIdHash) external view returns (bool) {
        return isRegistered[deviceIdHash]
            && devices[deviceIdHash].isActive
            && isAttestationValid(deviceIdHash);
    }

    // ─── Management ────────────────────────────────────────────────────────────

    function deactivateDevice(bytes32 deviceIdHash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(isRegistered[deviceIdHash], "DeviceRegistry: not registered");
        require(devices[deviceIdHash].isActive, "DeviceRegistry: already inactive");
        devices[deviceIdHash].isActive = false;
        activeDeviceCount--;
        emit DeviceDeactivated(deviceIdHash);
    }

    /**
     * @notice Transfer device ownership (e.g. node resale).
     *         Only the current owner can initiate.
     */
    function transferDevice(bytes32 deviceIdHash, address newOwner) external {
        require(isRegistered[deviceIdHash],                 "DeviceRegistry: not registered");
        require(devices[deviceIdHash].owner == msg.sender,  "DeviceRegistry: not owner");
        require(newOwner != address(0),                     "DeviceRegistry: zero address");

        address previousOwner = devices[deviceIdHash].owner;
        devices[deviceIdHash].owner = newOwner;
        ownerDevices[newOwner].push(deviceIdHash);

        emit DeviceTransferred(deviceIdHash, previousOwner, newOwner);
    }

    // ─── Views ─────────────────────────────────────────────────────────────────

    function getDevice(bytes32 deviceIdHash) external view returns (Device memory) {
        return devices[deviceIdHash];
    }

    function getDevicesByOwner(address owner) external view returns (bytes32[] memory) {
        return ownerDevices[owner];
    }

    // ─── Internal ──────────────────────────────────────────────────────────────

    /**
     * @dev TESTNET: Passes if signature is 64 bytes and factory key is set.
     *      The REGISTRAR_ROLE off-chain service performs the actual P-256 verification
     *      before calling registerDevice().
     *
     * TODO: MAINNET — Replace body with EIP-7212 RIP-7212 P-256 precompile call:
     *       address constant P256_VERIFIER = 0x0000000000000000000000000000000000000100;
     *       (available on BSC after BEP-xxx upgrade, or use Daimo's P256Verifier contract)
     */
    function _verifyFactorySignature(
        string memory deviceId,
        bytes memory devicePublicKey,
        bytes memory signature
    ) internal view returns (bool) {
        // Ensure inputs are structurally valid
        if (signature.length != 64) return false;
        if (factoryPublicKey.length != 64) return false;

        // Testnet: trust registrar. The off-chain service verified P-256 before submitting.
        // The hash below is stored for auditability even if not verified on-chain yet.
        bytes32 _msgHash = keccak256(abi.encodePacked(deviceId, devicePublicKey));
        (_msgHash); // suppress unused warning

        return true;
    }
}
