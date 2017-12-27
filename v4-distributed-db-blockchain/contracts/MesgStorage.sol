pragma solidity ^0.4.17;

contract MesgStorage {
  
  enum Status {
    Pending,
    Confirmed,
    Finished
  }

  struct Result {
    bool voted;
    string encryptedValue;
  }

  struct Mesg {
    bool created;
    Status status;
    string id;
    string bestValue;
    mapping (string => uint) encryptedValuesCount;
    mapping (address => Result) results;
  }

  struct Runner {
    string runnerType;
    mapping (string => Mesg) mesgMap;
  }

  address public owner;
  uint public minConfirmationsNumber;
  uint public minConfirmationsPercent;
  mapping (string => Runner) private m_runners;

  event Created(string runnerType, string mesgIdentifier);
  event Voted(string runnerType, string mesgIdentifier, address sender, string value);
  event Confirmed(string runnerType, address selectedRunner, string mesgIdentifier);

  event Log(string x);

  function MesgStorage(uint _minConfirmationsNumber, uint _minConfirmationsPercent) public {
    owner = msg.sender;
    minConfirmationsNumber = _minConfirmationsNumber;
    minConfirmationsPercent = _minConfirmationsPercent;
  }

  function mesgStatus(string runnerType, string mesgIdentifier) public view returns (Status) { return getMesg(runnerType, mesgIdentifier).status; }
  function mesgExists(string runnerType, string mesgIdentifier) public view returns (bool) { return getMesg(runnerType, mesgIdentifier).created; }
  function mesgBestValue(string runnerType, string mesgIdentifier) public view returns (string) { return getMesg(runnerType, mesgIdentifier).bestValue; }
  function mesgBestValueCount(string runnerType, string mesgIdentifier) public view returns (uint) { return m_runners[runnerType].mesgMap[mesgIdentifier].encryptedValuesCount[mesgBestValue(runnerType, mesgIdentifier)]; }

  function add(string runnerType, string mesgIdentifier, string encryptedValue) public {
    // TODO check runner type
    // require(!validRunner(runnerType));
    Runner storage runner = m_runners[runnerType];
    Mesg storage mesg = runner.mesgMap[mesgIdentifier];

    // Ignore all new mesgs that happen after the validation
    // if we don't reject those verification, users will pay 
    // the fees but will never get the reward because the event
    // is already processed
    require(mesg.status != Status.Finished);

    // Check that the sender didn't submit it's event already
    require(!mesg.results[msg.sender].voted);

    // if the event is not yet in the database
    if (!runner.mesgMap[mesgIdentifier].created) {
      runner.mesgMap[mesgIdentifier] = createMesg(mesgIdentifier, encryptedValue);
      Created(runnerType, mesgIdentifier);
    }

    mesg.results[msg.sender] = createResult(encryptedValue);
    mesg.encryptedValuesCount[encryptedValue] += 1;
    if (mesg.encryptedValuesCount[mesg.bestValue] < mesg.encryptedValuesCount[encryptedValue]) {
      mesg.bestValue = encryptedValue;
    }

    Voted(runnerType, mesg.id, msg.sender, encryptedValue);

    if (canConfirm(runnerType, mesgIdentifier)) {
      mesg.status = Status.Confirmed;
      Confirmed(runnerType, 0x0, mesgIdentifier); // TODO find runner address and encrypt the data with it's public key
    }
  }

  function canConfirm(string runnerType, string mesgIdentifier) private view returns (bool) {
    // if (state(runnerType, mesgIdentifier) != Status.Pending) {
    //   return false;
    // }
    Mesg storage mesg = m_runners[runnerType].mesgMap[mesgIdentifier];
    uint bestSubmissionTotal = mesg.encryptedValuesCount[mesg.bestValue];
    if (bestSubmissionTotal < minConfirmationsNumber) {
      return false;
    }
    // TODO add check over the network 
    // if (bestSubmissionTotal < network.nodeForService(service)) {
    //   return false;
    // }
    return true;
  }

  function getMesg(string runnerType, string mesgIdentifier) private view returns (Mesg) {
    return m_runners[runnerType].mesgMap[mesgIdentifier];
  }

  function createMesg(string mesgIdentifier, string encryptedValue) private pure returns (Mesg) {
    return Mesg({
      created: true,
      id: mesgIdentifier,
      status: Status.Pending,
      bestValue: encryptedValue
    });
  }

  function createResult(string value) private pure returns (Result) {
    return Result({
      voted: true,
      encryptedValue: value
    });
  }
}