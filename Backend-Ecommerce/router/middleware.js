

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
    return res.sendStatus(401);
    }

    else{
    jwt.verify(token, 'secretKey', (err, user) =>{
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
  }
}

// Protected route example
app.get('/profile', authenticateToken, (req, res) => {
    // Only authenticated users can access this route
    res.json({ message: 'Access granted' });
});

export{ authenticateToken };