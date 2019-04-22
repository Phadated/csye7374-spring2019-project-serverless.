
console.log('Loading function');
const AWS = require('aws-sdk');

 // var ses = new AWS.SES({
 //   region: "us-east-1"
 //  });
  
  
exports.handler = (event, context, callback) => {
    
    
   console.log("EVENT MESSAGE" ,  event.Records[0].Sns.Message);
   var message = event.Records[0].Sns.Message.split(",");
   const username = message[0];
   const token =    message[1];
   const domain = message[2];
   const region = message[3];
   var from =  "donotreply@"+  domain;
   var ddb = new AWS.DynamoDB();
   var currentEpochTime = Math.floor(Date.now()/1000);

   
   var ses = new AWS.SES({
     region: region
    });

   var existingParams = {
          TableName: 'csye6225',
          Key: {
              'ID' : {
                  S: username
              }
          }
        
        };
    
    ddb.getItem(existingParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
      

       console.log("CHECK EXISTING DATA LENGTH : ", Object.getOwnPropertyNames(data).length);

      
        if(Object.getOwnPropertyNames(data).length === 0 || (Object.getOwnPropertyNames(data).length > 0 && data.Item.ttl.N < currentEpochTime)){
            console.log("NO / EXPIRED ENTRY IN DATABASE. LENGTH OF DATA =  ", Object.getOwnPropertyNames(data).length);
            
            var emailParams = {
                Destination: {
                   ToAddresses: [username]
                
                },
                Message: {
                    Body: {
                        Text: {
                            Data: "http://"+domain+"/reset?email="+username+"&token="+token
                        }
                    },
                    Subject: {
                        Data: "Password Reset Link Email"
                    }
                },
                Source: from
                
            }
            console.log("RECORD FOR EMAIL: " , emailParams);
            var ttl = Math.floor(Date.now() / 1000) +  60;
            
            var tblParams = {
                  TableName: 'csye6225',
                  Item: {
                    'ID' : {S: username},
                    'TOKEN' : {S: token},
                    'ttl': {N: ttl.toString()}
                  }
                };

            console.log("RECORD FOR DYNAMODB: ", tblParams);
            
            ddb.putItem(tblParams, function(err, data) {
              if (err) {
                console.log("Error", err);
              } else {
                console.log("Success1", data);
              }
            });
            
            console.log("==SENDING EMAIL==");
            var email = ses.sendEmail(emailParams, function(err, data){
                if(err) console.log(err);
                else {
                    console.log("===EMAIL SENT===");
                    console.log(data);
                    console.log("EMAIL CODE END");
                    console.log('EMAIL: ', email);
                    context.succeed(event);
        
                }
            });
            
        }
        else {
            console.log("ACTIVE TOKEN ALREADY EXISTS");
        }
      }
    });
    
    
     
};