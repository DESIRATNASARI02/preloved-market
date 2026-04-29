'use strict';

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect(`/login?errors=${encodeURIComponent('Kamu harus login terlebih dahulu')}`);
  }
  next();
}

function isGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

function isSeller(req, res, next) {
  if (req.session.user.role !== 'seller') {
    return res.redirect(`/?errors=${encodeURIComponent('Hanya seller yang bisa mengakses halaman ini')}`);
  }
  next();
}

module.exports = { isAuthenticated, isGuest, isSeller };