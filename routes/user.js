var resulta = "[";
//==========================| LOGIN |=============================
exports.login = function(req, res) {
	if (req.body.user) {
		db.query('SELECT * FROM accounts WHERE username = ?', [req.body.user], function(err, rows, fields) {
			if (rows.length > 0) {
				db.query('SELECT * FROM accounts WHERE username = ?', [req.body.user], function(err, rows, fields) {
					if (bcrypt.compareSync(req.body.password, rows[0].Password)) {
						req.session.user = req.body.user;
						req.session.accountType = rows[0].AccountType;
						res.send("<script type='text/javascript'>alert('Successfully logged in.'); window.location.replace(\"/\");</script>")
					} else {
						res.send("<script type='text/javascript'>alert('Incorrect username/password.'); window.location.replace(\"/login\");</script>")
					}
				});
			} else {
				res.send("<script type='text/javascript'>alert('No account registered.'); window.location.replace(\"/login\");</script>")
			}
		});
	}
};

//==========================| HOME |=============================
exports.home = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userId;

	if (userId == null) {
		res.redirect("/login");
		return;
	}

	res.render('home.ejs', {
		user: user
	});
};
//==========================| LOGOUT |=============================
exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		res.redirect("/");
	})
};

//==========================| REGISTER |=============================
exports.register = function(req, res) {
	if (req.body.user) {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, [req.body.user], function(err, rows, fields) {
			if (rows.length > 0) {
				res.send("<script type='text/javascript'>alert('Username is already taken.'); window.location.replace(\"/register\");</script>");
			} else {
				if (req.body.password != req.body.repassword) {
					res.send("<script type='text/javascript'>alert('Passwords do not match.'); window.location.replace(\"/register\");</script>");
				} else {
					var insert = "INSERT INTO accounts (username, password, firstname, lastname, email) VALUES ?";
					let hash = bcrypt.hashSync(req.body.password, 10);
					var values = [
						[req.body.user, hash, req.body.firstName, req.body.lastName, req.body.email]
					];
					db.query(insert, [values], function(err, rows, fields) {
						res.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/register\");</script>");
					});
				}
			}
		});
	}
	/**
	var sql1="SELECT AccID, Username FROM 'accounts' WHERE BINARY 'Username'='"+user+"";
	db.query(sql1, function(err, result){
	  if(!err){
	    var sql2 = "INSERT INTO cs_go (GSID, MemID) VALUES ('"+csgoID+"', '"+result[0].AccID+"')";
	    db.query(sql2, function(err, result){
	               if(!err){
	                  console.log("OK");
	               } else {
	                  console.log("Error");
	               }
	            });
	            var sql3 = "INSERT INTO league_of_legends (GSID, MemID) VALUES ('"+lol+"', '"+result[0].AccID+"')";
	            db.query(sql3, function(err, result){
	               if(!err){
	                  console.log("OK");
	               } else {
	                  console.log("Error");
	               }
	            });
	            var sql4 = "INSERT INTO dota_2 (GSID, MemID) VALUES ('"+dota2+"', '"+result[0].AccID+"')";
	            db.query(sql4, function(err, result){
	               if(!err){
	                  console.log("OK");
	               } else {
	                  console.log("Error");
	               }
	            });
	       } else {
	          console.log("Error");
	       }
	    });
	*/
};
//==========================| Display Brackets |=============================
exports.brackets = async function(req, res, next) {
	var sql1 = "SELECT max(Rounds) as max from teampalak.game";
	var sql2 = "SELECT max(GameID) as max from teampalak.game";
	var sql3 = "";

	var roundsMax = 0;
	var gameIDMax = 0;
	db.query(sql1, async function(err, result) {
		roundsMax = result[0].max;
		db.query(sql2, async function(err, result) {
			gameIDMax = await result[0].max;
			console.log(roundsMax, gameIDMax)
			for (var i = 1; i <= roundsMax; i++) {
				await (async function(i) {
					resulta = resulta + "[";
					console.log(i);
					console.log(resulta);
					await (async function(i) {
						for (var j = 1; j <= gameIDMax; j++) {
							console.log(j);
							await (function(j) {
								sql3 = "SELECT * FROM teampalak.tournaments INNER JOIN teampalak.game ON teampalak.tournaments.TournamentID = teampalak.game.TournaID INNER JOIN teampalak.teams ON teampalak.game.Team1ID =teampalak.teams.TeamID where Rounds = " + j + " and GameID = " + i + " UNION SELECT * FROM teampalak.tournaments INNER JOIN teampalak.game ON teampalak.tournaments.TournamentID = teampalak.game.TournaID INNER JOIN teampalak.teams ON teampalak.game.Team2ID =teampalak.teams.TeamID where Rounds = " + j + " and GameID = " + i + " Order by GameID, Rounds";
								db.query(sql3, async function(err, result) {
									if (j < roundsMax)
										resulta = resulta + String(JSON.stringify(result)) + ",";
									else
										resulta = resulta + String(JSON.stringify(result));
									console.log("sadsad" + j);
								});
							})(j);
						}
					})(i);
					if (i < gameIDMax)
						resulta = resulta + "],";
					else
						resulta = resulta + "]]";
				})(i);
				console.log("dsfdsfs" + resulta);
			};
			res.render('bracket.ejs', {});
			console.log("ds" + resulta);
		});
	});
	console.log(resulta);

	resulta = "[";
};
//==========================| Display Announcement |=============================
exports.admin = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userId;
	var announcements;
	if (userId == null) {
		res.redirect("/login");
		return;
	}

	var sql = "SELECT * from announcement";
	db.query(sql, function(err, result) {
		announcements = result;
	});
	res.render('admin.ejs', {
		result: result
	});
};

//==========================| Add Announcement |=============================
exports.addAnnouncement = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	var post = req.body;
	var announcement = post.announcement;
	var announcements;
	if (userId == null) {
		res.redirect("/login");
		return;
	}
	if (req.method == "POST") {
		var sql = "INSERT INTO announcement (announcement) VALUES ('" + dota2 + "')";
		db.query(sql, function(err, result) {
			if (!err) {
				console.log("OK");
			} else {
				console.log("Error");
			}
		});

	}
	res.redirect("/admin");
};
//==========================| Edit Announcement |=============================
exports.editAnnouncement = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	var post = req.body;
	var announcementID = post.announcementID;
	var announcements;
	if (userId == null) {
		res.redirect("/login");
		return;
	}
	if (req.method == "POST") {
		var sql = "UPDATE 'announcement' set 'announcement' WHERE (`announcementID` = '" + announcementID + "')";
		db.query(sql, function(err, result) {
			if (!err) {
				console.log("OK");
			} else {
				console.log("Error");
			}
		});

	}
	res.redirect("/admin");
};
//==========================| Delete Announcement |=============================
exports.editAnnouncement = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	var post = req.body;
	var announcementID = post.announcementID;
	var announcements;
	if (userId == null) {
		res.redirect("/login");
		return;
	}
	if (req.method == "POST") {
		var sql = "DELETE from 'announcement' WHERE (`announcementID` = '" + announcementID + "')";
		db.query(sql, function(err, result) {
			if (!err) {
				console.log("OK");
			} else {
				console.log("Error");
			}
		});

	}
	res.redirect("/admin");
};
