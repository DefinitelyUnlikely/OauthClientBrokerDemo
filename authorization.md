# Authorization

For more specific information about public vs confidential clients, see [Auth0](https://auth0.com/docs/get-started/applications/confidential-and-public-applications) as well as [oauth.net](https://oauth.net/2/client-types/).

## Confidential clients (Clients that store their secrets and tokens server-side)

Confidential clients are not a great concern when it comes to authorization. After following the oauth2.0 framework and storing the token server-side (with continous validation of the token), we can be fairly certain that the client is authorized to access the resources it claims to have access to. In an echo-system with only confidential clients (or an echo system where confidential clients share the same API key, separate from the one used by public clients), a secret API key is often enough to authorize the client when making API calls. Calls it can do directly to the actual API.

## Public clients (Clients that store their secrets and tokens client-side - accessible to the user)

Public clients, e.g SPAs, mobile apps, etc. requires more care when it comes to authorization. In these, even env variables are accessible to the user, and it is not possible to store secrets server-side. Because of these reasons, one should assume that malicious actors always have access to UI elements that might be "protected" by a user's claims. Those UI elements cannot directly implement access to any secure resource and we shouldn't assume any API calls containing the API key for public clients are automatically valid. Another layer of security needs to be added at first. 

TL;DR For public clients, assume EVERYTHING is accessible to the user. 



### All API calls for public clients go through the Identity Broker (BFF or Hybrid BFF)

Public clients do not need to store any API keys or other secrets. They don't actually ever need them at all. We may still store a token in the client, with information about the user's identity and claims. The client can still do checks against the token to know things like: "Is the user logged in?" or "What should be shown to the user?". For the everyday user, this is also enough to convey the information they need (what they can do and if they are logged in). 

A malicious user may still change the token (or the variables that uses the token information) to whatever value they like. Such a user might change their claims to that of an admin or a regular user and the client will allow that user to see UI elements related to their faked role. 

But by making sure all UI elements that need access to some resource we consider protected, go through the broker, no actual functionallity is being made accessible unless you have a valid session in the broker. 

#### The flow

The public client makes an API call for a protected resource (like fetching conversations in Cloey's chat). 
But in reality, that request is sent to a broker endpoint, not the actual API that fetches conversations. The broker can now validate their session and check if the user is allowed to fetch conversations. If they are, the broker will forward the request to the actual API and return the response to the client. At this point, the client can render the fetched conversations. 


#### Actual Implementation

First off, the broker now needs endpoints for all the resources it might be asked to access. Either the broker needs to have separate endpoints for each API endpoint (So, if our API coolAPI got endpoint a and endpoint b, the broker needs a corresponding coolAPI/a and coolAPI/b endpoint) or the broker accepts a parameter or body argument that tells it which endpoint to access and then proceed accordingly. Personally, I think separate endpoints will be easier in the long run.

Once we have our endpoints, we also need to configure CORS. We need to allow the origins matching the clients that will be using the broker as a intermediary, as well as allowing credentials (so that we may use the session cookie to determine if the user is logged in and who they actually are).

The public client will make a call to the broker endpoint, with a credentials: include header to ensure the session cookie is sent. 

Once the broker has evaluated the session, it will forward the request to the actual API endpoint. The API endpoint will then return the response to the broker, which will return the response to the public client. The public client will then render the response as it would have if it had made the call to the API endpoint directly. 

If we want to, the broker can modify the response before returning it to the public client. 
