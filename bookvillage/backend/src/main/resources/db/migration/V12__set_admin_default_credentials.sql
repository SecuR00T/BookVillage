UPDATE users
SET username = 'admin',
    password = SHA1('admin1234')
WHERE role = 'ADMIN'
  AND (email = 'admin@bookvillage.mock' OR username = 'admin');
