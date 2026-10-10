import { TopicItem } from '@/types';

export const AUTH_TOPICS: TopicItem[] = [
  {
    "id": "auth-sso",
    "slug": "single-sign-on-sso-saml-oidc",
    "pillarId": "auth",
    "branch": "right",
    "order": 1,
    "title": "Single Sign On (SSO)",
    "subtitle": "Federated identity, SAML 2.0 XML assertions, Service Provider (SP) vs Identity Provider (IdP)",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "SSO",
      "SAML",
      "Identity Federation",
      "Security",
      "Enterprise Auth"
    ],
    "summary": "Single Sign-On (SSO) allows an employee or user to authenticate once with a central Identity Provider (IdP) and securely access multiple decoupled enterprise applications without re-entering credentials.",
    "overview": "Platform engineers configure SSO to enforce centralized enterprise security controls (MFA, password rotation, conditional IP access) across Grafana, Kubernetes dashboards, cloud consoles, and internal tools.\n\nKey Concepts:\n1. Identity Provider (IdP): The authoritative entity that validates user credentials and issues tokens/assertions (e.g. Okta, Azure AD / Entra ID, Ping Identity).\n2. Service Provider (SP): The application granting access based on IdP proofs (e.g. Grafana, Datadog, AWS IAM Identity Center).\n3. SAML 2.0 (Security Assertion Markup Language):\n   - XML-based protocol widely adopted in legacy enterprise environments.\n   - SP-Initiated Flow: User visits SP -> SP generates SAML AuthnRequest -> User redirects to IdP -> User authenticates -> IdP signs SAML Assertion -> Browser POSTs assertion back to SP Assertion Consumer Service (ACS) URL.\n   - IdP-Initiated Flow: User clicks app tile in IdP portal (Okta/Azure) and posts assertion directly to SP.\n4. Modern OIDC SSO: Replaces heavy XML with lightweight JSON/REST tokens.",
    "keyConcepts": [
      {
        "title": "SP-Initiated vs IdP-Initiated SSO",
        "explanation": "SP-initiated flows begin at the application login page and protect against stolen assertion replay attacks. IdP-initiated flows begin inside the company app portal."
      },
      {
        "title": "Centralized Deprovisioning",
        "explanation": "When an employee leaves the company, revoking access in the centralized IdP immediately locks them out of all 50+ integrated internal systems and cloud consoles."
      }
    ],
    "diagram": {
      "title": "SAML 2.0 SP-Initiated SSO Flow",
      "type": "ascii",
      "code": "End User Browser                 Service Provider (Grafana)           Identity Provider (Okta)\n      |                                      |                                  |\n      | --- 1. Access Dashboard -----------> |                                  |\n      | <--- 2. Redirect with SAML Request - |                                  |\n      |                                                                         |\n      | --- 3. Forward SAML Request to IdP -----------------------------------> |\n      | <--- 4. Challenge for Credentials & MFA ------------------------------- |\n      | --- 5. Submit Password + TOTP ----------------------------------------> |\n      | <--- 6. Return Cryptographically Signed SAML Response / Assertion ------ |\n      |                                                                         |\n      | --- 7. POST Signed Assertion to ACS URL -> |\n      | <--- 8. Set Session Cookie & Grant Access - |"
    },
    "commands": [
      {
        "cmd": "curl -s https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration | jq .",
        "desc": "Query tenant OpenID Connect federation metadata",
        "example": "curl -s ..."
      },
      {
        "cmd": "openssl x509 -in idp-signing-cert.crt -text -noout",
        "desc": "Inspect IdP SAML signing certificate expiration date and subject",
        "example": "openssl x509 -in cert.crt -noout -dates"
      }
    ],
    "productionCode": {
      "language": "ini",
      "filename": "grafana-sso.ini",
      "code": "# Production Grafana SSO configuration via SAML 2.0\n[auth.saml]\nenabled = true\nallow_sign_up = true\nauto_assign_org_role = Viewer\n\n# Service Provider metadata\nentity_id = https://monitoring.internal.company.com\nassertion_consumer_service_url = https://monitoring.internal.company.com/saml/acs\n\n# Identity Provider metadata\nidp_metadata_url = https://company.okta.com/app/exk123456789/sso/saml/metadata\nsingle_logout_enabled = true\n\n# Role mapping based on Okta SAML Groups attribute\nrole_attribute_path = \"contains(groups[*], 'Platform-Admins') && 'Admin' || contains(groups[*], 'Devs') && 'Editor' || 'Viewer'\"\nname_attribute_path = displayName\nemail_attribute_path = email",
      "explanation": "Production Grafana SAML configuration mapping Okta group assertions directly to internal Admin/Editor/Viewer RBAC roles."
    },
    "gotchas": [
      {
        "issue": "Clock skew between SP and IdP causing assertion validation failures",
        "resolution": "SAML assertions include `NotBefore` and `NotOnOrAfter` timestamps. If host clocks drift by even 60 seconds, SSO fails with 'Assertion is not yet valid'. Run NTP/chrony on all cluster nodes.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the role of an Assertion Consumer Service (ACS) URL in SAML SSO?",
        "answer": "The ACS URL is the public endpoint on the Service Provider (SP) that receives, validates, and parses the signed SAML authentication assertion sent from the Identity Provider via HTTP POST.",
        "platformContext": "Must be correctly configured when federating internal tools with Okta/Azure AD."
      }
    ],
    "references": [
      {
        "title": "OASIS SAML 2.0 Technical Overview",
        "url": "http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html",
        "source": "OASIS",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which component in an SSO ecosystem authenticates user credentials and issues signed security assertions?",
        "options": [
          "Identity Provider (IdP)",
          "Service Provider (SP)",
          "Reverse Proxy",
          "RelayState"
        ],
        "answerIndex": 0,
        "explanation": "The Identity Provider (IdP, e.g. Okta, Azure AD) validates passwords, MFA, and user identity."
      }
    ]
  },
  {
    "id": "auth-saas-providers",
    "slug": "saas-identity-providers-okta-auth0-azure-ad",
    "pillarId": "auth",
    "branch": "right",
    "order": 2,
    "title": "SaaS Identity Providers (Okta, Auth0, Microsoft Entra ID)",
    "subtitle": "Directory synchronization, SCIM provisioning, conditional access, and workload identities",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Okta",
      "Auth0",
      "Entra ID",
      "SCIM",
      "Workload Identity",
      "IAM"
    ],
    "summary": "Integrate enterprise SaaS identity platforms to automate user provisioning via SCIM, enforce conditional access policies, and manage machine-to-machine workload identities.",
    "overview": "Modern organizations delegate authentication to managed SaaS providers rather than operating fragile local LDAP or Kerberos domain controllers.\n\nKey Providers:\n1. Okta: Enterprise Workforce Identity. Excels at universal directory, automated SCIM provisioning across hundreds of SaaS apps, and advanced lifecycle management.\n2. Auth0 (by Okta): Developer-first Customer Identity and Access Management (CIAM). Optimized for embedded authentication widgets, social logins, and custom JavaScript Actions rules.\n3. Microsoft Entra ID (formerly Azure Active Directory):\n   - The enterprise standard for Microsoft 365 and Azure environments.\n   - Features Conditional Access policies (e.g. require managed compliant laptop + MFA + trusted location).\n   - Workload Identity Federation: Allows Kubernetes service accounts or GitHub Actions runners to obtain short-lived Azure/AWS access tokens without static secret keys.\n\n4. SCIM Protocol (System for Cross-domain Identity Management):\n   - REST and JSON based standard for automating user onboarding and offboarding.",
    "keyConcepts": [
      {
        "title": "SCIM Automated Provisioning",
        "explanation": "When an employee is created in Okta or Entra ID, SCIM calls REST APIs on downstream tools (Slack, GitHub, AWS IAM) to automatically create accounts and assign group memberships."
      },
      {
        "title": "Zero Static Credentials with Workload Identity",
        "explanation": "Modern CI/CD pipelines (GitHub Actions) exchange their OIDC token for temporary cloud IAM credentials in AWS/Azure, eliminating long-lived leaked access keys."
      }
    ],
    "diagram": {
      "title": "SCIM Provisioning & Federation Architecture",
      "type": "ascii",
      "code": "[HR System: Workday]\n         |\n         v (Employee Hired)\n[Enterprise IdP: Okta / Microsoft Entra ID]\n         |\n    +----+----+-----------------------+\n    | (SCIM)  | (OIDC SSO)            | (Workload Identity)\n    v         v                       v\n[GitHub]  [AWS IAM Identity]     [Kubernetes Pods]\n(Accounts Created) (Console Access)  (Cloud Access without Keys)"
    },
    "commands": [
      {
        "cmd": "az account get-access-token --resource-type ms-graph",
        "desc": "Retrieve short-lived Microsoft Graph access token using Azure CLI",
        "example": "az account get-access-token"
      },
      {
        "cmd": "curl -H \"Authorization: SSWS ${OKTA_API_TOKEN}\" https://company.okta.com/api/v1/users/me",
        "desc": "Verify Okta API connectivity and inspect current service account",
        "example": "curl -H ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "github-actions-azure-oidc.yml",
      "code": "# Production GitHub Actions workflow using OIDC to authenticate to Azure without secrets\nname: Deploy to Azure via OIDC\non:\n  push:\n    branches: [main]\n\npermissions:\n  id-token: write # Required for requesting the JWT OIDC token\n  contents: read\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: 'Az CLI Login via OIDC Federated Identity'\n        uses: azure/login@v2\n        with:\n          client-id: ${{ vars.AZURE_CLIENT_ID }}\n          tenant-id: ${{ vars.AZURE_TENANT_ID }}\n          subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}\n\n      - name: 'Deploy Resources'\n        run: |\n          az group list -o table",
      "explanation": "Eliminates hardcoded passwords or long-lived service principal keys in GitHub by federating directly with Azure Active Directory."
    },
    "gotchas": [
      {
        "issue": "Orphaned accounts from manual user creation bypassing SCIM",
        "resolution": "If administrators manually invite users inside SaaS tools instead of provisioning via SCIM, offboarding the employee in Okta leaves their standalone backdoor account active. Enforce 'Strict SSO' and disable local password logins.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is SCIM and what problem does it solve for platform engineering teams?",
        "answer": "System for Cross-domain Identity Management (SCIM) is an open API standard (RFC 7644) that automates user and group provisioning between Identity Providers and SaaS applications. It eliminates manual account creation and ensures immediate account revocation upon employee termination.",
        "platformContext": "Fundamental for compliance frameworks (SOC2, ISO 27001) and enterprise IAM automation."
      }
    ],
    "references": [
      {
        "title": "RFC 7644: SCIM Protocol Specification",
        "url": "https://datatracker.ietf.org/doc/html/rfc7644",
        "source": "IETF",
        "type": "spec"
      },
      {
        "title": "Microsoft Entra ID Documentation",
        "url": "https://learn.microsoft.com/en-us/entra/identity/",
        "source": "Microsoft",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which RESTful protocol standardizes automated user onboarding and deprovisioning between IdPs and cloud apps?",
        "options": [
          "SCIM",
          "OAuth 2.0",
          "LDAP",
          "Kerberos"
        ],
        "answerIndex": 0,
        "explanation": "SCIM (System for Cross-domain Identity Management) automates user provisioning and lifecycle synchronization."
      }
    ]
  },
  {
    "id": "auth-jwt",
    "slug": "json-web-tokens-jwt-security-mechanics",
    "pillarId": "auth",
    "branch": "left",
    "order": 3,
    "title": "JSON Web Tokens (JWT)",
    "subtitle": "Header, Payload, Signature, HS256 vs RS256, verification algorithms, and security pitfalls",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "JWT",
      "RFC7519",
      "RS256",
      "Cryptography",
      "Security",
      "Tokens"
    ],
    "summary": "Stateless, cryptographically signed URL-safe tokens (RFC 7519) enabling decoupled authorization across distributed microservices without hitting a database on every request.",
    "overview": "A JSON Web Token (JWT) is a compact, self-contained string formatted as three Base64URL-encoded parts separated by periods:\n`header.payload.signature`\n\n1. Header: Specifies the token type (`JWT`) and cryptographic signing algorithm (e.g. `HS256` or `RS256`).\n2. Payload: Claims containing user identity and attributes:\n   - Registered Claims: `iss` (issuer), `sub` (subject/user ID), `aud` (audience), `exp` (expiration epoch), `nbf` (not before), `iat` (issued at).\n   - Custom Claims: `roles: [\"admin\"]`, `email`, `tenant_id`.\n3. Signature: Cryptographic hash of `Base64URL(header) + \".\" + Base64URL(payload)` computed using a secret key or private key.\n\nSymmetric (HS256) vs Asymmetric (RS256):\n- HS256: HMAC with shared secret. Both signer (Auth service) and validator (all microservices) must possess the same secret. Risk: Compromising one microservice exposes the key to forge tokens.\n- RS256: RSA with public/private key pair. Auth service signs tokens with private key. Microservices validate tokens using public keys published at the `/.well-known/jwks.json` endpoint.",
    "keyConcepts": [
      {
        "title": "Asymmetric Signing (RS256 & JWKS)",
        "explanation": "Never distribute private signing keys to downstream microservices. Downstream services fetch public keys from the JWKS (JSON Web Key Set) endpoint and verify signatures locally in CPU memory in microseconds."
      },
      {
        "title": "Token Expiration & Refresh Tokens",
        "explanation": "Access JWTs must be short-lived (5-15 minutes). Longer-lived refresh tokens stored securely (e.g. HTTP-only secure cookies) are exchanged at the auth server to obtain new access tokens."
      }
    ],
    "diagram": {
      "title": "JWT Anatomy & Cryptographic Structure",
      "type": "ascii",
      "code": "+-----------------------------+------------------------------------+-----------------------------+\n|         HEADER              |              PAYLOAD               |          SIGNATURE          |\n| {\"alg\": \"RS256\",            | {\"sub\": \"usr_981\",                 | RSASHA256(                  |\n|  \"typ\": \"JWT\"}              |  \"roles\": [\"dev\"], \"exp\": 17356}  |  base64(hdr) + \".\" +       |\n|                             |                                    |  base64(pay), private_key)  |\n+-----------------------------+------------------------------------+-----------------------------+\n       eyJhbGciOiJSUz...                     eyJzdWIiOiJ1c3...                  TJVA95OrM7E20RM...\n                               \\                      |                      /\n                                `---------------------+---------------------'\n                                             Compact URL-Safe String"
    },
    "commands": [
      {
        "cmd": "curl -s https://auth.company.com/.well-known/jwks.json | jq .",
        "desc": "Inspect public JSON Web Key Set used for verifying RS256 token signatures",
        "example": "curl -s ..."
      },
      {
        "cmd": "echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .",
        "desc": "Decode and view JWT payload claims from terminal",
        "example": "echo token | cut -d'.' -f2 | base64 -d"
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "verify_jwt.py",
      "code": "#!/usr/bin/env python3\n\"\"\"\nProduction JWT Verification using PyJWT & JWKS public key rotation\n\"\"\"\nimport jwt\nfrom jwt import PyJWKClient\n\nJWKS_URL = \"https://company.auth0.com/.well-known/jwks.json\"\nEXPECTED_AUDIENCE = \"https://api.company.com\"\nEXPECTED_ISSUER = \"https://company.auth0.com/\"\n\ndef validate_bearer_token(raw_jwt_token: str) -> dict:\n    jwks_client = PyJWKClient(JWKS_URL)\n    signing_key = jwks_client.get_signing_key_from_jwt(raw_jwt_token)\n    \n    payload = jwt.decode(\n        raw_jwt_token,\n        signing_key.key,\n        algorithms=[\"RS256\"], # Strictly whitelist RS256 to prevent 'none' algorithm attacks\n        audience=EXPECTED_AUDIENCE,\n        issuer=EXPECTED_ISSUER,\n        options={\"verify_exp\": True, \"verify_aud\": True, \"verify_iss\": True}\n    )\n    return payload",
      "explanation": "Validates incoming JWT signatures against public keys retrieved from a JWKS endpoint with strict algorithm whitelisting."
    },
    "gotchas": [
      {
        "issue": "The infamous 'alg: none' algorithm confusion attack",
        "resolution": "Vulnerable libraries allowed attackers to modify the header to `{\"alg\": \"none\"}` and strip the signature, tricking the server into accepting forged admin payloads. Always explicitly specify allowed algorithms (e.g. `algorithms=[\"RS256\"]`) in verification logic.",
        "severity": "critical"
      },
      {
        "issue": "Storing sensitive secrets inside JWT payload",
        "resolution": "JWT payloads are Base64URL encoded, NOT encrypted. Anyone who intercepts a JWT can read all payload claims in plaintext. Never store passwords, API keys, or PII inside tokens.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you revoke a stateless JWT before its expiration date?",
        "answer": "Because JWT verification is stateless, the token remains valid until `exp` unless proactive measures exist: 1) Maintain a distributed Redis token-revocation blocklist queried during verification; 2) Increment a user `token_version` in database and check claim during token refresh; 3) Keep access token lifetimes extremely short (5 minutes).",
        "platformContext": "Standard system design question for high-security distributed architectures."
      }
    ],
    "references": [
      {
        "title": "RFC 7519: JSON Web Token (JWT)",
        "url": "https://datatracker.ietf.org/doc/html/rfc7519",
        "source": "IETF",
        "type": "spec"
      },
      {
        "title": "jwt.io Token Debugger",
        "url": "https://jwt.io/",
        "source": "Auth0",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which component of a JWT proves that its payload contents have not been tampered with in transit?",
        "options": [
          "Cryptographic Signature",
          "Header Base64 encoding",
          "Issued-At (iat) claim",
          "Subject (sub) claim"
        ],
        "answerIndex": 0,
        "explanation": "The signature is generated using a secret/private key over the header and payload. Any alteration invalidates the signature."
      }
    ]
  },
  {
    "id": "auth-oauth2",
    "slug": "oauth2-framework-grant-types-pkce",
    "pillarId": "auth",
    "branch": "left",
    "order": 4,
    "title": "OAuth 2.0 Framework",
    "subtitle": "Authorization framework (RFC 6749), roles, grant types, and PKCE security for SPAs",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "OAuth2",
      "PKCE",
      "RFC6749",
      "Authorization",
      "Access Tokens"
    ],
    "summary": "Industry standard authorization framework enabling third-party applications to obtain limited access to an HTTP service on behalf of a resource owner without sharing user passwords.",
    "overview": "OAuth 2.0 is an authorization framework, not an authentication protocol. It issues scoped Access Tokens to clients.\n\nCore Roles (RFC 6749):\n1. Resource Owner: The user who owns the data and grants access.\n2. Client: The application requesting access (e.g. Next.js web app, mobile app, CLI tool).\n3. Authorization Server: Authenticates the owner and issues access tokens (e.g. Google, GitHub, Okta).\n4. Resource Server: The API hosting protected resources (accepts and validates access tokens).\n\nPrimary Grant Types:\n- Authorization Code Grant with PKCE: The modern standard for Single Page Apps (React/Next.js) and mobile apps. Protects against authorization code interception attacks.\n- Client Credentials Grant: Used for Machine-to-Machine (M2M) communication where no human user is involved (e.g. backend service A talking to backend service B).\n- Refresh Token Grant: Exchanges a valid refresh token for a fresh access token without re-prompting the user.",
    "keyConcepts": [
      {
        "title": "PKCE (Proof Key for Code Exchange)",
        "explanation": "Clients generate a random `code_verifier` and derive a cryptographic `code_challenge`. The auth server validates the verifier upon code exchange, ensuring stolen authorization codes cannot be redeemed by rogue clients."
      },
      {
        "title": "Scopes and Granular Permissions",
        "explanation": "Scopes define the boundary of requested access (e.g. `read:users`, `write:deployments`). Clients receive tokens strictly limited to approved scopes."
      }
    ],
    "diagram": {
      "title": "OAuth 2.0 Authorization Code Flow with PKCE",
      "type": "ascii",
      "code": "SPA Client (Browser)          Authorization Server (Auth0)           API Resource Server\n     |                                      |                                  |\n     | 1. Redirect to Auth with code_chal ->|                                  |\n     |    (User logs in & consents)         |                                  |\n     |<-- 2. Redirect back with Auth Code --|                                  |\n     |                                      |                                  |\n     | 3. Exchange Code + code_verifier --->|                                  |\n     |    (Server verifies hash)            |                                  |\n     |<-- 4. Returns Access Token ----------|                                  |\n     |                                                                         |\n     | 5. Request with Bearer Token -----------------------------------------> |\n     |<-- 6. Returns Protected Resources ------------------------------------ |"
    },
    "commands": [
      {
        "cmd": "curl -X POST https://auth.company.com/oauth/token -d 'grant_type=client_credentials&client_id=ID&client_secret=SEC'",
        "desc": "Obtain machine-to-machine access token via Client Credentials grant",
        "example": "curl -X POST ..."
      },
      {
        "cmd": "curl -H \"Authorization: Bearer <TOKEN>\" https://api.company.com/v1/clusters",
        "desc": "Access protected resource API using OAuth 2.0 Bearer token",
        "example": "curl -H ..."
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "m2m_client_credentials.py",
      "code": "#!/usr/bin/env python3\n\"\"\"\nProduction Machine-to-Machine OAuth 2.0 Token Retriever with automated caching\n\"\"\"\nimport time\nimport requests\n\nTOKEN_URL = \"https://auth.company.com/oauth/v2/token\"\nCLIENT_ID = \"k8s-cluster-autoscaler\"\nCLIENT_SECRET = \"super-secure-secret\"\nAUDIENCE = \"https://cloud.internal.api\"\n\n_cached_token = None\n_token_expires_at = 0\n\ndef get_access_token():\n    global _cached_token, _token_expires_at\n    now = time.time()\n    \n    # Return cached token if valid for more than 60 seconds\n    if _cached_token and _token_expires_at > (now + 60):\n        return _cached_token\n        \n    resp = requests.post(TOKEN_URL, data={\n        \"grant_type\": \"client_credentials\",\n        \"client_id\": CLIENT_ID,\n        \"client_secret\": CLIENT_SECRET,\n        \"audience\": AUDIENCE,\n    }, timeout=5)\n    resp.raise_for_status()\n    data = resp.json()\n    \n    _cached_token = data[\"access_token\"]\n    _token_expires_at = now + data.get(\"expires_in\", 3600)\n    return _cached_token",
      "explanation": "Implements an M2M client credentials token manager with automated in-memory caching and proactive renewal before expiration."
    },
    "gotchas": [
      {
        "issue": "Using legacy Implicit Grant in modern web applications",
        "resolution": "The Implicit Grant returns access tokens directly in URL fragments (#access_token=...), exposing tokens in browser history, referer headers, and proxy logs. Deprecated in OAuth 2.1; always use Authorization Code with PKCE.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between Authentication and Authorization in OAuth 2.0?",
        "answer": "Authentication proves WHO you are (Identity). Authorization determines WHAT you are allowed to access (Permissions). OAuth 2.0 is purely an authorization framework that issues access tokens for permissions. OpenID Connect (OIDC) was created on top of OAuth 2.0 to provide authentication.",
        "platformContext": "The single most common conceptual confusion tested in cloud security interviews."
      }
    ],
    "references": [
      {
        "title": "RFC 6749: The OAuth 2.0 Authorization Framework",
        "url": "https://datatracker.ietf.org/doc/html/rfc6749",
        "source": "IETF",
        "type": "spec"
      },
      {
        "title": "OAuth 2.0 Security Best Current Practice",
        "url": "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics",
        "source": "IETF",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which OAuth 2.0 grant type is designed specifically for automated backend services and microservices without user interaction?",
        "options": [
          "Client Credentials",
          "Authorization Code with PKCE",
          "Implicit Grant",
          "Device Code"
        ],
        "answerIndex": 0,
        "explanation": "Client Credentials grant is used for server-to-server and machine-to-machine communication."
      }
    ]
  },
  {
    "id": "auth-oidc",
    "slug": "oidc-openid-connect-identity-layer",
    "pillarId": "auth",
    "branch": "left",
    "order": 5,
    "title": "OIDC (OpenID Connect)",
    "subtitle": "Identity layer on top of OAuth 2.0, ID Tokens, UserInfo endpoint, and discovery documents",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "OIDC",
      "OpenID Connect",
      "ID Token",
      "Authentication",
      "Security"
    ],
    "summary": "Extends OAuth 2.0 to provide standardized user authentication via signed ID Tokens, standard profile claims, and automated metadata discovery.",
    "overview": "While OAuth 2.0 solved authorization, organizations lacked a standardized mechanism for identifying the user. OpenID Connect (OIDC) standardizes this.\n\nKey Concepts:\n1. ID Token vs Access Token:\n   - ID Token: A JWT intended strictly for the CLIENT application to consume. Contains user profile information (`sub`, `name`, `email`, `email_verified`).\n   - Access Token: Intended for the RESOURCE SERVER (API). Proves authorization to perform operations.\n2. Discovery Document (`/.well-known/openid-configuration`):\n   - Standard endpoint publishing all provider endpoints (issuer URL, authorization_endpoint, token_endpoint, jwks_uri, supported response types).\n3. UserInfo Endpoint:\n   - Protected API resource returning the authenticated user's full claims profile when presented with an access token.\n4. Kubernetes OIDC Authentication:\n   - The Kubernetes API server supports `--oidc-issuer-url` and `--oidc-client-id`, allowing developers to authenticate `kubectl` via enterprise Google, Okta, or Azure credentials.",
    "keyConcepts": [
      {
        "title": "Never Use Access Tokens for User Identity",
        "explanation": "Access tokens are opaque strings or tokens formatted for APIs. The client must verify the ID Token to establish user identity, inspect the `sub` claim, and validate the `nonce` to prevent replay attacks."
      },
      {
        "title": "Kubernetes API Server OIDC Federation",
        "explanation": "Using OIDC with Kubernetes control planes allows managing cluster access via corporate groups, eliminating individual client certificate distribution."
      }
    ],
    "diagram": {
      "title": "OIDC Token Issuance & Roles",
      "type": "ascii",
      "code": "Client App (Next.js) <=== Completes OIDC Flow ===> OIDC Provider (Okta / Google)\n        |                                                |\n        +--- Receives ID Token (JWT) <-------------------+\n        |    (Validates identity, email, sub)\n        |\n        +--- Receives Access Token (Bearer) <------------+\n        |\n        `--- Sends Access Token to Backend API ---------> Backend Microservice\n                                                          (Validates scopes)"
    },
    "commands": [
      {
        "cmd": "curl -s https://accounts.google.com/.well-known/openid-configuration | jq .jwks_uri",
        "desc": "Retrieve Google's public JWKS endpoint from its OIDC discovery document",
        "example": "curl -s ..."
      },
      {
        "cmd": "kubectl config set-credentials oidc-user --exec-command=kubelogin",
        "desc": "Configure kubectl CLI for automated enterprise OIDC token acquisition",
        "example": "kubectl config ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "kube-apiserver-oidc.yaml",
      "code": "# Snippet for /etc/kubernetes/manifests/kube-apiserver.yaml\n# Enables enterprise OIDC authentication against Okta/Google\nspec:\n  containers:\n  - command:\n    - kube-apiserver\n    - --oidc-issuer-url=https://auth.company.com\n    - --oidc-client-id=kubernetes-cluster-prod\n    - --oidc-username-claim=email\n    - --oidc-groups-claim=groups\n    - --oidc-groups-prefix=oidc:\n    - --oidc-ca-file=/etc/ssl/certs/company-ca.crt",
      "explanation": "Configures the Kubernetes API Server to natively authenticate cluster operators against an enterprise OIDC identity provider."
    },
    "gotchas": [
      {
        "issue": "Kube-apiserver rejecting OIDC tokens due to client-id / aud mismatch",
        "resolution": "The `--oidc-client-id` parameter in kube-apiserver must strictly match the `aud` (audience) claim inside the issued ID Token. If they differ, the API server rejects requests with 401 Unauthorized.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the primary technical difference between an OIDC ID Token and an OAuth 2.0 Access Token?",
        "answer": "An ID Token is a signed JWT intended specifically for the client application to read and verify the identity of the authenticated user. An Access Token is credentials issued for the Resource Server (API) to grant permissions and authorize specific API calls.",
        "platformContext": "Fundamental identity concept across modern web platforms and cloud infrastructure."
      }
    ],
    "references": [
      {
        "title": "OpenID Connect Core 1.0 Specification",
        "url": "https://openid.net/specs/openid-connect-core-1_0.html",
        "source": "OpenID Foundation",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which token in the OpenID Connect protocol is specifically intended for the client application to parse and verify user identity?",
        "options": [
          "ID Token",
          "Access Token",
          "Refresh Token",
          "CSRF Token"
        ],
        "answerIndex": 0,
        "explanation": "The ID Token is formatted as a JWT containing user identity claims specifically for the client application."
      }
    ]
  }
];
