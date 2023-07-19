'use strict';
const { writeFileSync } = require('fs');
const lodash = require('lodash.get');

class technicalConfigPlugin {
    constructor(serverless) {
        this.serverless = serverless;
        // to bind this plugin to a specific provider
        this.provider = serverless.getProvider('aws'); 
        this.hooks = {
            'initialize': () => this.init(), 
            'before:package:finalize': () => this.beforePackageFinalize(),
            'before:package:createDeploymentArtifacts': () => this.beforePackageCreateDeploymentArtifacts(),
            'after:package:createDeploymentArtifacts': () => this.afterPackageCreateDeploymentArtifacts(),
        };
    }

    init() {
        // serverless.service contains the (resolved) serverless.yml config
        const service = this.serverless.service;
        console.log(service.Name);
    }

    afterPackageCreateDeploymentArtifacts() {
        console.log('After package create deployment artifacts.');
        writeFileSync('./config/tech-conf.json', '{}');
    }

    beforePackageFinalize() {
        console.log('Before package finalize.');
        const stage = this.serverless.service.provider.stage || this.serverless.service.provider.s || 'dev';
        console.log(`Stage ...: ${stage}`);

        const functionsWithProvisionedCanary = new Map(); 
        // const globalCfg = lodash(this.serverless.service, 'custom.deploymentSettings', {}); 
        for (const [functionName, functionCfg] of Object.entries(this.serverless.service.functions)) {
            // console.log('Function cfg:');
            // console.log(functionCfg);
            // const deploymentSettings = Object.assign({}, globalCfg, functionCfg.deploymentSettings);
            console.log('Function config provisioned concurrency:');
            console.log(functionCfg.provisionedConcurrency);
            // console.log(deploymentSettings); 
            if (functionCfg.provisionedConcurrency != null &&
                functionCfg.provisionedConcurrency != 0) {
                functionsWithProvisionedCanary.set(this.provider.naming.getLambdaLogicalId(functionName), functionCfg);
            }
        }
        console.log(functionsWithProvisionedCanary); 

        const modifiedAlias = {}; 
        const cloudFormationResources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
        for (const [key, resource] of Object.entries(cloudFormationResources)) {
            const { Properties: { FunctionName, Name} } = resource
            if (FunctionName && FunctionName.hasOwnProperty('Ref')) {
                const functionName = FunctionName.Ref; 
                if (functionsWithProvisionedCanary.has(functionName)) {
                    console.log(`Checking ${key} name ${Name} for ${functionName}`);
                    const cfg = functionsWithProvisionedCanary.get(functionName);
                    console.log(`Name ${Name}`);
                    console.log(`Cfg Alias ${cfg.alias}`);
                    if (Name ) {
                        resource.Properties.ProvisionedConcurrencyConfig = {
                            ProvisionedConcurrentExecutions: cfg.provisionedConcurrency,
                        };
                        modifiedAlias[key] = resource; 
                        console.log(`- Adding concurrency to ${key} alias ${Name}`);
                    }
                }
            }
        }

        console.log(modifiedAlias);
        Object.assign(this.serverless.service.provider.compiledCloudFormationTemplate.Resources, modifiedAlias);
    }

    beforePackageCreateDeploymentArtifacts() {
        console.log('Before package create deployment artifacts.');
        // create a file to put in config folder
        const jsonContent = {
            "owner": "estefania"
        };
        const fileContent = Buffer.from(JSON.stringify(jsonContent), 'base64').toString('ascii'); 
        writeFileSync('./config/tech-conf.json', fileContent);
    }   
}

module.exports = technicalConfigPlugin;