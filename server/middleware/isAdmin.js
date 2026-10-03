module.exports = function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  next();
};
