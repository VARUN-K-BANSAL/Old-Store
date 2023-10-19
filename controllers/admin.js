const Report = require("../models/report")
const User = require("../models/user")

const suspendUser = async (req, res) => {
    try {
        let id = req.params.uid
        let rid = req.params.rid
        let user = await User.findById(id)
        let report = await Report.findById(rid)
        user.active = false;
        report.isResolved = true;
        user.save();
        report.save();
        res.redirect('/user/adminDashboard')
    } catch (e)  {
        console.log(e);
        res.redirect('/user/adminDashboard')
    }
}
const removeSuspension = async (req, res) => {
    try {
        let id = req.params.uid
        let user = await User.findById(id)
        if(user) {
            user.active = true;
            user.save();
        }
        res.redirect('/user/adminDashboard')
    } catch (e)  {
        console.log(e);
        res.redirect('/user/adminDashboard')
    }
}

module.exports = {
    suspendUser,
    removeSuspension
}