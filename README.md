# csye7374-spring2019-project-serverless.

Set up serverless resource (SNS, Lanbda and Lambda policy)in the child AWS account using script and cloud formation scripts from csye7374-spring2019-project-serverless./deploy/cloudformation/ directory.

 ## For AWS:
 First make sure that you have installed AWS CLI in your fedora
 ```
 $ pip install awscli --upgrade --user
 ```
 
 Now, we will configure our AWS. Make sure you configure your AWS with your Access Key and Secret Key. In order to set-up the AWS infrastrucutre, use 
 the following command
 
```
 $aws configure
 
 ```
 ## Running Scripts:
Before running the scripts, it is important to make a note that all the scripts, template file should be in the same folder.

To create and configure required serverless resources using AWS CloudFormation:
```
> ./csye6225-aws-cf-create-serverless-stack.sh
```
To delete  Cloudformation Stack:
```
> ./csye6225-aws-cf-terminate-serverless-stack.sh
```

## Deploy index.js file to lambda
