var MesgStorage = artifacts.require('MesgStorage');

module.exports = deployer => deployer.deploy(MesgStorage, 5, 100)