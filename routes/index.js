exports.index = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;
  db.query('SELECT * FROM accounts WHERE username = ?', [user], function(err, rows, fields) {
    res.render('home', {
      user: user,
      accountType: accountType
    });
  });
};

exports.login = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;

  if (user) {
    res.redirect('/');
  } else {
    res.render('login', {
      user: user,
      accountType: accountType
    });
  }
};

exports.register = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;

  if (user) {
    res.redirect('/');
  } else {
    res.render('register', {
      user: user,
      accountType: accountType
    });
  }
};
