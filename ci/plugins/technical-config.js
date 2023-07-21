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
            'after:aws:package:finalize:mergeCustomProviderResources': () => this.beforePackageFinalize(),
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
        console.log('------------------ Functions with provisionded concurrency ------------------');
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

        console.log(' -------------------------------- AWS::Logs::LogGroup --------------------------------')
        Object.keys(rsrc)
            .filter(name => rsrc[name].Type === 'AWS::Logs::LogGroup')
            .forEach(name => {
                if (!rsrc[name].Properties.RetentionInDays || rsrc[name].Properties.RetentionInDays === 'Never expire') {
                    console.log(`Applying retention policy for ${name}`);
                        rsrc[name].Properties.RetentionInDays = 7;
                } else {
                    console.log(`Retention policy already applied for ${name}`);
                }
            });    


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
        //                  ProvisionedConcurrentExecutions: 10


        console.log(' -------------------------------- AWS::Lambda::Alias --------------------------------')
        const canaryCfgMap = this.getCanaryCfgMap();
        if (canaryCfgMap.size !== 0) {
            const modifiedAlias = {};
            Object.keys(rsrc)
            .filter(key => rsrc[key].Type === 'AWS::Lambda::Alias')
            .forEach(key => {
                const { Properties: { FunctionName, Name }} = rsrc[key];
                const canaryCfg = canaryCfgMap.get(FunctionName.Ref);
                if(canaryCfg) {
                    if (Name === canaryCfg.alias) {
                        rsrc[key].Properties.ProvisionedConcurrencyConfig = {
                            ProvisionedConcurrentExecutions: canaryCfg.provisionedConcurrency,
                        };
                        modifiedAlias[key] = rsrc[key]; 
                        console.log(`Applying provisioned concurrency for ${key}`);
                    } else {
                        console.log(`Skip applying provisioned concurrency for ${key} - ${Name} != ${canaryCfg.alias}`);
                    }
                }
            });
            Object.assign(this.compiledCloudFormationTemplate.Resources, modifiedAlias);
        
        } else {
            console.log('No functions with provisioned concurrency');
        }
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