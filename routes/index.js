
const jwtToken = require("../authorization/verifyToken");

module.exports = router => {
   
    router.use('/api/adminMaster', require('./admin/admin'));
    router.use('/api/reg_otp', require('./register/register'));
    router.use('/api/visitorCount', require('./register/visitor'));
    router.use('/api/scorSummary', [jwtToken.verifyToken] , require('./score/scoreSummary'));
    router.use('/api/questionBank', [jwtToken.verifyToken] , require('./question/question'));
    router.use('/api/partner', [jwtToken.verifyToken] , require('./partner/partner'));
    router.use('/api/district', require('./district/district'));
    router.use('/api/preRegister', require('./preregister/preregister'));
    router.use('/api/enquiry', require('./register/contact'));
    router.use('/api/zonalquestion', require('./zonal/questions/zonalquestions'));
    router.use('/api/event', require('./zonal/event/event'));
    router.use('/api/scoreboard', require('./zonal/scoreboard/scoreboard'));

    return router;
}