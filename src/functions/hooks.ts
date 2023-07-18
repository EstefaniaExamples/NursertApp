import { CodeDeploy, CodeDeployClient, PutLifecycleEventHookExecutionStatusCommand } from '@aws-sdk/client-codedeploy';
import { Handler } from 'aws-lambda';

const codedeployClient = new CodeDeployClient({});
const codeDeploy = new CodeDeploy({});

export const postOk: Handler = async (event, context, callback) => {
    console.log("Entering PostTraffic Hook!");

    // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
    var deploymentId = event.DeploymentId;
    var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
    var validationTestResult = "Failed";

    // Perform PostTraffic validation tests here. Set the test result
    // to "Succeeded" for this tutorial.
    console.log("This is where PostTraffic validation tests happen.")
    validationTestResult = "Succeeded";

    var functionToTest = process.env.NewVersion;
    console.log("AfterAllowTraffic hook tests started");
    console.log("Testing new function version: " + functionToTest);

    // Complete the PostTraffic hook by sending CodeDeploy the validation status
    const params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: validationTestResult // status can be 'Succeeded' or 'Failed'
    };

    codeDeploy.putLifecycleEventHookExecutionStatus(params, (err: { stack: any; }, data: any) => {
      if (err) {
        // Validation failed.
        console.log('PostTraffic validation tests failed');
        console.log(err, err.stack);
        callback("CodeDeploy Status update failed");
      } else {
        // Validation succeeded.
        console.log("PostTraffic validation tests succeeded");
        callback(null, "PostTraffic validation tests succeeded");
      }
    });
}

export const postKo: Handler = async (event, context, callback) => {
  console.log("Entering PostTraffic Hook!");
    
  // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
  var validationTestResult = "Failed";

  // Perform PostTraffic validation tests here. Set the test result
  // to "Succeeded" for this tutorial.
  console.log("This is where PostTraffic validation tests happen.")
  // validationTestResult = "Succeeded";

  var functionToTest = process.env.NewVersion;
  console.log("AfterAllowTraffic hook tests started");
  console.log("Testing new function version: " + functionToTest);

  // Complete the PostTraffic hook by sending CodeDeploy the validation status
  const params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: validationTestResult // status can be 'Succeeded' or 'Failed'
  };

  codeDeploy.putLifecycleEventHookExecutionStatus(params, (err: { stack: any; }, data: any) => {
    if (err) {
      // Validation failed.
      console.log('PostTraffic validation tests failed');
      console.log(err, err.stack);
      callback("CodeDeploy Status update failed");
    } else {
      // Validation succeeded.
      console.log("PostTraffic validation tests succeeded");
      callback(null, "PostTraffic validation tests succeeded");
    }
  });
}



  
  
  