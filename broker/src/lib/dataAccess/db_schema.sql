-- These tables needs to be created in the database.
-- In the case of MSSQL, as is being used in this project, run this script in the database.
-- Other databases might have different syntax or the ability to use an ORM like drizzle etc. 
-- to create the tables automatically. See the documentation of the database or ORM for more information.
CREATE TABLE oauth_clients (
    id NVARCHAR(255) PRIMARY KEY,
    secret NVARCHAR(255) NOT NULL,
    redirect_uri NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE oauth_codes (
    code NVARCHAR(255) PRIMARY KEY,
    client_id NVARCHAR(255) NOT NULL,
    redirect_uri NVARCHAR(255) NOT NULL,
    user_id NVARCHAR(255) NOT NULL,
    code_challenge NVARCHAR(255) NOT NULL,
    code_challenge_method NVARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    FOREIGN KEY (client_id) REFERENCES oauth_clients(id)
);


-- Example data for some apps
-- Client id should be random UUID, secret should be random string known to the client.
-- Redirect uri should be the callback url of the client. 
-- The request redirect uri must match the redirect uri in the database. Even if the client id and secret 
-- gets leaked, the redirect uri must match preventing callbacks to 'evil.com'.
INSERT INTO oauth_clients (id, secret, redirect_uri, name) VALUES
('client1', 'secret1', 'http://mydomain.com/callback', 'App 1'),
('client2', 'secret2', 'http://yourdomain.com/callback', 'App 2');