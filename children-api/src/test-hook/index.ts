'use strict';
import { CodeDeploy } from '@aws-sdk/client-codedeploy'; 

type LifecycleEvent = {
    LifecycleEventHookExecutionId: string; 
    DeploymentId: string; 
    Status: string; 
}

const codedeploy = new CodeDeploy({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testHook = async (event: LifecycleEvent, _context: any, callback: any) => {
    console.log('Executing testHook'); 
    const {
        DeploymentId: deploymentId, 
        LifecycleEventHookExecutionId: lifecycleEventHookExecutionId
    } = event; 

    /*
     Enter validation tests here.
    */

    // Prepare the validation test results with the deploymentId and
    // the lifecycleEventHookExecutionId for CodeDeploy.
    const params = {
        deploymentId: deploymentId,
        lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
        status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
    }; 

    // Pass CodeDeploy the prepared validation test results.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    codedeploy.putLifecycleEventHookExecutionStatus(params, function(err, _data) {
        if (err) {
            // Validation failed.
            callback('Validation test failed');
        } else {
            // Validation succeeded.
            callback(null, 'Validation test succeeded');
        }
    });
}