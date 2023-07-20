'use strict';
const { writeFileSync } = require('fs');
const lodash = require('lodash.get');

class technicalConfigPlugin {
    constructor(serverless, options) {
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

    getCanaryCfgMap() {
        const result = new Map(); 
        const globalCfg = lodash(this.serverless.service, 'custom.deploymentSettings', {}); 
        for (const [functionName, functionCfg] of Object.entries(this.serverless.service.functions)) {
            const deploymentSettings = Object.assign({}, globalCfg, functionCfg.deploymentSettings);
            if (deploymentSettings.provisionedConcurrency != null &&
                deploymentSettings.provisionedConcurrency != 0) {
                    result.set(this.provider.naming.getLambdaLogicalId(functionName), deploymentSettings);
            }
        }

        console.log(result);
        return result; 
    }

    get compiledCloudFormationTemplate() { 
        return this.serverless.service.provider.compiledCloudFormationTemplate
    }

    beforePackageFinalize() {
        console.log('Before package finalize.');

        // shorten the name of the "Resources" section on the  template
        let rsrc = this.serverless.service.provider.compiledCloudFormationTemplate.Resources; 

        console.log(' -------------------------------- AWS::Lambda::Alias --------------------------------')
        const aliases = Object.keys(rsrc)
            .filter(name => rsrc[name].Type === 'AWS::Lambda::Alias');
        console.log(aliases);

        console.log(' -------------------------------- AWS::Logs::LogGroup --------------------------------')
        const logGroups = Object.keys(rsrc)
            .filter(name => rsrc[name].Type === 'AWS::Logs::LogGroup');    
        console.log(logGroups);

        for (let key in rsrc) {
            if (rsrc[key].Type === 'AWS::Lambda::Alias') {
                console.log(`Applying provisioned concurrency for ${key}`);
                rsrc[key].Properties.ProvisionedConcurrencyConfig = {
                    ProvisionedConcurrentExecutions: canaryCfg.provisionedConcurrency,
                };
            }
            if (rsrc[key].Type === 'AWS::Logs::LogGroup') {
                if (!rsrc[key].Properties.RetentionInDays || rsrc[key].Properties.RetentionInDays === 'Never expire') {
                console.log(`Applying retention policy for ${key}`);
                    rsrc[key].Properties.RetentionInDays = 7;
                }
            }
        }
        // const stage = this.serverless.service.provider.stage || this.serverless.service.provider.s || 'dev';
        // console.log(`Stage ...: ${stage}`);

        // const canaryConfigMap = this.getCanaryCfgMap(); 
        // const resources = this.compiledCloudFormationTemplate.Resources;

        // const modifiedAlias = {}; 
        // for (const [key, resource] of Object.entries(resources)) {
        //     console.log(resource.Type);
        //     if (resource.Type === "AWS::Lambda::Alias") {
        //         const { Properties: { FunctionName, Name}, } = resource; 
        //         const functionName = FunctionName.Ref || '';

        //         console.log(`Function name: ${functionName} and name ${Name}`)
        //         if (canaryConfigMap.has(functionName)) {
        //             const canaryCfg = canaryConfigMap.get(functionName); 
        //             if (Name === canaryCfg.alias) {
        //                 resource.Properties.ProvisionedConcurrencyConfig = {
        //                     ProvisionedConcurrentExecutions: canaryCfg.provisionedConcurrency,
        //                 };
        //                 modifiedAlias[key] = resource; 
        //                 console.log(`- Addind concurrency to ${key} alias ${Name}`);
        //             }
        //         }
        //     }
        // }

        // By using the combination of Serverless Framework and AWS CloudFormation resources, you can 
        // apply provisioned concurrency to your Lambdas without using the Lambda integration with API Gateway

        // resources:
        //     Resources:
        //         HelloLambdaProvisionedConcurrencyAlias:
        //         Type: AWS::Lambda::Alias
        //         Properties:
        //             FunctionName: ${self:service}-${self:provider.stage}-hello
        //             Name: live
        //             ProvisionedConcurrencyConfig:
        //             ProvisionedConcurrentExecutions: 10


        // console.log(modifiedAlias);
        // Object.assign(this.compiledCloudFormationTemplate.Resources, modifiedAlias);
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