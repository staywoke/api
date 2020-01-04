![StayWoke Logo](https://staywoke-github.s3.us-east-1.amazonaws.com/common/logo.png "StayWoke Logo")

**[↤ Developer Overview](../README.md)**

Troubleshooting
===

This document will contain a list of known issues, and how to solve them.


Seed Errors
---

#### `ER_NET_PACKET_TOO_LARGE`

The following error can happen on machines with low memory settings for MySQL.

```
× SEED ERROR ER_NET_PACKET_TOO_LARGE: Got a packet bigger than 'max_allowed_packet' bytes
```

To fix this issue, connect as a `root` user to MySQL and run this query:

```sql
set global net_buffer_length=1000000;
set global max_allowed_packet=1000000000;
```

Lint Errors
---

#### `SyntaxError: Invalid regular expression flags`

You may see this error when you try running `npm run lint`.  If you see this error, it is because you are using an old version of Node.

You can check which version of Node you are using by running the following:

```bash
node -v
```

The supported Node version of this API is `v12.12.0` or higher. If you see anything below this output from the command above, you will need to upgrade node ( or use [NVM](https://github.com/nvm-sh/nvm) or [NVM for Windows](https://github.com/coreybutler/nvm-windows) if you need to use multiple version of node on your machine ).