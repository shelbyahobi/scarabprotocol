// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockSimulationDeviceRegistry
 * @notice A lightweight, non-upgradeable device registry for BSC Testnet simulation.
 *         Provides the same external interface required by BokashiValidator without
 *         any proxy/initializer overhead. Not for production use.
 */
contract MockSimulationDeviceRegistry {
    enum DeviceType { Solar, Water, Biogas, Hydroponics, Bokashi_Home, Bokashi_Pro, Other }

    struct Device {
        string     deviceId;
        address    owner;
        uint256    registrationTime;
        bool       isActive;
        DeviceType deviceType;
        string     metadata;
        bytes      devicePublicKey;
        bytes      factorySignature;
        bytes32    attestationHash;
        uint256    lastAttestationTime;
    }

    mapping(bytes32 => Device) private _devices;

    event DeviceRegistered(bytes32 indexed deviceIdHash, string deviceId, address indexed owner, DeviceType deviceType);

    /**
     * @notice Register a device. deviceTypeInt maps: 4 = Bokashi_Home, 5 = Bokashi_Pro.
     */
    function registerDevice(
        string calldata deviceId,
        address owner,
        uint8 deviceTypeInt,
        string calldata metadata,
        bytes calldata devicePublicKey,
        bytes calldata factorySignature,
        bytes32 attestationHash
    ) external returns (bytes32 deviceIdHash) {
        deviceIdHash = keccak256(abi.encodePacked(deviceId));
        require(!_devices[deviceIdHash].isActive, "Device already registered");

        _devices[deviceIdHash] = Device({
            deviceId:            deviceId,
            owner:               owner,
            registrationTime:    block.timestamp,
            isActive:            true,
            deviceType:          DeviceType(deviceTypeInt),
            metadata:            metadata,
            devicePublicKey:     devicePublicKey,
            factorySignature:    factorySignature,
            attestationHash:     attestationHash,
            lastAttestationTime: block.timestamp
        });

        emit DeviceRegistered(deviceIdHash, deviceId, owner, DeviceType(deviceTypeInt));
    }

    function isDeviceValid(bytes32 deviceIdHash) external view returns (bool) {
        return _devices[deviceIdHash].isActive;
    }

    function getDevice(bytes32 deviceIdHash) external view returns (Device memory) {
        return _devices[deviceIdHash];
    }
}
