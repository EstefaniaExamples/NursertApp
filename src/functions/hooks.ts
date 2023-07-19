import { CodeDeploy } from '@aws-sdk/client-codedeploy';
import { Handler } from 'aws-lambda';

const codeDeploy = new CodeDeploy({});

export const preHook: Handler = (event, context, callback) => {
  console.log("Entering PreTraffic Hook OK!");

  // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
  var validationTestResult = "Succeeded";

  console.log("We are running some integration tests before we start shifting traffic...");
 
  // Complete the PostTraffic hook by sending CodeDeploy the validation status
  const params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: validationTestResult // status can be 'Succeeded' or 'Failed'
  };

  return codeDeploy.putLifecycleEventHookExecutionStatus(params)
    .then(data => callback(null, 'Validation test succeded'))
    .catch(err => callback('Validation test failed'));
}

export const postOk: Handler = (event, context, callback) => {
    console.log("Entering PostTraffic Hook OK!");

    // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
    var deploymentId = event.DeploymentId;
    var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
    var validationTestResult = "Succeeded";

    console.log("Check some stuff after traffic has been shifted...");
 
    // Complete the PostTraffic hook by sending CodeDeploy the validation status
    const params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: validationTestResult // status can be 'Succeeded' or 'Failed'
    };

    return codeDeploy.putLifecycleEventHookExecutionStatus(params)
      .then(data => callback(null, 'Validation test succeded'))
      .catch(err => callback('Validation test failed'));
}

export const postKo: Handler = (event, context, callback) => {
  console.log("Entering PostTraffic Hook KO!");
    
  // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
  var validationTestResult = "Failed";

  console.log("Check some stuff after traffic has been shifted...");
 
  // Complete the PostTraffic hook by sending CodeDeploy the validation status
  const params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: validationTestResult // status can be 'Succeeded' or 'Failed'
  };

  return codeDeploy.putLifecycleEventHookExecutionStatus(params)
    .then(data => callback(null, 'Validation test succeded'))
    .catch(err => callback('Validation test failed'));
}



  
  
  