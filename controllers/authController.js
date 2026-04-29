'use strict';
const { User, UserProfile } = require('../models');
 
class AuthController {
 
  // GET /register
  static async showRegister(req, res) {
    try {
      const { errors } = req.query;
      let errorArr = errors ? decodeURIComponent(errors).split(',') : [];
      res.render('auth/register', {
        title: 'Register',
        errors: errorArr
      });
    } catch (error) {
      res.redirect(`/register?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // POST /register
  static async register(req, res) {
    try {
      const { email, password, name, phone, role } = req.body;
 
      const user = await User.create({ email, password, role: role || 'buyer' });
      await UserProfile.create({ UserId: user.id, name, phone });
 
      res.redirect('/login');
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(e => e.message);
        return res.redirect(`/register?errors=${encodeURIComponent(errors)}`);
      }
      res.redirect(`/register?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // GET /login
  static async showLogin(req, res) {
    try {
      const { errors } = req.query;
      let errorArr = errors ? decodeURIComponent(errors).split(',') : [];
      res.render('auth/login', {
        title: 'Login',
        errors: errorArr
      });
    } catch (error) {
      res.redirect(`/login?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // POST /login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
 
      const user = await User.findByEmail(email);
 
      if (!user || !user.checkPassword(password)) {
        const errors = encodeURIComponent('Email atau password salah');
        return res.redirect(`/login?errors=${errors}`);
      }
 
      const profile = await UserProfile.findOne({ where: { UserId: user.id } });
 
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile ? profile.name : user.email
      };
 
      res.redirect('/');
    } catch (error) {
      res.redirect(`/login?errors=${encodeURIComponent(error.message)}`);
    }
  }
 
  // GET /logout
  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}
 
module.exports = AuthController;