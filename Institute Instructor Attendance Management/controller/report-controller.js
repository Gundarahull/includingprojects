const { where } = require("sequelize")
const Logs = require("../model/log_details_model")

exports.getdailyreport = (req, res, next) => {
    Logs.findAll({ where: { signupId: req.user.id } })
        .then(result => {
            // Group the logs by date
            const groupedLogs = {};
            for (let i = 0; i < result.length ; i++) {
                const log = result[i];
                const date = log.date; 
                if (!groupedLogs[date]) {
                    groupedLogs[date] = [];
                }
                groupedLogs[date].push({ loginTime: log.logintime, logoutTime: log.logouttime });
            }

            // Calculate difference for each month
            for (const date in groupedLogs) {
                let totalDifference = 0;
                const logs = groupedLogs[date];
                for (let i = 0; i < logs.length; i++) {
                    const log = logs[i];
                    //intime
                    const timeString = (log.loginTime);
                    const timeParts = timeString.split(":");
                    let hours = parseInt(timeParts[0]);
                    const minutes = parseInt(timeParts[1]);
                    if (hours === 12) {
                        hours = 0;
                    }
                    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    console.log("format", formattedTime);

                    //outtime
                    const outtimeString = (log.logoutTime);
                    const outtimeParts = outtimeString.split(":");
                    let outhours = parseInt(outtimeParts[0]);
                    const outminutes = parseInt(outtimeParts[1]);
                    if (outhours === 12) {
                        outhours = 0;
                    }
                    const outformattedTime = `${outhours.toString().padStart(2, '0')}:${outminutes.toString().padStart(2, '0')}`;
                    console.log("oyt", outformattedTime);
                    if ((formattedTime) && (outformattedTime)) {

                        var time1Parts = outformattedTime.split(":");
                        var time2Parts = formattedTime.split(":");

                        // Convert the times into minutes
                        var time1Minutes = parseInt(time1Parts[0]) * 60 + parseInt(time1Parts[1]);
                        var time2Minutes = parseInt(time2Parts[0]) * 60 + parseInt(time2Parts[1]);

                        var differenceMinutes = time1Minutes - time2Minutes;

                        console.log("difference in minutes",differenceMinutes);
                        totalDifference += differenceMinutes;
                    }
                    console.log(totalDifference);
                }
                groupedLogs[date] = { logs: logs, totalDifference: totalDifference };
            }
            console.log(groupedLogs);

            res.render('daily-report', { groupedLogs });
        })
        .catch(err => {
            console.error('Error fetching logs:', err);
            next(err);
        });
}
exports.getreport = (req, res, next) => {
    Logs.findAll({ where: { signupId: req.user.id } })
        .then(result => {
            // Group the logs by date
            const groupedLogs = {};
            for (let i = 0; i < result.length - 1; i++) {
                const log = result[i];
                const date = log.date; 
                if (!groupedLogs[date]) {
                    groupedLogs[date] = [];
                }
                groupedLogs[date].push({ loginTime: log.logintime, logoutTime: log.logouttime });
            }

            // Calculate difference for each month
            const monthlyDifference = {};
            for (const date in groupedLogs) {
                let totalDifference = 0;
                const logs = groupedLogs[date];
                for (let i = 0; i < logs.length; i++) {
                    const log = logs[i];
                    const time1 = log.loginTime.split(":");
                    const time2 = log.logoutTime.split(":");
                    
                    let hours1 = parseInt(time1[0]);
                    const minutes1 = parseInt(time1[1]);

                    let hours2 = parseInt(time2[0]);
                    const minutes2 = parseInt(time2[1]);

                    // Convert to railway time
                    if (hours1 === 12) {
                        hours1 = 0; // 12:00 AM should be 0:00
                    }
                    if (hours2 === 12) {
                        hours2 = 0; // 12:00 AM should be 0:00
                    }
                    // Adjust for PM hours
                    if (hours1 < 12 && time1[2] === "PM") {
                        hours1 += 12;
                    }
                    if (hours2 < 12 && time2[2] === "PM") {
                        hours2 += 12;
                    }
                    
                    const time1Minutes = hours1 * 60 + minutes1;
                    const time2Minutes = hours2 * 60 + minutes2;

                    const differenceMinutes = time2Minutes - time1Minutes;
                    totalDifference += differenceMinutes;
                    console.log("total",totalDifference);
                }

                // Extract year from the date
                const [year] = date.split('-');
                
                // Update monthly difference
                if (!monthlyDifference[year]) {
                    monthlyDifference[year] = 0;
                }
                monthlyDifference[year] += totalDifference;
            }

            console.log(monthlyDifference);

            // Printing date after 30 days
            const today = new Date();
            const after30Days = new Date(today);
            after30Days.setDate(today.getDate() + 30);
            console.log("Date after 30 days:", after30Days.toLocaleDateString());

            res.render('month-report', { monthlyDifference, after30Days: after30Days.toLocaleDateString() });
        })
        .catch(err => {
            console.error('Error fetching logs:', err);
            next(err);
        });
}





exports.logout = (req, res, next) => {
    
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 

    const currentTime = `${hours}:${minutes} ${period}`;

    console.log(currentTime);

    //Update the logout time in the database
    Logs.findOne({ where: { signupId: req.user.id, logouttime: 'null' } })
        .then(logs => {
            console.log(logs);
            Logs.update({ logouttime: currentTime }, { where: { signupId: req.user.id, logouttime: 'null' } })
                .then(updated => {
                    console.log("log out done");
                    res.redirect('/login')
                }).catch(err => {
                    console.log(" errot in log not done");
                })
            // res.redirect('/login');
        }).catch(err => {
            console.log("problem in find one");
        })

}


