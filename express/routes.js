'use strict'
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');
var connection = require('./databases').connection;
function jsonParse() {
    var parse = bodyParser.json();
    return function (req, res, next) {
        req.headers['content-type'] = 'application/json';
        parse(req, res, next)
    }
}

module.exports = function(app, passport) {
    // ====================== section 1. index page =======================
    app.get('/', getLocalUser, function(req, res) {
        if (req.isAuthenticated()) {
            var user = req.user;
            // console.log(rows);
            const query = "SELECT * from picture RIGHT JOIN" +
                "(select * from house ORDER BY rate DESC LIMIT 6) as house on picture.house_id=house.id;"
            connection.query(query, function (err, results) {
                let all_ = []
                for (let i = 0; i < results.length; i++) {
                    let single = {
                        name: results[i].name,
                        location: results[i].location,
                        id: results[i].id,
                        pic: results[i].url,
                        type: results[i].type,
                        rate: results[i].rate,
                        des: results[i].short_des
                    }
                    all_.push(single)
                }
                res.render('index.jade', {
                    user: req.user, // get the user out of session and pass to template
                    localUser: req.session.currentUser,
                    info: all_
                }); // load the index.ejs file
            })

        }
        else{

            user = null;
            const query = "SELECT * from picture RIGHT JOIN" +
                "(select * from house ORDER BY rate DESC LIMIT 3) as house on picture.house_id=house.id;"
            connection.query(query, function (err, results) {
                let all_ = []
                for (let i = 0; i < results.length; i++) {
                    let single = {
                        name: results[i].name,
                        location: results[i].location,
                        id: results[i].id,
                        pic: results[i].url,
                        type: results[i].type,
                        rate: results[i].rate,
                        des: results[i].short_des
                    }
                    all_.push(single)
                }
                res.render('index.jade', {
                    user: req.user, // get the user out of session and pass to template
                    info: all_,
                    localUser: req.localUser,

                }); // load the index.ejs file
            })
        }


    });

    app.get('/index', function(req, res) {
        res.redirect('/');
    });


    // ====================== section 2. login/sign up page =======================
    app.get('/login', notLoggedIn, getLocalUser, function(req, res) {
        req.session.originalUrl = req.headers.referer
        res.render('login.jade', { message: req.flash('loginMessage') });
    });

    app.get('/signup', notLoggedIn, function (req, res) {
        res.render('login.jade', { message: req.flash('signupMessage') })
    });


    app.post('/login',
        passport.authenticate('local-login', {
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
        }), function (req, res) {
            console.log("user " + req.user + " login.")
            res.redirect(req.session.originalUrl)
        });

    // process the signup form
    app.post('/signup',
        passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash message
        })
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    // ====================== section 3. house info page =======================
    app.get('/houseinfo/:houseid',getLocalUser, function(req, res) {

        const query = "SELECT * from house LEFT JOIN picture on house_id=house.id LEFT JOIN users" +
            " on users.id=poster where" +
            " house.id=" + req.params.houseid + ";"
        connection.query(query, function (err, results) {
            if (err) throw err;
            if (results.length === 0) {
                return res.redirect("/error")
            }
            const house = {
                house_id: results[0].house_id,
                postcode: results[0].postcode,
                location: results[0].location,
                monthlyrate: results[0].rate,
                type: results[0].type,
                picture: results[0].url,
                description: results[0].long_des,
                email : results[0].email,
                telephone : results[0].telephone,
                posterid: results[0].poster,
                username: results[0].username,
                user_des: results[0].description,
                user_pic: results[0].profilepic
            }

            res.render('houseinfo.jade', {
                user: req.user,
                info: house,
                localUser: req.localUser,

            })
        })


    });

    app.get('/posting', isLoggedIn, getLocalUser,function (req, res) {
            // console.log(rows);
            // if there are any errors, return the error
        res.render('newrent.jade', {
            user: req.user,
            localUser: req.localUser,
        })



    })
    
    app.post('/posting', isLoggedIn, getLocalUser,function (req, res) {
        // addHousing(req.body.title, req.body.short_des, req.body.description, req.body.location,
            // 'condo', req.body.price, req.body.postcode, req.user)
        let type = 'condo'
        if (req.body.type === "condo"){
            type = "condo"
        } else if (req.body.type === "house"){
            type = "house"
        }
        req.body.long_des = req.body.long_des.replace(/'/g, "\\'");
        req.body.short_des = req.body.short_des.replace(/'/g, "\\'");

        const query = "insert into house (poster, name, location, postcode, long_des, short_des, type, rate ) " +
            "values (" + req.localUser.id + ", '" + req.body.title + "', '" +
            req.body.location + "', '" + req.body.postcode + "', '" + req.body.long_des + "', '" + req.body.short_des
            + "', '" + type + "', " + req.body.price + ");";

        connection.query(query)
        if (req.body.url === undefined){
            req.body.url = "/sources/image-not-found.jpg";
        }
        connection.query("select id from house where poster=" + req.localUser.id +
            " ORDER BY id desc limit 1;", function (err, rows) {
            connection.query("insert into picture values("+rows[0].id + ", '" + req.body.url + "');");
            res.redirect('/houseinfo/' + rows[0].id);
        });




    })

    // ====================== section 4. user info page ==========================
    app.get("/userprofile/:userid", getLocalUser,function (req, res) {

        const query = "SELECT users.id, users.email,users.username, users.description, users.telephone, users.profilepic, houseid, des, url, location " +
        "from users left join (select house.id as houseid, house.poster, house.short_des as des, house.location, url" +
        " from house left join picture on house.id=picture.house_id" +
        ") as house on users.id = house.poster where users.id = " + req.params.userid +";";
        connection.query(query, function(err, rows){
            // if there are any errors, return the error
            if (err)
                console.log(err)
            if (rows.length === 0) {
                return res.redirect("/error")
            }

            // if there is no user with that email
            // create the user
            let thisuser = {};
            thisuser.email = rows[0].email;
            thisuser.id = rows[0].id;
            thisuser.username = rows[0].username;
            thisuser.description = rows[0].description;
            thisuser.telephone = rows[0].telephone;
            thisuser.profilepic = rows[0].profilepic;
            thisuser.posting = [];
            for(let i=0; i<rows.length;i++){
                thisuser.posting.push({id: rows[i].houseid, picture:rows[i].url,
                    des: rows[i].des, location: rows[i].location, houseid: rows[i].houseid});
            }
            if (req.session.currentUser===undefined){
                req.session.currentUser = {admin: false}
            }
            res.render('userprofile.jade', {
                thisuser: thisuser,
                user: req.user,
                // navbar_userid: navbar_userid,
                currentUser: req.session.currentUser,
                localUser: req.localUser
            })
            
        });            

    })

    app.post("/update", isLoggedIn, getLocalUser, function (req, res) {
        req.body.newdes = req.body.newdes.replace(/'/g, "\\'");
        const query = "UPDATE users set description='" + req.body.newdes + "\', telephone="+ req.body.telephone +", profilepic = '"
                      + req.body.profilepiclink + "' where email=\'" +
                      req.body.email + "\';"
        connection.query(query, function(err, rows){
            // console.log(rows);
            if (err)
                console.log(err)
            res.redirect(req.headers.referer)
        });
    })

    app.get("/homeSearch", getLocalUser, function (req, res) {

        const query = "SELECT * from picture RIGHT JOIN" +
            "(select * from house ORDER BY rate DESC LIMIT 3) as house on picture.house_id=house.id;";
        connection.query(query, function (err, results) {
            let all_ = []
            for (let i=0;i<results.length; i++){
                let single = {
                    name: results[i].name,
                    location: results[i].location,
                    id : results[i].id,
                    pic: results[i].url,
                    type: results[i].type,
                    rate: results[i].rate
                }
                all_.push(single)
            }
            res.render('homeSearch.jade', {
                user: req.user,
                localUser: req.localUser,
                houses: all_
            })

        })
    })

    app.post("/homesearch", getLocalUser,function (req, res) {
        let query = "";
        if (req.body.keyword){
            query = "SELECT * from picture RIGHT JOIN" +
                "(select * from house where (long_des like '%" + req.body.keyword +"%' or short_des like '%" +
                req.body.keyword +
                "%' or name like '%" + req.body.keyword + "%') ORDER BY rate LIMIT 3" +
                ") as house on picture.house_id=house.id;"
        } else {
            if (!req.body.max) req.body.max = 999999999
            if (!req.body.min) req.body.min = 0
            let type = "";
            if (req.body.type === 'condo') {
                type = " and type='condo'";
            } else if (req.body.type === 'house') {
                type = " and type='house'";
            }
            query = "SELECT * from picture RIGHT JOIN" +
                "(select * from house where rate<=" + req.body.max + " and rate>="
                + req.body.min + type + " ORDER BY rate" +
                ") as house on picture.house_id=house.id;"
        }
        connection.query(query, function (err, results) {
            if (err) console.log(err)
            let all_ = []
            for (let i=0;i<results.length; i++){
                let single = {
                    name: results[i].name,
                    location: results[i].location,
                    id : results[i].id,
                    pic: results[i].url,
                    type: results[i].type,
                    rate: results[i].rate
                }
                all_.push(single)
            }
            res.render('homeSearch.jade', {
                user: req.user,
                localUser: req.localUser,
                houses: all_
            })

        })
    })

    app.get("/listUser", getLocalUser,function (req, res) {
        if (!req.localUser.admin) res.redirect("/");
        const query = "select * from users where username!='deleted'";
        connection.query(query, function (err, results) {
            const users = [];
            for (let i=0; i<results.length;i++){
                let user = {
                    id : results[i].id,
                    username: results[i].username,
                    email: results[i].email,
                    description: results[i].description,
                    telephone: results[i].telephone,
                    profilepic: results[i].profilepic
                };
                users.push(user);
            }
            res.render('listUser.jade', {user: req.user,
                localUser: req.localUser,
                users: users
            })
        })
    })

    app.post("/delUser", getLocalUser, isLoggedIn, function (req, res) {
        if (!req.localUser.admin) res.redirect("/")
        if (req.body.delete === req.localUser.id){
            res.redirect('/')
        } else {
            const query = "update users set password=1, description='this user is already been deleted.', telephone=0, " +
                "profilepic='https://upload.wikimedia.org/wikipedia/commons/e/e0/Deleted_photo.png', username='deleted' " +
                "where id=" + req.body.delete;
            connection.query(query, function (err, result) {
                if (err) console.log(err)
            });
        }
        res.end("deleted");

    })

    app.get('/error', getLocalUser, function (req, res) {
        res.render('404.jade', {localUser: req.localUser})

    })


    app.get('/changepassword', getLocalUser, isLoggedIn,  function (req, res) {
        console.log("in get")
        res.render('changepassword.jade', { 
            user: req.user,
            localUser: req.localUser,
        })
    });

    app.post("/changepassword", getLocalUser, isLoggedIn, function (req, res) {

        let query = "select * from users where id=" + req.localUser.id + ";";
        connection.query(query, function(err, rows){
            // if there are any errors, return the error before anything else
            if (err)
                console.log(err);
            if (rows.length == 0){
                return res.redirect("/error");
            }
            if (rows.length > 0 ){
                if (rows[0].username ==="deleted" && rows[0].password == 1){
                    return res.redirect("/error");
                }
            }
            let validPassword = require('./databases').validPassword;
            // if no user is found, return the message
            if (!rows.length > 0 || !validPassword(req.body.oldpassword, rows[0].password))
                return res.redirect("/changepassword_fail");
            
            let generateHash = require('./databases').generateHash;
            let oldpassword = req.body.oldpassword;
            let newpassword = req.body.newpassword;
            let newpassword2 = req.body.newpassword2;
            if (newpassword != newpassword2){
                return res.redirect("/changepassword_fail");
            }
            let password = generateHash(newpassword)
            
            //let newpassword2 = generateHash(req.body.newpassword2)
            query = "update users set password = '"+ password+"' where id = "+req.localUser.id +";";
            connection.query(query, function(err) {
                if (err)
                    throw err;
                return res.redirect('changepassword_success');
            });
        });

    })
    app.get('/changepassword_success', getLocalUser, isLoggedIn,  function (req, res) {
        res.render('changepassword_success.jade', { 
            user: req.user,
            localUser: req.localUser,
        })
    });
    app.get('/changepassword_fail', getLocalUser, isLoggedIn,  function (req, res) {
        res.render('changepassword_fail.jade', { 
            user: req.user,
            localUser: req.localUser,
        })
    });

    app.post("/delHome", getLocalUser, isLoggedIn, function (req, res) {

        if (req.localUser.admin == 0 && !(req.body.posterid == req.localUser.id)){
            return res.redirect("/error")
        }
        const query = "update house set name = 'deleted', long_des='this house has already been deleted.', short_des='Deleted', rate = 0," +
            "postcode='Deleted', location='deleted' " +
            "where id=" + req.body.house_id +";";
        connection.query(query, function (err, result) {
            if (err) console.log(err)
        });
        const query_2 = "update picture set  " +
            "url='https://upload.wikimedia.org/wikipedia/commons/e/e0/Deleted_photo.png' " +
            "where house_id=" + req.body.house_id +";";
        connection.query(query_2, function (err, result) {
            if (err) console.log(err)
        });
        return res.redirect("/houseinfo/"+req.body.house_id);

    })

};
function getLocalUser(req, res, next) {
    if (req.user === undefined){
        req.localUser = {admin: 0, id: -1}
        return next();
    } else {
        connection.query("select * from users where email='" + req.user + "';", function (err, results) {
            if (err) throw err;
            req.localUser = {
                admin : results[0].admin,
                id : results[0].id
            };
            return next()
        })
    }
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure a user is logged in
function notLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');


}


