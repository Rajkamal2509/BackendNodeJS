module.exports = {
    partnerLength : 3,
    DATA_SIZE : 50, // Questionlength 150 - changed to 50 on 05/09 
    LEADERBOARD_SIZE : 10,
    QUIZTIMER : 100, // 100 sec
    DEMO_LENGTH :100,
    DEMO_TIMER : 100,
  
    ROUND_NUMBER:
    [
       {
        round:1,count:4,timer:30
       },
       {
        round:2,count:4,timer:30
       },
       {
        round:3,count:4,timer:30
       },
       {
        round:4,count:5,timer:30
       },
       {
        round:5,count:10,timer:30
       },
       {
        round:6,count:1,timer:30
       }
    ],
    

    OTP_URL : 'https://sms.indiasms.com/SMSApi/send',
    REQ_BODY : {
        userid: "Melwyn",
        password: "ind123",
        senderid: "KALIOO",
        msgType: "unicode",
        dltEntityId: "1201164610772723930",
        dltTemplateId: "1207168690733888279",
        duplicatecheck: "true",
        sendMethod: "quick",
    }
}