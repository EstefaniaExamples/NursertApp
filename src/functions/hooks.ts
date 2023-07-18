import { CodeDeployClient, PutLifecycleEventHookExecutionStatusCommand } from '@aws-sdk/client-codedeploy';
import { Handler } from 'aws-lambda';

export const post: Handler = async (event) => {
    console.log("Entering PostTraffic Hook!");
    	
    try {
        // Read the DeploymentId and LifecycleEventHookExecutionId from the event payload
        var deploymentId = event.DeploymentId;
        var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

        var functionToTest = process.env.NewVersion;
        console.log("AfterAllowTraffic hook tests started");
        console.log("Testing new function version: " + functionToTest);

        // Inform CodeDeploy that the hook has completed successfully
        await signalHookCompletion(deploymentId, lifecycleEventHookExecutionId);

        console.log('afterAllowTraffic hook completed successfully');

    } catch (error) {
        console.error('afterAllowTraffic hook failed:', error);
        throw error;
  }
}

// Function to signal CodeDeploy that the hook has completed successfully
const signalHookCompletion = async (deploymentId: string, lifecycleEventHookExecutionId: string) => {
    const codedeployClient = new CodeDeployClient({});
    await codedeployClient.send(new PutLifecycleEventHookExecutionStatusCommand({
      deploymentId,
      lifecycleEventHookExecutionId,
      status: 'Succeeded'
    }));
  };

  
  
  